
import { useContractCall } from '@usedapp/core';
import { BigNumber as EthersBN, utils } from 'ethers';
import config from '../config';
import repTokensABI from './repTokensAbi';

const abi = new utils.Interface(repTokensABI);

export interface RepTokens {
    mintCount: EthersBN;
  }

export const useRepCall = (funcName: string, funcArgs: any[]) => {
    const nft = useContractCall<RepTokens>({
        abi,
        address: config.repTokensAddress,
        method: funcName,
        args: funcArgs
    });

    console.log(nft);
    return nft /* as AtxDaoNFT */ ;
}