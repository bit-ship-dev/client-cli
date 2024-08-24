import consola from "consola";
import {defineCommand} from "citty";
import {ofetch} from "ofetch";
import type {Report, Config} from '@repo/ts/types/index.d';
import {readFile, unlink} from 'fs/promises'
import {useConfig} from "../../services/config";
import {useContainer} from '../../services/container';

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
    const report = await getReport(args.path)
    const tools = await fetchTools()
    const config = await manualValidation(report, tools)
    consola.start('We are preparing image for you');

    await setConfig(config);
    consola.success('Configuration saved');
  },
});


async function getReport(path: string): Promise<Report> {
  const reportFile = 'tmp_report.json';
  consola.start(`Analyse your project ${path}`);
  const {runContainer} = useContainer();
  await runContainer({
    containerName : 'analyser-cli-'+Date.now(),
    image: 'bitship/analyser-cli',
    detouched: true,
    script: 'node /analyser-cli/index.js',
    volumes: [
      `${path}:/app`
    ],
    env:{
      STORE_REPORT_LOCALLY: reportFile,
    }
  });

  const report: Report = JSON.parse(await readFile(reportFile, 'utf8'))
  await unlink(reportFile);
  consola.success('Analysis completed');
  return report;
}

async function manualValidation(report: Report, tools): Promise<Config>  {
  report.scripts.build.sort(highToLow);
  report.scripts.start.sort(highToLow);
  report.scripts.dev.sort(highToLow);
  report.scripts.qa.sort(highToLow);

  consola.box('Scripts Configuration');

  const build = await consola.prompt('What is your build script?', {
    placeholder: 'Your build script',
    initial: report.scripts.build[0].script,
  });

  const dev = await consola.prompt('What is your dev script?', {
    placeholder: 'Your dev script',
    initial: report.scripts.dev[0].script,
  });

  const start = await consola.prompt('What is your start script?', {
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

  return
}


async function fetchTools() {
  const tools = await ofetch('http://localhost:3000/api/public/v1/tools')
  return tools
}


const highToLow = (a: any, b: any) =>  b.value - a.value;
