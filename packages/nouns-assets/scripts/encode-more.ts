import { PNGCollectionEncoder } from '@nouns/sdk';
import { promises as fs } from 'fs';
import path from 'path';
import { readPngImage } from './utils';
import { palette } from '../src/image-data_v2.json';

/**
 * @notice creates an additional art json file. it assumes it's not the first one.
 *   it also assumes the existing palette from the first one has all the needed colors.
 * @sourceFolder a folder containing subfolders with the names: ['1-bodies', '2-accessories', '3-heads', '4-glasses']
 * @destinationFilepath wher to save the new json file
 */
const encode = async (sourceFolder: string, destinationFilepath: string) => {
  const encoder = new PNGCollectionEncoder(palette);

  const partfolders = ['1-bodies', '2-accessories', '3-heads', '4-glasses'];
  for (const folder of partfolders) {
    const folderpath = path.join(sourceFolder, folder);
    const files = await fs.readdir(folderpath);
    for (const file of files) {
      const image = await readPngImage(path.join(folderpath, file));
      encoder.encodeImage(file.replace(/\.png$/, ''), image, folder.replace(/^\d-/, ''));
    }
  }
  await fs.writeFile(
    destinationFilepath,
    JSON.stringify(
      {
        images: encoder.data.images,
      },
      null,
      2,
    ),
  );
};

encode(process.argv[2], process.argv[3]);
