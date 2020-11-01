import * as path from 'path';
import {readdir, PathLike, writeFile} from 'fs'

import { Card } from '../games/trolley/types';


function readdirAsync(dirPath: PathLike): Promise<string[]> {
  return new Promise<string[]>((resolve, reject) => {
    readdir(dirPath, (err, files) => {
      if(err) {
        return reject(err);
      }
      resolve(files);
    })
  })
}

function writeFileAsync(path: string, data: string) : Promise<void> {
  return new Promise<void>((resolve, reject) => {
    writeFile(path, data, (err) => {
      if(err) {
        return reject(err);
      }
      resolve();
    })
  })
}

function convertToDeck(files: string[]): Card[] {
  files.filter(
    (fileName) => fileName.toLowerCase().endsWith('.png')
  )
  return files.map(
    (fileName) => {
      const text = path.basename(fileName, '.png');
      return {text};
    }
  )
}

async function main() {
  /* Read the contents of public/trolley/[deck]/ to build card dec info */
  const decksPath = path.join(process.cwd(), 'public', 'trolley');
  const guiltyPath = path.join(decksPath, 'guilty');
  const innocentPath = path.join(decksPath, 'innocent');
  const modifierPath = path.join(decksPath, 'modifier');

  const guiltyFiles  = await readdirAsync(guiltyPath);
  const innocentFiles  = await readdirAsync(innocentPath);
  const modifierFiles  = await readdirAsync(modifierPath);

  const guiltyDeck = convertToDeck(guiltyFiles);
  const innocentDeck = convertToDeck(innocentFiles);
  const modifierDeck = convertToDeck(modifierFiles);

  console.log(guiltyDeck);

  const jsonPath = path.join(process.cwd(), 'games', 'trolley', 'Logic', 'Decks');
  await writeFileAsync(path.join(jsonPath, 'guilty.json'), JSON.stringify(
    guiltyDeck
  ));
  await writeFileAsync(path.join(jsonPath, 'innocent.json'), JSON.stringify(
    innocentDeck
  ));
  await writeFileAsync(path.join(jsonPath, 'modifier.json'), JSON.stringify(
    modifierDeck
  ));
}
main();
