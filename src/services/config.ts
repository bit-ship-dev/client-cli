import {parseYAML, stringifyYAML} from "confbox";
import {readFile} from "fs/promises";
import {writeFile} from "unstorage/drivers/utils/node-fs";
import {ClientConfig} from './config.d'
import consola from "consola";

let path = '.'
let config = {}

const getConfig = () => config


const setConfig = (newConfig: ClientConfig) => {
  config = newConfig;
  writeFile(`${path}/bit-ship.yml`, stringifyYAML(newConfig));
}

const loadConfig = async () => {
  try {
    const configStr = await readFile(`${path}/bit-ship.yml`, 'utf8');
    config = parseYAML(configStr);
  } catch (err) {
    consola.warn('No bit-ship.yml file found. Create it with analyse command');
  }
}


export const setupConfig = async() => {
  await loadConfig()
}


export const useConfig = () => ({
  getConfig,
  setConfig,
  loadConfig
})
