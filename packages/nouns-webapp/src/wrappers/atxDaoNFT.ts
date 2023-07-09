
import { useContractCall } from '@usedapp/core';
import atxDaoABI from './atxDaoNFTAbi';
import { BigNumber as EthersBN, utils } from 'ethers';
import config from '../config';

const abi = new utils.Interface(atxDaoABI);

export interface AtxDaoNFT {
    mintCount: EthersBN;
  }

export const useCall = (funcName: string, funcArgs: any[]) => {
    const nft = useContractCall({
        abi,
        address: config.atxDaoAddress,
        method: funcName,
        args: funcArgs
    });

    console.log(nft);
    return nft /* as AtxDaoNFT */ ;
}