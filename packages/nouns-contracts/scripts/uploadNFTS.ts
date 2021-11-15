import { NFTStorage, File } from 'nft.storage';
import { readdirSync, readFileSync, mkdirSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

type MetadataParams = {
  name: string;
  CID: string;
};

const generateMetadata = ({ name, CID }: MetadataParams) => ({
  name,
  description: `lol #${name}`,
  image: ['ipfs:/', CID, name].join('/'),
});

export const uploadNFTS = async (path: string): Promise<void> => {
  const client = new NFTStorage({ token: process.env.APIKEY! });

  const files = readdirSync(path);
  const fileObjs = files.map(fileName => {
    const name = fileName.split('.')[0];
    const filePath = join(path, fileName);
    return new File([readFileSync(filePath)], name);
  });

  const assetsCID = await client.storeDirectory(fileObjs);

  const jsonPath = join(__dirname, 'whales_json');

  if (!existsSync(jsonPath)) {
    mkdirSync(jsonPath);
  }

  files.forEach(fileName => {
    const name = fileName.split('.')[0];
    const metadata = generateMetadata({ name, CID: assetsCID });
    const metadataPath = join(jsonPath, `${name}.json`);
    writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  });

  const jsonFileNames = readdirSync(jsonPath);
  const jsonFileObjs = jsonFileNames.map(fileName => {
    const name = fileName.split('.')[0];
    const filePath = join(jsonPath, fileName);
    return new File([readFileSync(filePath)], name);
  });

  const metadataCID = await client.storeDirectory(jsonFileObjs);

  console.log(`Assets Directory CID: ${assetsCID}`);
  console.log(`Metadata Directory CID: ${metadataCID}`);
};

uploadNFTS(process.argv.slice(-1)[0]);
