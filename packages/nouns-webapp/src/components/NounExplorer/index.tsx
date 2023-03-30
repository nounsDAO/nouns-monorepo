import { Auction } from '../../wrappers/nounsAuction';
import Carousel from '../Carousel';
import { BigNumber } from 'ethers';
import classes from './NounExplorer.module.css';
import CarouselItem from '../CarouselItem';
import { StandaloneNounImage } from '../StandaloneNoun';

interface NounExplorerProps {
  auction?: Auction;
}

const NounExplorer: React.FC<NounExplorerProps> = props => {
  // TODO: Load next 50 nouns when user reaches the end of the carousel
  const nouns = Array.from({ length: 50 })
    .map((_, i) => ({
      id: BigNumber.from((props?.auction?.nounId.toNumber() || 1e10) - i),
    }))
    .reverse();

  return (
    <div className={classes.explorer}>
      <Carousel
        rootClassName={classes.carousel}
        scrollClassName={classes.scroll}
        items={nouns}
        startScrollRight={true}
        renderItem={({ item, isSnapPoint }) => (
          <CarouselItem
            key={item.id.toNumber()}
            isSnapPoint={isSnapPoint}
            itemClassName={classes.item}
            itemSnapPointClassName={classes.itemSnapPoint}
          >
            <StandaloneNounImage className={classes.noun} nounId={item.id} withBackground={false} />
          </CarouselItem>
        )}
      />
      <div className={classes.land}>
        <div />
      </div>
    </div>
  );
};

export default NounExplorer;
