import { ImageData as data, getNounData } from '@digitalax/nouns-assets';
import { buildSVG } from '@digitalax/nouns-sdk';
import { BigNumber as EthersBN } from 'ethers';
import { INounSeed, useNounSeed } from '../../wrappers/nounToken';
import Noun from '../Noun';
import { Link } from 'react-router-dom';
import classes from './StandaloneNoun.module.css';
import { useDispatch } from 'react-redux';
import { setOnDisplayAuctionNounId } from '../../state/slices/onDisplayAuction';
import nounClasses from '../Noun/Noun.module.css';
import { Auction } from '../../wrappers/nounsAuction';

interface StandaloneNounProps {
  nounId: EthersBN;
}
interface StandaloneCircularNounProps {
  nounId: EthersBN;
}

interface StandaloneNounWithSeedProps {
  nounId: EthersBN;
  onLoadSeed?: (seed: INounSeed) => void;
  shouldLinkToProfile: boolean;
  isEthereum?: boolean;
  auction?: Auction;
}

const getNoun = (nounId: string | EthersBN, seed: INounSeed) => {
  const id = nounId.toString();
  const name = `Noun ${id}`;
  const description = `Noun ${id} is a member of the Nouns DAO`;
  const { parts, background } = getNounData(seed);
  const image = `data:image/svg+xml;base64,${btoa(buildSVG(parts, data.palette, background))}`;

  return {
    name,
    description,
    image,
  };
};

const StandaloneNoun: React.FC<StandaloneNounProps> = (props: StandaloneNounProps) => {
  const { nounId } = props;
  const seed = useNounSeed(nounId);
  const noun = seed && getNoun(nounId, seed);

  const dispatch = useDispatch();

  const onClickHandler = () => {
    dispatch(setOnDisplayAuctionNounId(nounId.toNumber()));
  };

  return (
    <Link
      to={'/noun/' + nounId.toString()}
      className={classes.clickableNoun}
      onClick={onClickHandler}
    >
      <Noun imgPath={noun ? noun.image : ''} alt={noun ? noun.description : 'Noun'} />
    </Link>
  );
};

export const StandaloneNounCircular: React.FC<StandaloneCircularNounProps> = (
  props: StandaloneCircularNounProps,
) => {
  const { nounId } = props;
  const seed = useNounSeed(nounId);
  const noun = seed && getNoun(nounId, seed);

  const dispatch = useDispatch();
  const onClickHandler = () => {
    dispatch(setOnDisplayAuctionNounId(nounId.toNumber()));
  };

  return (
    <Link
      to={'/noun/' + nounId.toString()}
      className={classes.clickableNoun}
      onClick={onClickHandler}
    >
      <Noun
        imgPath={noun ? noun.image : ''}
        alt={noun ? noun.description : 'Noun'}
        wrapperClassName={nounClasses.circularNounWrapper}
        className={nounClasses.circular}
      />
    </Link>
  );
};

export const StandaloneNounWithSeed: React.FC<StandaloneNounWithSeedProps> = (
  props: StandaloneNounWithSeedProps,
) => {
  const { auction, nounId, onLoadSeed, shouldLinkToProfile, isEthereum = false } = props;

  const dispatch = useDispatch();
  // const seed = useNounSeed(nounId);

  // if (!seed || !nounId || !onLoadSeed) return <Noun imgPath="" alt="Noun" />;

  // onLoadSeed(seed);

  // const onClickHandler = () => {
  //   dispatch(setOnDisplayAuctionNounId(nounId.toNumber()));
  // };

  // const { image, description } = getNoun(nounId, seed);
  const noun = (
    <Noun
      isEthereum={isEthereum}
      imgPath={auction?.image ?? auction?.animation ?? ''}
      alt={auction?.name}
      type={auction?.image ? 'image' : 'animation'}
    />
  );
  // const nounWithLink = (
  //   <Link
  //     to={'/noun/' + nounId.toString()}
  //     className={classes.clickableNoun}
  //     onClick={onClickHandler}
  //   >
  //     {noun}
  //   </Link>
  // );
  // return shouldLinkToProfile ? nounWithLink : noun;
  return noun;
};

export default StandaloneNoun;
