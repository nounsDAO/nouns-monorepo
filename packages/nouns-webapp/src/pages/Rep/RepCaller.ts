import { useContractCall } from '@usedapp/core';
import repTokensABI from "../../wrappers/repTokensAbi";
import { utils } from 'ethers';
import config from '../../config';

const abi = new utils.Interface(repTokensABI);

export const useRepCall = (funcName: string, funcArgs: any[]) => {
    const result = useContractCall({
        abi: abi,
        address: config.addresses.repTokensAddress,
        method: funcName,
        args: funcArgs
    });

    return result;
}