import {
  VrbsTokenFactory,
  AuctionHouseFactory,
  DescriptorFactory,
  SeederFactory,
  DaoLogicV2Factory,
} from '@vrbs/contracts';
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
    vrbsTokenContract: VrbsTokenFactory.connect(
      addresses.vrbsToken,
      signerOrProvider as Signer | Provider,
    ),
    vrbsAuctionHouseContract: AuctionHouseFactory.connect(
      addresses.vrbsAuctionHouseProxy,
      signerOrProvider as Signer | Provider,
    ),
    vrbsDescriptorContract: DescriptorFactory.connect(
      addresses.vrbsDescriptor,
      signerOrProvider as Signer | Provider,
    ),
    vrbsSeederContract: SeederFactory.connect(
      addresses.vrbsSeeder,
      signerOrProvider as Signer | Provider,
    ),
    vrbsDaoContract: DaoLogicV2Factory.connect(
      addresses.vrbsDAOProxy,
      signerOrProvider as Signer | Provider,
    ),
  };
};
