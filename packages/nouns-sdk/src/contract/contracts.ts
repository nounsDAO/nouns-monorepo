import {
  NTokenFactory,
  NAuctionHouseFactory,
  NDescriptorFactory,
  NSeederFactory,
  NDaoLogicV1Factory,
} from '@nouns/contracts';
import type { Signer } from 'ethers';
import type { Provider } from '@ethersproject/providers';
import { getContractAddressesForChainOrThrow } from './addresses';
import { Contracts } from './types';

/**
 * Get contract instances that target the Ethereum mainnet
 * or a supported testnet. Throws if there are no known contracts
 * deployed on the corresponding chain.
 * @param chainId The desired chain id
 * @param signerOrProvider The ethers v5 signer or provider
 */
export const getContractsForChainOrThrow = (
  chainId: number,
  signerOrProvider?: Signer | Provider,
): Contracts => {
  const addresses = getContractAddressesForChainOrThrow(chainId);

  return {
    nTokenContract: NTokenFactory.connect(
      addresses.nToken,
      signerOrProvider as Signer | Provider,
    ),
    nAuctionHouseContract: NAuctionHouseFactory.connect(
      addresses.nAuctionHouseProxy,
      signerOrProvider as Signer | Provider,
    ),
    nDescriptorContract: NDescriptorFactory.connect(
      addresses.nDescriptor,
      signerOrProvider as Signer | Provider,
    ),
    nSeederContract: NSeederFactory.connect(
      addresses.nSeeder,
      signerOrProvider as Signer | Provider,
    ),
    nDaoContract: NDaoLogicV1Factory.connect(
      addresses.nDAOProxy,
      signerOrProvider as Signer | Provider,
    ),
  };
};
