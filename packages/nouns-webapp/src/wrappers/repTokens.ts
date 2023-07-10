
import { useContractCall, Polygon} from '@usedapp/core';
import { ethers, BigNumber as EthersBN, utils, Contract } from 'ethers';
import config from '../config';
import repTokensABI from './repTokensAbi';
const abi = new utils.Interface(repTokensABI);

export interface RepTokens {
    mintCount: EthersBN;
    uri: string;
  }

export const useRepCall = (funcName: string, funcArgs: any[]) => {

    let customHttpProvider = new ethers.providers.JsonRpcProvider("https://polygon-mainnet.infura.io/v3/");

    const contract = new Contract('0x57AA5fd0914A46b8A426cC33DB842D1BB1aeADa2', abi, customHttpProvider);
    console.log(contract);
    const balance = useContractCall({
        abi: abi,
        address: '0x57AA5fd0914A46b8A426cC33DB842D1BB1aeADa2',
        method: funcName,
        args: funcArgs
      });

      console.log(balance);
    // const config = {
    //     readOnlyChainId: Polygon.chainId,
    //     readOnlyUrls: {
    //       [Polygon.chainId]: 'https://polygon-mainnet.infura.io/v3/ecbce20c9ec548f6a84b1c3f41f99549',
    //     },
    //   }
      
    // const result = useContractCall<RepTokens>({
    //     abi,
    //     address: config.addresses.repTokensAddress,
    //     method: funcName,
    //     args: funcArgs
    // });

    return balance as any;
}