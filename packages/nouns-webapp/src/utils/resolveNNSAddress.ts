const NNS_REGISTRY = "0x3e1970dc478991b49c4327973ea8a4862ef5a4de";
const ENS_REGISTRY = "0x00000000000c2e074ec69a0dfb2997ba6c7d2e1e";

export async function lookupAddressWithENSFallback(provider: any, address: string) {
    // try looking up the address on NNS (ie get name.⌐◨-◨)
    provider.network.ensAddress = NNS_REGISTRY;
    const nnsName = await provider.lookupAddress(address);
    provider.network.ensAddress = ENS_REGISTRY;
    if (nnsName) {
      return nnsName;
    }
    // if not, look up on ENS (ie get name.eth)
    return await provider.lookupAddress(address);
  }