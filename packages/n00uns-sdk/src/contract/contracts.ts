import {
  N00unsTokenFactory,
  N00unsAuctionHouseFactory,
  N00unsDescriptorFactory,
  N00unsSeederFactory,
  N00unsDaoLogicV2Factory,
} from '@n00uns/contracts';
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
    n00unsTokenContract: N00unsTokenFactory.connect(
      addresses.n00unsToken,
      signerOrProvider as Signer | Provider,
    ),
    n00unsAuctionHouseContract: N00unsAuctionHouseFactory.connect(
      addresses.n00unsAuctionHouseProxy,
      signerOrProvider as Signer | Provider,
    ),
    n00unsDescriptorContract: N00unsDescriptorFactory.connect(
      addresses.n00unsDescriptor,
      signerOrProvider as Signer | Provider,
    ),
    n00unsSeederContract: N00unsSeederFactory.connect(
      addresses.n00unsSeeder,
      signerOrProvider as Signer | Provider,
    ),
    n00unsDaoContract: N00unsDaoLogicV2Factory.connect(
      addresses.n00unsDAOProxy,
      signerOrProvider as Signer | Provider,
    ),
  };
};
