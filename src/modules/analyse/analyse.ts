import consola from "consola";
import {defineCommand} from "citty";
import {useContainer} from '../../services/container';


export default defineCommand({
  meta: {
    name: "analyse",
    description: "Analyse your project"
  },
  run({ args }) {
    const {runContainer} = useContainer();
    consola.log("Analyse your project");
    runContainer({containerName: 'test', image: 'alpine', script: 'ls -la'});

  },
});
