import { useN00unSeed } from '../../wrappers/n00unToken';
import { BigNumber } from 'ethers';
import { getN00un } from '../StandaloneN00un';
import { LoadingN00un } from '../N00un';

interface TightStackedCircleN00unProps {
  n00unId: number;
  index: number;
  square: number;
  shift: number;
}

const TightStackedCircleN00un: React.FC<TightStackedCircleN00unProps> = props => {
  const { n00unId, index, square, shift } = props;
  const seed = useN00unSeed(BigNumber.from(n00unId));

  if (!seed) {
    return <LoadingN00un />;
  }

  const n00unData = getN00un(BigNumber.from(n00unId), seed);
  const image = n00unData.image;

  return (
    <g key={index}>
      <clipPath id={`clipCircleN00un${n00unId}`}>
        <circle
          id={`${n00unId}`}
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

      <use xlinkHref={`#${n00unId}`} />
      <image
        clipPath={`url(#clipCircleN00un${n00unId})`}
        x={8 + index * shift}
        y={14 - index * shift}
        width="40"
        height="40"
        href={image}
      ></image>
    </g>
  );
};

export default TightStackedCircleN00un;
