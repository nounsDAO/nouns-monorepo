import { PNGCollectionEncoder, PngImage } from '@nouns/sdk';
import { promises as fs } from 'fs';
import path from 'path';
import { readPngImage } from './utils';

const DESTINATION = path.join(__dirname, '../src/image-data.json');

const encode = async () => {
  const encoder = new PNGCollectionEncoder();

  const partfolders = ['1-types', '2-necks', '3-cheekses', '4-faces', '5-beards', '6-mouths', '7-earses', '8-hats', '9-hairs', '10-teeths', '11-lipses', '12-emotions', '13-eyeses', '14-glasseses', '15-goggleses', '16-noses'];
  for (const folder of partfolders) {
    const folderpath = path.join(__dirname, '../images/', folder);
    const files = await fs.readdir(folderpath);
    for (const file of files) {
      if(!path.parse(file).name.endsWith("x4")) continue
      const image = await readPngImage(path.join(folderpath, file));
      encoder.encodeImage(file.replace(/\.png$/, ''), image, folder.replace(/^\d\d?-/, ''));
    }
  }
  await fs.writeFile(
    DESTINATION,
    JSON.stringify(
      {
//        bgcolors: ['d5d7e1', 'e1d7d5'],
        ...encoder.data,
      },
      null,
      2,
    ),
  );
};

encode();
