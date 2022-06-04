import { getNoun } from '../StandaloneNoun';
import { BigNumber } from 'ethers';
import { useNounSeeds } from '../../wrappers/nounToken';

interface StackedCircleNounsProps {
  nounIds: Array<number>;
}

// TODO
const MAX_NOUNS_PER_STACK = 3;

const TightStackedCircleNouns: React.FC<StackedCircleNounsProps> = props => {
  const { nounIds } = props;

  // TODO not sure if this will be an issue for new nouns or something?
  const seeds = useNounSeeds();

  const svgs = nounIds.slice(0, MAX_NOUNS_PER_STACK).map((nounId: number) => {
    const nounData = getNoun(BigNumber.from(nounId), seeds[nounId]);
    return nounData.image;
  });

  const shift = 3;

  const square = 55;

  return (
    <svg width={square} height={square}>
      {svgs
        .map((dataURI: string, i: number) => {
          return (
            <g>
              <clipPath id={`clipCircleNoun${nounIds[i]}`}>
                <circle
                  id={`${nounIds[i]}`}
                  r="20"
                  cx={28 + i * shift}
                  cy={(square - 21) - i * shift}
                  style={{
                    fill: 'none',
                    stroke: 'white',
                    strokeWidth: '2',
                  }}
                />
              </clipPath>

              <use xlinkHref={`#${nounIds[i]}`} />
              <image
                clip-path={`url(#clipCircleNoun${nounIds[i]})`}
                x={8 + i * shift}
                y={14 - i * shift}
                width="40"
                height="40"
                href={dataURI}
              ></image>
            </g>
          );
        })
        .reverse()}
    </svg>
  );
};

export default TightStackedCircleNouns;