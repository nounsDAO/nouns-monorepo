import { ImageData as data, getN00unData } from '@n00uns/assets';
import { buildSVG } from '@n00uns/sdk';
import { BigNumber as EthersBN } from 'ethers';
import { IN00unSeed, useN00unSeed } from '../../wrappers/n00unToken';
import N00un from '../N00un';
import { Link } from 'react-router-dom';
import classes from './StandaloneN00un.module.css';
import { useDispatch } from 'react-redux';
import { setOnDisplayAuctionN00unId } from '../../state/slices/onDisplayAuction';
import n00unClasses from '../N00un/N00un.module.css';
import Image from 'react-bootstrap/Image';

interface StandaloneN00unProps {
  n00unId: EthersBN;
}
interface StandaloneCircularN00unProps {
  n00unId: EthersBN;
  border?: boolean;
}

interface StandaloneN00unWithSeedProps {
  n00unId: EthersBN;
  onLoadSeed?: (seed: IN00unSeed) => void;
  shouldLinkToProfile: boolean;
}

export const getN00un = (n00unId: string | EthersBN, seed: IN00unSeed) => {
  const id = n00unId.toString();
  const name = `N00un ${id}`;
  const description = `N00un ${id} is a member of the N00uns DAO`;
  const { parts, background } = getN00unData(seed);
  const image = `data:image/svg+xml;base64,${btoa(buildSVG(parts, data.palette, background))}`;

  return {
    name,
    description,
    image,
  };
};

export const StandaloneN00unImage: React.FC<StandaloneN00unProps> = (
  props: StandaloneN00unProps,
) => {
  const { n00unId } = props;
  const seed = useN00unSeed(n00unId);
  const n00un = seed && getN00un(n00unId, seed);

  return <Image src={n00un ? n00un.image : ''} fluid />;
};

const StandaloneN00un: React.FC<StandaloneN00unProps> = (props: StandaloneN00unProps) => {
  const { n00unId } = props;
  const seed = useN00unSeed(n00unId);
  const n00un = seed && getN00un(n00unId, seed);

  const dispatch = useDispatch();

  const onClickHandler = () => {
    dispatch(setOnDisplayAuctionN00unId(n00unId.toNumber()));
  };

  return (
    <Link
      to={'/n00un/' + n00unId.toString()}
      className={classes.clickableN00un}
      onClick={onClickHandler}
    >
      <N00un imgPath={n00un ? n00un.image : ''} alt={n00un ? n00un.description : 'N00un'} />
    </Link>
  );
};

export const StandaloneN00unCircular: React.FC<StandaloneCircularN00unProps> = (
  props: StandaloneCircularN00unProps,
) => {
  const { n00unId, border } = props;
  const seed = useN00unSeed(n00unId);
  const n00un = seed && getN00un(n00unId, seed);

  const dispatch = useDispatch();
  const onClickHandler = () => {
    dispatch(setOnDisplayAuctionN00unId(n00unId.toNumber()));
  };

  if (!seed || !n00unId) return <N00un imgPath="" alt="N00un" />;

  return (
    <Link
      to={'/n00un/' + n00unId.toString()}
      className={classes.clickableN00un}
      onClick={onClickHandler}
    >
      <N00un
        imgPath={n00un ? n00un.image : ''}
        alt={n00un ? n00un.description : 'N00un'}
        wrapperClassName={n00unClasses.circularN00unWrapper}
        className={border ? n00unClasses.circleWithBorder : n00unClasses.circular}
      />
    </Link>
  );
};

export const StandaloneN00unRoundedCorners: React.FC<StandaloneN00unProps> = (
  props: StandaloneN00unProps,
) => {
  const { n00unId } = props;
  const seed = useN00unSeed(n00unId);
  const n00un = seed && getN00un(n00unId, seed);

  const dispatch = useDispatch();
  const onClickHandler = () => {
    dispatch(setOnDisplayAuctionN00unId(n00unId.toNumber()));
  };

  return (
    <Link
      to={'/n00un/' + n00unId.toString()}
      className={classes.clickableN00un}
      onClick={onClickHandler}
    >
      <N00un
        imgPath={n00un ? n00un.image : ''}
        alt={n00un ? n00un.description : 'N00un'}
        className={n00unClasses.rounded}
      />
    </Link>
  );
};

export const StandaloneN00unWithSeed: React.FC<StandaloneN00unWithSeedProps> = (
  props: StandaloneN00unWithSeedProps,
) => {
  const { n00unId, onLoadSeed, shouldLinkToProfile } = props;

  const dispatch = useDispatch();
  const seed = useN00unSeed(n00unId);
  const seedIsInvalid = Object.values(seed || {}).every(v => v === 0);

  if (!seed || seedIsInvalid || !n00unId || !onLoadSeed) return <N00un imgPath="" alt="N00un" />;

  onLoadSeed(seed);

  const onClickHandler = () => {
    dispatch(setOnDisplayAuctionN00unId(n00unId.toNumber()));
  };

  const { image, description } = getN00un(n00unId, seed);

  const n00un = <N00un imgPath={image} alt={description} />;
  const n00unWithLink = (
    <Link
      to={'/n00un/' + n00unId.toString()}
      className={classes.clickableN00un}
      onClick={onClickHandler}
    >
      {n00un}
    </Link>
  );
  return shouldLinkToProfile ? n00unWithLink : n00un;
};

export default StandaloneN00un;
