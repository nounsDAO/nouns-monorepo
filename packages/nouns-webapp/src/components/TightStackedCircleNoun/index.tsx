import { useNounBRSeed } from '../../wrappers/nounbrToken';
import { BigNumber } from 'ethers';
import { getNounBR } from '../StandaloneNounBR';
import { LoadingNounBR } from '../NounBR';

interface TightStackedCircleNounBRProps {
  nounbrId: number;
  index: number;
  square: number;
  shift: number;
}

const TightStackedCircleNounBR: React.FC<TightStackedCircleNounBRProps> = props => {
  const { nounbrId, index, square, shift } = props;
  const seed = useNounBRSeed(BigNumber.from(nounbrId));

  if (!seed) {
    return <LoadingNounBR />;
  }

  const nounbrData = getNounBR(BigNumber.from(nounbrId), seed);
  const image = nounbrData.image;

  return (
    <g key={index}>
      <clipPath id={`clipCircleNounBR${nounbrId}`}>
        <circle
          id={`${nounbrId}`}
          r="20"
          cx={28 + index * shift}
          cy={square - 21 - index * shift}
          style={{
            fill: 'none',
            stroke: 'white',
            strokeWidth: '2',
          }}
        />
      </clipPath>

      <use xlinkHref={`#${nounbrId}`} />
      <image
        clipPath={`url(#clipCircleNounBR${nounbrId})`}
        x={8 + index * shift}
        y={14 - index * shift}
        width="40"
        height="40"
        href={image}
      ></image>
    </g>
  );
};

export default TightStackedCircleNounBR;
