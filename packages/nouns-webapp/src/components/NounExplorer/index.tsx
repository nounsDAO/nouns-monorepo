import { Auction } from '../../wrappers/nounsAuction';
import Carousel from '../Carousel';
import classes from './NounExplorer.module.css';
import CarouselItem from '../CarouselItem';
import skull from '../../assets/loading-skull-noun.gif';
import { useEffect, useMemo, useState } from 'react';
import { debounce } from '../../utils/debounce';
import { Image } from 'react-bootstrap';
import Cloud from '../Cloud';
import { range } from 'ramda';

interface NounExplorerProps {
  auction?: Auction;
}

type Noun = {
  key: number;
  nounId?: number;
  src?: string;
};

const random = (min: number, max: number) => Math.random() * (max - min) + min;

const getNoun = (startingId: number, index: number, keyOffset = 0) => {
  const nounId = startingId - index;
  return {
    key: index + keyOffset,
    nounId,
    src: `https://noun.pics/${nounId}.svg?removeBackground=true`,
  };
};

const NOUNS_PER_LOAD = 100;

const NounExplorer: React.FC<NounExplorerProps> = props => {
  const [activeNounId, setActiveNounId] = useState<number>();
  const [nouns, setNouns] = useState<Noun[]>(
    Array.from({ length: NOUNS_PER_LOAD })
      .map((_, key) => ({ key }))
      .reverse(),
  );

  useEffect(() => {
    if (!props.auction?.nounId) {
      return;
    }
    const { nounId: auctionedId } = props.auction;

    setActiveNounId(auctionedId.toNumber());
    setNouns(nouns.map((_, i) => getNoun(auctionedId.toNumber(), i)).reverse());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.auction]);

  const populateNextNouns = (index: number) => {
    if (nouns?.[0].nounId !== undefined && index <= 10) {
      const nextNounId = nouns[0].nounId - 1;
      if (nextNounId < 0) {
        return;
      }

      const nextNouns = Array.from({ length: Math.min(NOUNS_PER_LOAD, nextNounId + 1) })
        .map((_, i) => getNoun(nextNounId, i, nouns.length))
        .reverse();
      setNouns([...nextNouns, ...nouns]);
    }
  };
  const debouncedPopulateNextNouns = debounce(populateNextNouns, 1_000);

  const onPageChanged = (pageIndex: number, pageCount: number) => {
    if (!props.auction?.nounId) {
      return;
    }
    // Off by 2 due to current padding approach
    setActiveNounId(props.auction.nounId.sub(pageCount - pageIndex - 3).toNumber());
    debouncedPopulateNextNouns(pageIndex);
  };

  const clouds = useMemo(() => {
    return range(0, 5).map(i => {
      return (
        <Cloud
          key={i}
          offset={random(0, 100)}
          size={random(125, 200)}
          startOffset={random(0, 65)}
        />
      );
    });
  }, []);

  return (
    <div className={classes.explorer}>
      {/* TODO: use different size clouds rather than scaling */}
      {clouds}
      {activeNounId !== undefined && (<span className={classes.activeNounId}>Noun {activeNounId}</span>)}
      <Carousel
        rootClassName={classes.carousel}
        scrollClassName={classes.scroll}
        items={nouns}
        startScrollRight={true}
        onPageChanged={onPageChanged}
        renderItem={({ item, isSnapPoint }) => (
          <CarouselItem
            key={item.key}
            isSnapPoint={isSnapPoint}
            itemClassName={classes.item}
            itemSnapPointClassName={classes.itemSnapPoint}
          >
            <Image className={classes.noun} src={item.src || skull} />
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
