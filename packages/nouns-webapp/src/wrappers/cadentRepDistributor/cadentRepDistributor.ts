import cadentRepDistributorABI from "./abi";
import { utils } from 'ethers';
import config from '../../config';
import { useContractCall, useContractFunction, useEthers } from '@usedapp/core';
import { Contract } from '@ethersproject/contracts'

const abi = new utils.Interface(cadentRepDistributorABI);

export const useCadentCall = (funcName: string, funcArgs: any[]) => {
    const result = useContractCall({
        abi: abi,
        address: config.addresses.cadentDistributorAddress,
        method: funcName,
        args: funcArgs
    });

    return result;
}

export const useCadentFunction = (prettyName: string, funcName: string, funcArgs: any[]) => {
    const contract = new Contract(config.addresses.cadentDistributorAddress, abi) as any;
    const { state, send } = useContractFunction(contract, funcName, { transactionName: prettyName })
    return { state, send};
}