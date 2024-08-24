import {createStorage, restoreSnapshot, type Storage} from "unstorage";
import fsDriver from "unstorage/drivers/fs";
import consola from "consola";
import os from 'os';


// Get the home directory path
const homeDir = os.homedir();

let storage! : Storage

export const setupStorage = () => {
  storage = createStorage({
    // TODO store it to home folder
    driver: fsDriver({ base: `${homeDir}/.bit-ship` }),
  });
}


export const useStorage = (): Storage => {
  if (!storage)  {
    consola.error("Storage not initialized")
  }

  return storage
}
