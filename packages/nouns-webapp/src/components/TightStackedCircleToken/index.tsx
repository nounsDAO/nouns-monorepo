import { useNSeed } from '../../wrappers/nToken';
import { BigNumber } from 'ethers';
import { getPunk } from '../StandaloneToken';
import { LoadingPunk } from '../Punk';

interface TightStackedCircleTokenProps {
  tokenId: number;
  index: number;
  square: number;
  shift: number;
}

const TightStackedCircleToken: React.FC<TightStackedCircleTokenProps> = props => {
  const { tokenId, index, square, shift } = props;
  const seed = useNSeed(BigNumber.from(tokenId));
  if (!seed) {
    return <LoadingPunk />;
  }

  const tokenData = getPunk(BigNumber.from(tokenId), seed);
  const image = tokenData.image;

  return (
    <g key={index}>
      <clipPath id={`clipCircleToken${tokenId}`}>
        <circle
          id={`${tokenId}`}
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

      <use xlinkHref={`#${tokenId}`} />
      <image
        clipPath={`url(#clipCircleToken${tokenId})`}
        x={8 + index * shift}
        y={14 - index * shift}
        width="40"
        height="40"
        href={image}
      ></image>
    </g>
  );
};

export default TightStackedCircleToken;
