import { ImageData as imageData, getPartData } from '@nouns/assets';
import { buildSVG } from '@nouns/sdk';
import Image from 'react-bootstrap/Image';
import classes from './StandalonePart.module.css';
import cx from 'classnames';

interface StandalonePartProps {
  partType: string;
  partIndex: number;
}

export const getBackground = (partIndex: number) => {
  const bgColor = imageData.bgcolors[partIndex];
  const svg = `<svg width="320" height="320" viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="#${bgColor}" /></svg>`;
  const image = `data:image/svg+xml;base64,${btoa(svg)}`;
  return { image };
};

export const getPart = (partType: string, partIndex: number) => {
  const data = getPartData(partType, partIndex);
  const image = `data:image/svg+xml;base64,${btoa(buildSVG([{ data }], imageData.palette))}`;

  return { image };
};

export const StandalonePart: React.FC<StandalonePartProps> = (props: StandalonePartProps) => {
  let part;

  if (props.partType === 'backgrounds') {
    part = getBackground(props.partIndex);
  } else {
    part = getPart(props.partType, props.partIndex);
  }

  return (
    <>
      <Image src={part.image ? part.image : ''} fluid className={cx(classes.thumbnail)} />
    </>
  );
};

export default StandalonePart;
