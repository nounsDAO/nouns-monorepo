import { useReverseENSLookUp } from '../../utils/ensLookup';

interface EnsOrLongAddressProps {
  address: string;
}

/**
 * Resolves ENS for address if one exists, otherwise falls back to full address
 */
const EnsOrLongAddress: React.FC<EnsOrLongAddressProps> = props => {
  const { address } = props;
  const ens = useReverseENSLookUp(address);
  return <>{ens ? ens : address}</>;
};

export default EnsOrLongAddress;
