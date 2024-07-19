import { defineCommand, runMain } from "citty";

const main = defineCommand({
  meta: {
    name: "clien-cli",
    version: "1.0.0",
    description: "Bitship client cli",
  },
  args: {
    name: {
      type: "positional",
      description: "Your name",
      required: true,
    },
    friendly: {
      type: "boolean",
      description: "Use friendly greeting",
    },
  },
  run({ args }) {
    console.log(`${args.friendly ? "Hi" : "Greetings"} ${args.name}!`);
  },
});

runMain(main);
