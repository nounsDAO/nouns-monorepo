import { ImageData as data, getNounData } from '@nouns/assets';
import { buildSVG } from '@nouns/sdk';
import { BigNumber as EthersBN } from 'ethers';
import { ISeed, useNSeed } from '../../wrappers/nToken';
import Noun from '../Noun';
import { Link } from 'react-router-dom';
import classes from './StandaloneNoun.module.css';
import { useDispatch } from 'react-redux';
import { setOnDisplayAuctionTokenId } from '../../state/slices/onDisplayAuction';
import nounClasses from '../Noun/Noun.module.css';

interface StandaloneTokenProps {
  tokenId: EthersBN;
}
interface StandaloneCircularTokenProps {
  tokenId: EthersBN;
  border?: boolean;
}

interface StandaloneTokenWithSeedProps {
  tokenId: EthersBN;
  onLoadSeed?: (seed: ISeed) => void;
  shouldLinkToProfile: boolean;
}

export const getPunk = (tokenId: string | EthersBN, seed: ISeed) => {
  const id = tokenId.toString();
  const name = `Punk ${id}`;
  const description = `Punk ${id} is a member of the Punkers DAO`;
  const { parts, background } = getNounData(seed);
  const image = `data:image/svg+xml;base64,${btoa(buildSVG(parts, data.palette, background))}`;

  return {
    name,
    description,
    image,
  };
};

const StandaloneNoun: React.FC<StandaloneTokenProps> = (props: StandaloneTokenProps) => {
  const { tokenId } = props;
  const seed = useNSeed(tokenId);
  const noun = seed && getPunk(tokenId, seed);

  const dispatch = useDispatch();

  const onClickHandler = () => {
    dispatch(setOnDisplayAuctionTokenId(tokenId.toNumber()));
  };

  return (
    <Link
      to={'/token/' + tokenId.toString()}
      className={classes.clickablePunk}
      onClick={onClickHandler}
    >
      <Noun imgPath={noun ? noun.image : ''} alt={noun ? noun.description : 'Token'} />
    </Link>
  );
};

export const StandaloneTokenCircular: React.FC<StandaloneCircularTokenProps> = (
  props: StandaloneCircularTokenProps,
) => {
  const { tokenId, border } = props;
  const seed = useNSeed(tokenId);
  const noun = seed && getPunk(tokenId, seed);

  const dispatch = useDispatch();
  const onClickHandler = () => {
    dispatch(setOnDisplayAuctionTokenId(tokenId.toNumber()));
  };

  if (!seed || !tokenId) return <Noun imgPath="" alt="Punk" />;

  return (
    <Link
      to={'/token/' + tokenId.toString()}
      className={classes.clickablePunk}
      onClick={onClickHandler}
    >
      <Noun
        imgPath={noun ? noun.image : ''}
        alt={noun ? noun.description : 'Noun'}
        wrapperClassName={nounClasses.circularNounWrapper}
        className={border ? nounClasses.circleWithBorder : nounClasses.circular}
      />
    </Link>
  );
};

export const StandaloneNounRoundedCorners: React.FC<StandaloneTokenProps> = (
  props: StandaloneTokenProps,
) => {
  const { tokenId } = props;
  const seed = useNSeed(tokenId);
  const noun = seed && getPunk(tokenId, seed);

  const dispatch = useDispatch();
  const onClickHandler = () => {
    dispatch(setOnDisplayAuctionTokenId(tokenId.toNumber()));
  };

  return (
    <Link
      to={'/noun/' + tokenId.toString()}
      className={classes.clickableNoun}
      onClick={onClickHandler}
    >
      <Noun
        imgPath={noun ? noun.image : ''}
        alt={noun ? noun.description : 'Noun'}
        className={nounClasses.rounded}
      />
    </Link>
  );
};

export const StandaloneNounWithSeed: React.FC<StandaloneTokenWithSeedProps> = (
  props: StandaloneTokenWithSeedProps,
) => {
  const { tokenId, onLoadSeed, shouldLinkToProfile } = props;

  const dispatch = useDispatch();
  const seed = useNSeed(tokenId);
  const seedIsInvalid = Object.values(seed || {}).every(v => v === 0);

  if (!seed || seedIsInvalid || !tokenId || !onLoadSeed) return <Noun imgPath="" alt="Punk" />;

  onLoadSeed(seed);

  const onClickHandler = () => {
    dispatch(setOnDisplayAuctionTokenId(tokenId.toNumber()));
  };

  const { image, description } = getPunk(tokenId, seed);

  const noun = <Noun imgPath={image} alt={description} />;
  const nounWithLink = (
    <Link
      to={'/noun/' + tokenId.toString()}
      className={classes.clickablePunk}
      onClick={onClickHandler}
    >
      {noun}
    </Link>
  );
  return shouldLinkToProfile ? nounWithLink : noun;
};

export default StandaloneNoun;
