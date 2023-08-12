
import { useContractCall } from '@usedapp/core';
import atxDaoABI from './atxDaoNFTAbi';
import { BigNumber as EthersBN, utils } from 'ethers';
import config from '../config';

import { CadentRepDistributorABI } from '../pages/Rep/CadentRepDistributorABI';

const abi = new utils.Interface(atxDaoABI);
const cadentRepInterface = new utils.Interface(CadentRepDistributorABI);

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

export const useCadentCall = (funcName: string, funcArgs: any[]) => {
    const result = useContractCall<AtxDaoNFT>({
        cadentRepInterface,
        address: config.addresses.cadentDistributorAddress,
        method: funcName,
        args: funcArgs
    });

    return result as any;
}