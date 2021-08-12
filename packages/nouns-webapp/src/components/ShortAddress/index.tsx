const ShortAddress: React.FC<{ address: string }> = props => {
  const { address } = props;
  return <>{address && [address.substr(0, 6), address.substr(37, 7)].join('...')}</>;
};

export default ShortAddress;
