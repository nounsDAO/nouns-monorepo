import atxDaoNftAbi from "./abi";
import { utils } from 'ethers';
import config from '../../config';
import { useContractCall, useContractFunction } from '@usedapp/core';
import { Contract } from '@ethersproject/contracts'

const abi = new utils.Interface(atxDaoNftAbi);

export const useNftCall = (funcName: string, funcArgs: any[]) => {
    const result = useContractCall({
        abi: abi,
        address: config.addresses.atxDaoAddress,
        method: funcName,
        args: funcArgs
    });

    return result;
}

export const useNftFunction = (prettyName: string, funcName: string, funcArgs: any[]) => {
    const contract = new Contract(config.addresses.atxDaoAddress!, abi) as any;
    const { state, send } = useContractFunction(contract, funcName, { transactionName: prettyName })
    return { state, send};
}