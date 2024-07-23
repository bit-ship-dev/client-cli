import { defineCommand, runMain } from "citty";
import analyse  from "./modules/analyse/analyse";

import run from "./modules/run/run";

const main = defineCommand({
  meta: {
    name: "bship-cli",
    version: "1.0.0",
    description: "Bitship cli",
  },
  subCommands: {
    analyse,
    run
  }
});

runMain(main);
