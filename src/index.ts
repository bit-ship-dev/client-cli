import { defineCommand, runMain } from "citty";
import {setupConsola} from "./services/consola";
import {setupConfig} from "./services/config";
import {setupStorage} from "./services/storage";


const main = defineCommand({
  meta: {
    name: "bit-ship",
    version: "1.0.0",
    description: "Bit-Ship CLI https://bit-ship.dev/",
  },
  subCommands: {
    analyse: () => import("./modules/analyse/analyse").then((r) => r.default),
    run:() => import("./modules/run/run").then((r) => r.default),
    settings:() => import("./modules/settings/settings").then((r) => r.default),
  }
});


setupStorage();
setupConfig('./');
setupConsola();
runMain(main);
