import {
  NounsTokenFactory,
  NounsAuctionHouseFactory,
  NounsDescriptorFactory,
  NounsSeederFactory,
  NounsDaoLogicV1Factory,
} from '@nouns/contracts';
import type { Signer } from 'ethers';
import type { Provider } from '@ethersproject/providers';
import { getContractAddressesForChainOrThrow } from './addresses';
import { ChainId, Contracts } from './types';

/**
 * Get contract instances that target the Ethereum mainnet
 * or a supported testnet. Throws if there are no known contracts
 * deployed on the corresponding chain.
 * @param chainId The desired chain id
 * @param signerOrProvider The ethers v5 signer or provider
 */
export const getContractsForChainOrThrow = (
  chainId: ChainId,
  signerOrProvider: Signer | Provider,
): Contracts => {
  const addresses = getContractAddressesForChainOrThrow(chainId);

  return {
    nounsTokenContract: NounsTokenFactory.connect(addresses.nounsToken, signerOrProvider),
    nounsAuctionHouseContract: NounsAuctionHouseFactory.connect(
      addresses.nounsAuctionHouseProxy,
      signerOrProvider,
    ),
    nounsDescriptorContract: NounsDescriptorFactory.connect(
      addresses.nounsDescriptor,
      signerOrProvider,
    ),
    nounsSeederContract: NounsSeederFactory.connect(addresses.nounsSeeder, signerOrProvider),
    nounsDaoContract: NounsDaoLogicV1Factory.connect(addresses.nounsDAOProxy, signerOrProvider),
  };
};
