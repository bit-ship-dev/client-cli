import consola from "consola";
import {defineCommand} from "citty";
import {useContainer} from '../../services/container';





export default defineCommand({
  meta: {
    name: "analyse",
    description: "Analyse your project"
  },
  args: {
  },
  run({ args }) {
    const {runContainer} = useContainer();
    consola.log("Analyse your project");
    useContainer().runContainer({containerName: 'test', image: 'alpine', script: 'ls -la'});
  },
});
