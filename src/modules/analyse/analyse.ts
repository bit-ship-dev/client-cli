import consola from "consola";
import {defineCommand} from "citty";
import {useContainer} from '../../services/container';


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
    const {runContainer} = useContainer();
    consola.log(`Analyse your project ${args.path}`);
    runContainer({
      containerName : 'analyser-cli-'+Date.now(),
      image: 'bitship/analyser-cli',
      script: 'node /analyser-cli/index.js',
      // script: 'ls /app',
      volumes: [
        `${args.path}:/app`
      ],
      env:{
        STORE_REPORT_LOCALLY: 'report.json',
      }
    });




  },
});
