import { useContractCall } from '@usedapp/core';
import repABI from "./abi";
import { utils } from 'ethers';
import config from '../../config';

const abi = new utils.Interface(repABI);

export const useRepCall = (funcName: string, funcArgs: any[], address: string = config.addresses.repTokensAddress! ) => {
    const result = useContractCall({
        abi: abi,
        address: address,
        method: funcName,
        args: funcArgs
    });
    return result;
}