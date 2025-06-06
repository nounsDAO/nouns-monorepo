import React, { useEffect } from 'react';

import { getNounData, ImageData as data } from '@noundry/nouns-assets';
import { buildSVG } from '@nouns/sdk';
import Image from 'react-bootstrap/Image';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router';

import LegacyNoun from '@/components/LegacyNoun';
import { setOnDisplayAuctionNounId } from '@/state/slices/onDisplayAuction';
import { INounSeed, useNounSeed } from '@/wrappers/nounToken';

import classes from './StandaloneNoun.module.css';

import nounClasses from '@/components/LegacyNoun/Noun.module.css';

interface StandaloneNounProps {
  nounId: bigint;
}
interface StandaloneCircularNounProps {
  nounId: bigint;
  border?: boolean;
}

interface StandaloneNounWithSeedProps {
  nounId: bigint;
  onLoadSeed?: (seed: INounSeed) => void;
  shouldLinkToProfile: boolean;
}

export const getNoun = (nounId: string | bigint, seed: INounSeed) => {
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

export const StandaloneNounImage: React.FC<StandaloneNounProps> = (props: StandaloneNounProps) => {
  const { nounId } = props;
  const seed = useNounSeed(nounId);
  const noun = seed && getNoun(nounId, seed);

  return <Image src={noun ? noun.image : ''} fluid />;
};

const StandaloneNoun: React.FC<StandaloneNounProps> = (props: StandaloneNounProps) => {
  const { nounId } = props;
  const seed = useNounSeed(nounId);
  const noun = seed && getNoun(nounId, seed);

  const dispatch = useDispatch();

  const onClickHandler = () => {
    dispatch(setOnDisplayAuctionNounId(Number(nounId)));
  };

  return (
    <Link
      to={'/noun/' + nounId.toString()}
      className={classes.clickableNoun}
      onClick={onClickHandler}
    >
      <LegacyNoun imgPath={noun ? noun.image : ''} alt={noun ? noun.description : 'Noun'} />
    </Link>
  );
};

export const StandaloneNounCircular: React.FC<StandaloneCircularNounProps> = (
  props: StandaloneCircularNounProps,
) => {
  const { nounId, border } = props;
  const seed = useNounSeed(nounId);
  const noun = seed && getNoun(nounId, seed);

  const dispatch = useDispatch();
  const onClickHandler = () => {
    dispatch(setOnDisplayAuctionNounId(Number(nounId)));
  };

  if (!seed || !nounId)
    return <LegacyNoun imgPath="" alt="Noun" wrapperClassName={nounClasses.circularNounWrapper} />;

  return (
    <Link
      to={'/noun/' + nounId.toString()}
      className={classes.clickableNoun}
      onClick={onClickHandler}
    >
      <LegacyNoun
        imgPath={noun ? noun.image : ''}
        alt={noun ? noun.description : 'Noun'}
        wrapperClassName={nounClasses.circularNounWrapper}
        className={border ? nounClasses.circleWithBorder : nounClasses.circular}
      />
    </Link>
  );
};

export const StandaloneNounRoundedCorners: React.FC<StandaloneNounProps> = (
  props: StandaloneNounProps,
) => {
  const { nounId } = props;
  const seed = useNounSeed(nounId);
  const noun = seed && getNoun(nounId, seed);

  const dispatch = useDispatch();
  const onClickHandler = () => {
    dispatch(setOnDisplayAuctionNounId(Number(nounId)));
  };

  return (
    <Link
      to={'/noun/' + nounId.toString()}
      className={classes.clickableNoun}
      onClick={onClickHandler}
    >
      <LegacyNoun
        imgPath={noun ? noun.image : ''}
        alt={noun ? noun.description : 'Noun'}
        className={nounClasses.rounded}
      />
    </Link>
  );
};

export const StandaloneNounWithSeed: React.FC<StandaloneNounWithSeedProps> = ({
  nounId,
  onLoadSeed,
  shouldLinkToProfile,
}: StandaloneNounWithSeedProps) => {
  const dispatch = useDispatch();
  const seed = useNounSeed(nounId);
  const seedIsInvalid = Object.values(seed || {}).every(v => v === 0);

  useEffect(() => {
    if (seed && !seedIsInvalid && onLoadSeed) {
      onLoadSeed(seed);
    }
  }, [seed, seedIsInvalid, onLoadSeed]);

  if (!seed || seedIsInvalid || !nounId || !onLoadSeed) return <LegacyNoun imgPath="" alt="Noun" />;

  const onClickHandler = () => {
    dispatch(setOnDisplayAuctionNounId(Number(nounId)));
  };

  const { image, description } = getNoun(nounId, seed);

  const noun = <LegacyNoun imgPath={image} alt={description} />;
  const nounWithLink = (
    <Link
      to={'/noun/' + nounId.toString()}
      className={classes.clickableNoun}
      onClick={onClickHandler}
    >
      {noun}
    </Link>
  );
  return shouldLinkToProfile ? nounWithLink : noun;
};

export default StandaloneNoun;
