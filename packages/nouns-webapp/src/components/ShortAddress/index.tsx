const ShortAddress = (props: { children: string | undefined }) => {
  const { children } = props;
  return <div>{children && [children.substr(0, 6), children.substr(37, 7)].join('...')}</div>;
};

export default ShortAddress;
