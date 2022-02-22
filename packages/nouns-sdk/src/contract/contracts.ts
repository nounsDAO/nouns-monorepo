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
    nounsTokenContract: NounsTokenFactory.connect(
      addresses.nounsToken,
      signerOrProvider as Signer | Provider,
    ),
    nounsAuctionHouseContract: NounsAuctionHouseFactory.connect(
      addresses.nounsAuctionHouseProxy,
      signerOrProvider as Signer | Provider,
    ),
    nounsDescriptorContract: NounsDescriptorFactory.connect(
      addresses.nounsDescriptor,
      signerOrProvider as Signer | Provider,
    ),
    nounsSeederContract: NounsSeederFactory.connect(
      addresses.nounsSeeder,
      signerOrProvider as Signer | Provider,
    ),
    nounsDaoContract: NounsDaoLogicV1Factory.connect(
      addresses.nounsDAOProxy,
      signerOrProvider as Signer | Provider,
    ),
  };
};
