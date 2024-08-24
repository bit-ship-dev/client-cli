import {parseYAML, stringifyYAML} from "confbox";
import {readFile} from "fs/promises";
import {writeFile} from "unstorage/drivers/utils/node-fs";
import {Config} from "@repo/ts/types/config";



let path = ''
let config = {}

const getConfig = () => config


const setConfig = (newConfig: Config) => {
  config = newConfig;
  writeFile(`${path}/bit-ship.yml`, stringifyYAML(newConfig));
}

const loadConfig = async () => {
  const configStr = await readFile(`${path}/bit-ship.yml`, 'utf8');
  config = parseYAML(configStr);
}


export const setupConfig = async(newPath: string) => {
  path = newPath;
  await loadConfig()
}


export const useConfig = () => ({
  getConfig,
  setConfig,
  loadConfig
})
