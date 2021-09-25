import { useReverseENSLookUp } from '../../utils/ensLookup';

const ShortAddress: React.FC<{ address: string }> = props => {
  const { address } = props;

  const ens = useReverseENSLookUp(address);
  const shortAddress = address && [address.substr(0, 4), address.substr(38, 4)].join('...');

  switch (address) {
    case "0xd33f519291a5Ba56da1351243789C91a9C2a319e":
      return <>party.nouns</>;
  }

  return <>{ens ? ens : shortAddress}</>;
};

export default ShortAddress;
