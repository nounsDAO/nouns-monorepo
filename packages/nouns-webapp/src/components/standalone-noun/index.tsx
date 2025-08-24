import React, { useEffect } from 'react';

import { getNounData, ImageData as data } from '@noundry/nouns-assets';
import { buildSVG } from '@nouns/sdk';
import Image from 'react-bootstrap/Image';
import { useDispatch } from 'react-redux';

import LegacyNoun from '@/components/legacy-noun';
import { setOnDisplayAuctionNounId } from '@/state/slices/on-display-auction';
import { INounSeed, useNounSeed } from '@/wrappers/noun-token';
import { Link } from 'react-router';

import nounClasses from '@/components/legacy-noun/noun.module.css';

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

/**
 * @deprecated Use [Noun](../Noun.tsx) instead
 */
export const StandaloneNounImage: React.FC<StandaloneNounProps> = (props: StandaloneNounProps) => {
  const { nounId } = props;
  const seed = useNounSeed(nounId);
  const noun = seed && getNoun(nounId, seed);

  return <Image src={noun ? noun.image : ''} fluid />;
};

/**
 * @deprecated Use [Noun](../Noun.tsx) instead
 */
const StandaloneNoun: React.FC<StandaloneNounProps> = (props: StandaloneNounProps) => {
  const { nounId } = props;
  const seed = useNounSeed(nounId);
  const noun = seed && getNoun(nounId, seed);

  const dispatch = useDispatch();

  const onClickHandler = () => {
    dispatch(setOnDisplayAuctionNounId(Number(nounId)));
  };

  return (
    <Link to={'/noun/' + nounId.toString()} className="cursor-pointer" onClick={onClickHandler}>
      <LegacyNoun imgPath={noun ? noun.image : ''} alt={noun ? noun.description : 'Noun'} />
    </Link>
  );
};

/**
 * @deprecated Use [Noun](../Noun.tsx) instead
 */
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

  if (!seed || nounId == undefined)
    return <LegacyNoun imgPath="" alt="Noun" wrapperClassName={nounClasses.circularNounWrapper} />;

  return (
    <Link to={'/noun/' + nounId.toString()} className="cursor-pointer" onClick={onClickHandler}>
      <LegacyNoun
        imgPath={noun ? noun.image : ''}
        alt={noun ? noun.description : 'Noun'}
        wrapperClassName={nounClasses.circularNounWrapper}
        className={border === true ? nounClasses.circleWithBorder : nounClasses.circular}
      />
    </Link>
  );
};

/**
 * @deprecated Use [Noun](../Noun.tsx) instead
 */
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
    <Link to={'/noun/' + nounId.toString()} className="cursor-pointer" onClick={onClickHandler}>
      <LegacyNoun
        imgPath={noun ? noun.image : ''}
        alt={noun ? noun.description : 'Noun'}
        className={nounClasses.rounded}
      />
    </Link>
  );
};

/**
 * @deprecated Use [Noun](../Noun.tsx) instead
 */
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

  if (!seed || seedIsInvalid || nounId == undefined || !onLoadSeed)
    return <LegacyNoun imgPath="" alt="Noun" />;

  const onClickHandler = () => {
    dispatch(setOnDisplayAuctionNounId(Number(nounId)));
  };

  const { image, description } = getNoun(nounId, seed);

  const noun = <LegacyNoun imgPath={image} alt={description} />;
  const nounWithLink = (
    <Link to={'/noun/' + nounId.toString()} className="cursor-pointer" onClick={onClickHandler}>
      {noun}
    </Link>
  );
  return shouldLinkToProfile ? nounWithLink : noun;
};

export default StandaloneNoun;
