import { ImageData as data, getNounBRData } from '@nounsbr/assets';
import { buildSVG } from '@nounsbr/sdk';
import { BigNumber as EthersBN } from 'ethers';
import { INounBRSeed, useNounBRSeed } from '../../wrappers/nounbrToken';
import NounBR from '../NounBR';
import { Link } from 'react-router-dom';
import classes from './StandaloneNounBR.module.css';
import { useDispatch } from 'react-redux';
import { setOnDisplayAuctionNounBRId } from '../../state/slices/onDisplayAuction';
import nounbrClasses from '../NounBR/NounBR.module.css';

interface StandaloneNounBRProps {
  nounbrId: EthersBN;
}
interface StandaloneCircularNounBRProps {
  nounbrId: EthersBN;
  border?: boolean;
}

interface StandaloneNounBRWithSeedProps {
  nounbrId: EthersBN;
  onLoadSeed?: (seed: INounBRSeed) => void;
  shouldLinkToProfile: boolean;
}

export const getNounBR = (nounbrId: string | EthersBN, seed: INounBRSeed) => {
  const id = nounbrId.toString();
  const name = `NounBR ${id}`;
  const description = `NounBR ${id} is a member of the NounsBR DAO`;
  const { parts, background } = getNounBRData(seed);
  const image = `data:image/svg+xml;base64,${btoa(buildSVG(parts, data.palette, background))}`;

  return {
    name,
    description,
    image,
  };
};

const StandaloneNounBR: React.FC<StandaloneNounBRProps> = (props: StandaloneNounBRProps) => {
  const { nounbrId } = props;
  const seed = useNounBRSeed(nounbrId);
  const nounbr = seed && getNounBR(nounbrId, seed);

  const dispatch = useDispatch();

  const onClickHandler = () => {
    dispatch(setOnDisplayAuctionNounBRId(nounbrId.toNumber()));
  };

  return (
    <Link
      to={'/nounbr/' + nounbrId.toString()}
      className={classes.clickableNounBR}
      onClick={onClickHandler}
    >
      <NounBR imgPath={nounbr ? nounbr.image : ''} alt={nounbr ? nounbr.description : 'NounBR'} />
    </Link>
  );
};

export const StandaloneNounBRCircular: React.FC<StandaloneCircularNounBRProps> = (
  props: StandaloneCircularNounBRProps,
) => {
  const { nounbrId, border } = props;
  const seed = useNounBRSeed(nounbrId);
  const nounbr = seed && getNounBR(nounbrId, seed);

  const dispatch = useDispatch();
  const onClickHandler = () => {
    dispatch(setOnDisplayAuctionNounBRId(nounbrId.toNumber()));
  };

  if (!seed || !nounbrId) return <NounBR imgPath="" alt="NounBR" />;

  return (
    <Link
      to={'/nounbr/' + nounbrId.toString()}
      className={classes.clickableNounBR}
      onClick={onClickHandler}
    >
      <NounBR
        imgPath={nounbr ? nounbr.image : ''}
        alt={nounbr ? nounbr.description : 'NounBR'}
        wrapperClassName={nounbrClasses.circularNounBRWrapper}
        className={border ? nounbrClasses.circleWithBorder : nounbrClasses.circular}
      />
    </Link>
  );
};

export const StandaloneNounBRRoundedCorners: React.FC<StandaloneNounBRProps> = (
  props: StandaloneNounBRProps,
) => {
  const { nounbrId } = props;
  const seed = useNounBRSeed(nounbrId);
  const nounbr = seed && getNounBR(nounbrId, seed);

  const dispatch = useDispatch();
  const onClickHandler = () => {
    dispatch(setOnDisplayAuctionNounBRId(nounbrId.toNumber()));
  };

  return (
    <Link
      to={'/nounbr/' + nounbrId.toString()}
      className={classes.clickableNounBR}
      onClick={onClickHandler}
    >
      <NounBR
        imgPath={nounbr ? nounbr.image : ''}
        alt={nounbr ? nounbr.description : 'NounBR'}
        className={nounbrClasses.rounded}
      />
    </Link>
  );
};

export const StandaloneNounBRWithSeed: React.FC<StandaloneNounBRWithSeedProps> = (
  props: StandaloneNounBRWithSeedProps,
) => {
  const { nounbrId, onLoadSeed, shouldLinkToProfile } = props;

  const dispatch = useDispatch();
  const seed = useNounBRSeed(nounbrId);
  const seedIsInvalid = Object.values(seed || {}).every(v => v === 0);

  if (!seed || seedIsInvalid || !nounbrId || !onLoadSeed) return <NounBR imgPath="" alt="NounBR" />;

  onLoadSeed(seed);

  const onClickHandler = () => {
    dispatch(setOnDisplayAuctionNounBRId(nounbrId.toNumber()));
  };

  const { image, description } = getNounBR(nounbrId, seed);

  const nounbr = <NounBR imgPath={image} alt={description} />;
  const nounbrWithLink = (
    <Link
      to={'/nounbr/' + nounbrId.toString()}
      className={classes.clickableNounBR}
      onClick={onClickHandler}
    >
      {nounbr}
    </Link>
  );
  return shouldLinkToProfile ? nounbrWithLink : nounbr;
};

export default StandaloneNounBR;
