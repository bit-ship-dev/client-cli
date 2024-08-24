import consola from "consola";
import {defineCommand} from "citty";
import {useContainer} from '../../services/container';
import type {Report} from '@repo/ts/types/analyser';
import {readFile, unlink} from 'fs/promises'
import {useConfig} from "../../services/config";
import {ofetch} from "ofetch";
import {Config} from "@repo/ts/types/config";

const {setConfig} = useConfig();


export default defineCommand({
  meta: {
    name: 'analyse',
    description: 'Analyse your project',
  },
  args: {
    path: {
      type: 'string',
      description: 'Path to the project',
      default: './',
      required: false,
    }
  },
  async run({ args }) {
    const reportFile = 'tmp_report.json';
    consola.start(`Analyse your project ${args.path}`);
    const {runContainer} = useContainer();
    await runContainer({
      containerName : 'analyser-cli-'+Date.now(),
      image: 'bitship/analyser-cli',
      detouched: true,
      script: 'node /analyser-cli/index.js',
      volumes: [
        `${args.path}:/app`
      ],
      env:{
        STORE_REPORT_LOCALLY: reportFile,
      }
    });

    const report: Report = JSON.parse(await readFile(reportFile, 'utf8'))
    await unlink(reportFile);
    consola.success('Analysis completed');


    const tools = await fetchTools()
    const config = await manualValidation(report, tools)
    setConfig(config);
    consola.success('Configuration saved');
    consola.start('We are preparing image for you');
    // TODO request image build
  },
});


async function manualValidation(report: Report, tools): Promise<Config>  {

  const highToLow = (a: any, b: any) =>  b.value - a.value;

  report.scripts.build.sort(highToLow);
  report.scripts.start.sort(highToLow);
  report.scripts.dev.sort(highToLow);
  report.scripts.qa.sort(highToLow);


  consola.box('Scripts Configuration');

  const build = await consola.prompt('What is your build scipt?', {
    placeholder: 'Your build script',
    initial: report.scripts.build[0].script,
  });

  const dev = await consola.prompt('What is your dev scipt?', {
    placeholder: 'Your dev script',
    initial: report.scripts.dev[0].script,
  });

  const start = await consola.prompt('What is your start scipt?', {
    placeholder: 'Your start script',
    initial: report.scripts.start?.[0]?.script || '',
  });

  consola.box('Dependencies configuration');

  const formattedOptions = Object.entries(report.OSDependencies)
    .map(([key, value]) => {
      return {value: key, label: `${key} -> ${value.version}`}
    })

  const dependencies = await consola.prompt(
    'Found these dependencies. Would you like to remove any?',
    {
      type: 'multiselect',
      options: formattedOptions,
      required: false,
    }
  );

  const pickedTools = await consola.prompt('Add any more tooling', {
    type: 'multiselect',
    required: false,
    options: Object.keys(tools).map((tool) =>
      ({label: tools[tool].label, value: tool, hint: tools[tool].description})
    )
  });

  return {
    version: report.version,
    scripts: {},
    dependencies: {},
  }
}


async function fetchTools() {
  const tools = await ofetch('http://localhost:3000/api/public/v1/tools')
  return tools
}
