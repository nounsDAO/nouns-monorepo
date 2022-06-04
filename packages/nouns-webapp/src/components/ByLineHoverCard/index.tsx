interface ByLineHoverCardProps {
  proposerAddress: string;
}

const ByLineHoverCard: React.FC<ByLineHoverCardProps> = props => {
  const { proposerAddress } = props;

  return <div>Proposer: {proposerAddress}</div>;
};

export default ByLineHoverCard;
