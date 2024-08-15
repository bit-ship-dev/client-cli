import { defineCommand, runMain } from "citty";



const main = defineCommand({
  meta: {
    name: "bship-cli",
    version: "1.0.0",
    description: "Bitship cli",
  },
  subCommands: {
    analyse: () => import("./modules/analyse/analyse").then((r) => r.default),
    run:() => import("./modules/run/run").then((r) => r.default),
  }
});

runMain(main);
