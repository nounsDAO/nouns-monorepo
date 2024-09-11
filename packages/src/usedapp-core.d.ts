import '@usedapp/core';

declare module '@usedapp/core' {
  function useContractCall<T extends any = any[]>(call: ContractCall | Falsy): T | undefined;

  function useContractCalls<T extends any = any>(
    calls: (ContractCall | Falsy)[],
  ): (T | undefined)[];
}
