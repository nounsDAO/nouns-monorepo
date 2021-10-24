import { ChainId, ContractAddresses } from './types';
import localContracts from '../localContracts.json';
const chainIdToAddresses: { [chainId: number]: ContractAddresses } = {
  [ChainId.Mainnet]: {
    nounsToken: '0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03',
    nounsSeeder: '0xCC8a0FB5ab3C7132c1b2A0109142Fb112c4Ce515',
    nounsDescriptor: '0x0Cfdb3Ba1694c2bb2CFACB0339ad7b1Ae5932B63',
    nftDescriptor: '0x0BBAd8c947210ab6284699605ce2a61780958264',
    nounsAuctionHouse: '0xF15a943787014461d94da08aD4040f79Cd7c124e',
    nounsAuctionHouseProxy: '0x830BD73E4184ceF73443C15111a1DF14e495C706',
    nounsAuctionHouseProxyAdmin: '0xC1C119932d78aB9080862C5fcb964029f086401e',
    nounsDaoExecutor: '0x0BC3807Ec262cB779b38D65b38158acC3bfedE10',
    nounsDAOProxy: '0x6f3E6272A167e8AcCb32072d08E0957F9c79223d',
    nounsDAOLogicV1: '0xa43aFE317985726E4e194eb061Af77fbCb43F944',
  },
  [ChainId.Rinkeby]: {
    nounsToken: '0x632f34c3aee991b10D4b421Bc05413a03d7a37eB',
    nounsSeeder: '0xA98A1b1Cc4f5746A753167BAf8e0C26AcBe42F2E',
    nounsDescriptor: '0x53cB482c73655D2287AE3282AD1395F82e6a402F',
    nftDescriptor: '0x1F28f148ef5f9BD182cCEfeAD4240A505C54dc9B',
    nounsAuctionHouse: '0xfAB74e535409A3ad1F7C2858dd2E5Da1eAAc6cE7',
    nounsAuctionHouseProxy: '0x7cb0384b923280269b3BD85f0a7fEaB776588382',
    nounsAuctionHouseProxyAdmin: '0x04d0e5a8ADB5076C098f49F39B01A774c313597d',
    nounsDaoExecutor: '0x6F3940820288855418B7ef8E33a2eC23d9DeD59B',
    nounsDAOProxy: '0xd1C753D9A23eb5c57e0d023e993B9bd4F5086b04',
    nounsDAOLogicV1: '0xdF05F2D3276F3F3fA00296702e4cf7190B78F6F9',
  },
  [ChainId.Local]: localContracts,
};

/**
 * Get addresses of contracts that have been deployed to the
 * Ethereum mainnet or a supported testnet. Throws if there are
 * no known contracts deployed on the corresponding chain.
 * @param chainId The desired chainId
 */
export const getContractAddressesForChainOrThrow = (chainId: number): ContractAddresses => {
  if (!chainIdToAddresses[chainId]) {
    throw new Error(
      `Unknown chain id (${chainId}). No known contracts have been deployed on this chain.`,
    );
  }
  return chainIdToAddresses[chainId];
};
