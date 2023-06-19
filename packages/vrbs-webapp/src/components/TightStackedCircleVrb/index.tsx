import { useVrbSeed } from '../../wrappers/vrbsToken';
import { BigNumber } from 'ethers';
import { getVrb } from '../StandaloneVrb';
import { LoadingVrb } from '../Vrb';

interface TightStackedCircleVrbProps {
  vrbId: number;
  index: number;
  square: number;
  shift: number;
}

const TightStackedCircleVrb: React.FC<TightStackedCircleVrbProps> = props => {
  const { vrbId, index, square, shift } = props;
  const seed = useVrbSeed(BigNumber.from(vrbId));

  if (!seed) {
    return <LoadingVrb />;
  }

  const vrbData = getVrb(BigNumber.from(vrbId), seed);
  const image = vrbData.image;

  return (
    <g key={index}>
      <clipPath id={`clipCircleVrb${vrbId}`}>
        <circle
          id={`${vrbId}`}
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

      <use xlinkHref={`#${vrbId}`} />
      <image
        clipPath={`url(#clipCircleVrb${vrbId})`}
        x={8 + index * shift}
        y={14 - index * shift}
        width="40"
        height="40"
        href={image}
      ></image>
    </g>
  );
};

export default TightStackedCircleVrb;
