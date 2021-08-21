import { useCallback, useState } from 'react';
import { usePromiseTransaction } from '@usedapp/core/dist/esm/src/hooks/usePromiseTransaction';
import { Contract } from '@ethersproject/contracts';
import { TransactionOptions, useEthers, connectContractToSigner } from '@usedapp/core';

// Temporary fix: https://github.com/EthWorks/useDApp/issues/289

export const useContractFunction__fix = (
  contract: Contract,
  functionName: string,
  options?: TransactionOptions,
) => {
  const { library, chainId } = useEthers();
  const [events, setEvents] = useState<Record<string, any> | undefined>(undefined);

  const { promiseTransaction, state } = usePromiseTransaction(chainId, options);

  const send = useCallback(
    async (...args: any[]) => {
      const contractWithSigner = connectContractToSigner(contract, options, library);
      const sendPromise = contractWithSigner[functionName](...args).then(
        (result: any): Promise<any> => {
          // Need to add chainId here to prevent "TypeError: Unsupported Chain" error message
          result.chainId = chainId;
          return result;
        },
      );

      const receipt: any = await promiseTransaction(sendPromise);

      if (receipt) {
        if (receipt.logs && receipt.logs.length > 0) {
          setEvents(receipt.logs.map((log: any) => contract.interface.parseLog(log)));
        } else {
          setEvents([]);
        }
      }
    },
    [contract, functionName, chainId, promiseTransaction, library, options],
  );

  return { send, state, events };
};
