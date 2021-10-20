export const shortenAddress = (address: string) => {
    return [address.substr(0, 4), address.substr(38, 4)].join('...');
}