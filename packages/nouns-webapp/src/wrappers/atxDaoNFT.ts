
import { useContractCall } from '@usedapp/core';
import atxDaoABI from './atxDaoNFTAbi';
import { BigNumber as EthersBN, utils } from 'ethers';
import config from '../config';

const abi = new utils.Interface(atxDaoABI);

export interface AtxDaoNFT {
    mintCount: EthersBN;
  }

export const useNFTCall = (funcName: string, funcArgs: any[]) => {
    const result = useContractCall<AtxDaoNFT>({
        abi,
        address: config.addresses.atxDaoAddress,
        method: funcName,
        args: funcArgs
    });

    return result as any;
}