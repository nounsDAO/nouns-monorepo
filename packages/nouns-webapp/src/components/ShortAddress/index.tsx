import { useReverseENSLookUp } from '../../utils/ensLookup';

const ShortAddress: React.FC<{ address: string }> = props => {
  const { address } = props;

  const ens = useReverseENSLookUp(address);
  const shortAddress = address && [address.substr(0, 4), address.substr(38, 4)].join('...');

  return <>{ens ? ens : shortAddress}</>;
};

export default ShortAddress;
