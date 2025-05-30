import { Address } from '@/utils/types';

export const veryShortENS = (ens: string) => {
  return [ens.substring(0, 1), ens.substring(ens.length - 3)].join('...');
};

export const veryShortAddress = (address?: Address) => {
  if (!address) return '';
  return [address.substring(0, 3), address.substring(address.length - 1)].join('...');
};

export const shortENS = (ens: string) => {
  if (ens.length < 15 || window.innerWidth > 480) {
    return ens;
  }
  return [ens.substring(0, 4), ens.substring(ens.length - 8)].join('...');
};

export const useShortAddress = (address?: Address) => {
  if (!address) return '';
  return [address.substring(0, 4), address.substring(38)].join('...');
};
