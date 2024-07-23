import {spawn} from 'child_process';
import chalk from "chalk";


export const useContainer = () => ({
  runContainer
})

const runContainer = async (opts: RunOptions) => {
  const command = spawn('docker', [
    'run', '--rm',
    '--name', opts.containerName,
    '-w', '/app',
    opts.image, ...opts.script.split(' ')
  ]);

  const log = opts.detouched ?
    (_output: any) => {} :
    (output: any) => {
      console.log(output)
    }

  log(chalk.bgMagentaBright('-------------------------- running task'))
  command.stdout.on('data', (data: any) => log(`${data}`));
  command.stderr.on('data', (data: any) => log(`${data}`));
  command.on('close', (code: any) =>
    log(`--------------------------/ task finished code: ${code}`));
}



interface RunOptions {
  containerName: string;
  image: string;
  script: string;
  detouched?: boolean;
  ports?: string[];
  volumes?: string[];
}
