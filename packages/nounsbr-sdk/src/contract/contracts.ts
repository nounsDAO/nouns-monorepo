import {
  NounsBRTokenFactory,
  NounsBRAuctionHouseFactory,
  NounsBRDescriptorFactory,
  NounsBRSeederFactory,
  NounsBRDaoLogicV1Factory,
} from '@nounsbr/contracts';
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
    nounsbrTokenContract: NounsBRTokenFactory.connect(
      addresses.nounsbrToken,
      signerOrProvider as Signer | Provider,
    ),
    nounsbrAuctionHouseContract: NounsBRAuctionHouseFactory.connect(
      addresses.nounsbrAuctionHouseProxy,
      signerOrProvider as Signer | Provider,
    ),
    nounsbrDescriptorContract: NounsBRDescriptorFactory.connect(
      addresses.nounsbrDescriptor,
      signerOrProvider as Signer | Provider,
    ),
    nounsbrSeederContract: NounsBRSeederFactory.connect(
      addresses.nounsbrSeeder,
      signerOrProvider as Signer | Provider,
    ),
    nounsbrDaoContract: NounsBRDaoLogicV1Factory.connect(
      addresses.nounsbrDAOProxy,
      signerOrProvider as Signer | Provider,
    ),
  };
};
