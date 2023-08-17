import cadentRepDistributorABI from "./abi";
import { utils } from 'ethers';
import config from '../../config';
import { useContractCall, useContractFunction } from '@usedapp/core';
import { Contract } from '@ethersproject/contracts'

const abi = new utils.Interface(cadentRepDistributorABI);

export const useCadentCall = (funcName: string, funcArgs: any[], address: string = config.addresses.cadentDistributorAddress!) => {
    const result = useContractCall({
        abi: abi,
        address: address,
        method: funcName,
        args: funcArgs
    });

    return result;
}

export const useCadentFunction = (prettyName: string, funcName: string, funcArgs: any[], address: string = config.addresses.cadentDistributorAddress!) => {
    
    if (address === undefined) {
        address = "0x0000000000000000000000000000000000000000";
    }

    const contract = new Contract(address, abi) as any;
    const { state, send } = useContractFunction(contract, funcName, { transactionName: prettyName })
    return { state, send};
}