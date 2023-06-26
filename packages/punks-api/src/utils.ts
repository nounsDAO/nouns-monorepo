import { nounsTokenContract, redis, storage } from './clients';
import { TokenMetadata } from './types';
import { tryF, isError } from 'ts-try';
import sharp from 'sharp';

/**
 * Get the token metadata cache key
 * @param tokenId The token ID
 */
export const getMetadataKey = (tokenId: string): string => `metadata_${tokenId}`;

/**
 * Get the token metadata for the provided `tokenId`
 * @param tokenId The token ID
 */
export const getTokenMetadata = async (tokenId: string): Promise<undefined | TokenMetadata> => {
  const key = getMetadataKey(tokenId);
  const cachedMetadata = await redis.get(key);

  if (cachedMetadata) {
    return JSON.parse(cachedMetadata);
  }

  const dataURI = await tryF(() => nounsTokenContract.dataURI(tokenId));
  if (isError(dataURI)) {
    console.error(`Error fetching dataURI for token ID ${tokenId}: ${dataURI.message}`);
    return;
  }

  const data: TokenMetadata = JSON.parse(
    Buffer.from(dataURI.substring(29), 'base64').toString('ascii'),
  );
  const svg = Buffer.from(data.image.substring(26), 'base64');
  const png = await sharp(svg).png().toBuffer();
  const imageCID = await storage.storeBlob(png);

  const metadata = {
    name: data.name,
    description: data.description,
    image: `ipfs://${imageCID}`,
  };
  await redis.set(key, JSON.stringify(metadata));

  return metadata;
};
