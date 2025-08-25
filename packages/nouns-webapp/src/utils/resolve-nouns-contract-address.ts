import { nounsGovernorAddress, nounsAuctionHouseAddress, nounsTreasuryAddress } from '@/contracts';
import { defaultChain } from '@/wagmi';

export const resolveNounContractAddress = (address: string) => {
  const chainId = defaultChain.id;
  switch (address.toLowerCase()) {
    case nounsGovernorAddress[chainId].toLowerCase():
      return 'Nouns DAO Proxy';
    case nounsAuctionHouseAddress[chainId].toLowerCase():
      return 'Nouns Auction House Proxy';
    case nounsTreasuryAddress[chainId].toLowerCase():
      return 'Nouns DAO Treasury';
    default:
      return undefined;
  }
};
