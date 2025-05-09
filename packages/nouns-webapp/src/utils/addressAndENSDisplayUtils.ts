export const veryShortENS = (ens: string) => {
  return [ens.substr(0, 1), ens.substr(ens.length - 3, 3)].join('...');
};

export const veryShortAddress = (address: string) => {
  return [address.substr(0, 3), address.substr(address.length - 1, 1)].join('...');
};

export const shortENS = (ens: string) => {
  if (ens.length < 15 || window.innerWidth > 480) {
    return ens;
  }
  return [ens.substr(0, 4), ens.substr(ens.length - 8, 8)].join('...');
};

export const useShortAddress = (address: string) => {
  return address && [address.substr(0, 4), address.substr(38, 4)].join('...');
};
