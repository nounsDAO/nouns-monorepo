import tmp from 'tmp';
import fs from 'fs';
import { getNounPngBuffer } from '../utils';
import { config } from '../config';
import { pinataClient } from '../clients';
import { PinataPinOptions } from '@pinata/sdk';

/**
 * Attempt to generate the PNG for a given nounId and upload
 * it to Pinata to be accessed through IPFS
 * @param nounId ERC721 ID of the noun to generate and upload
 * @returns PinataPinResponse if successful, undefined if unsuccessful
 */
export const generateAndUploadPng = async (nounId: number) => {
  if (!config.pinataEnabled) return;
  const png = await getNounPngBuffer(nounId.toString());
  if (!png) {
    console.error(`Couldn't generate png for nounId ${nounId}`);
    return;
  }
  const tmpobj = tmp.fileSync();
  console.log('File: ', tmpobj.name);
  console.log('Filedescriptor: ', tmpobj.fd);
  fs.writeFileSync(tmpobj.fd, png);
  return await uploadAndPinNounFromDisk(nounId, tmpobj.name);
};

/**
 * Upload and pin a Noun image file from disk
 * @param nounId NounID for the image, used in the pin name
 * @param localPngPath Path to the png on disk
 * @returns Promise yielding PinataPinResponse
 */
export const uploadAndPinNounFromDisk = async (nounId: number, localPngPath: string) => {
  if (!config.pinataEnabled) return;
  const options: PinataPinOptions = {
    pinataMetadata: {
      name: `Noun ${nounId}`,
    },
    pinataOptions: {
      cidVersion: 0,
    },
  };
  return pinataClient.pinFromFS(localPngPath, options);
};

/**
 * Process a new auction based on NounId.
 *
 * This will upload the Noun image to IPFS and pin it on Pinata
 * @param nounId NounID to process
 * @returns PinataPinResponse if successful, undefined if unsuccessful
 */
export const processNewAuction = async (nounId: number) => {
  return await generateAndUploadPng(nounId);
};
