import { ImageData as imageData, getPartData } from '@nouns/assets';
import { buildSVG } from '@nouns/sdk';
import Image from 'react-bootstrap/Image';
import classes from './StandalonePart.module.css';
import cx from 'classnames';

interface StandalonePartProps {
  partType: string;
  partIndex: number;
}

export const getPart = (partType: string, partIndex: number) => {
  const data = getPartData(partType, partIndex);
  const image = `data:image/svg+xml;base64,${btoa(buildSVG([{ data }], imageData.palette))}`;

  return { image };
};

export const StandalonePart: React.FC<StandalonePartProps> = (props: StandalonePartProps) => {
  let part;

  part = getPart(props.partType, props.partIndex);

  return (
    <>
      <Image src={part.image ? part.image : ''} fluid className={cx(classes.thumbnail)} />
    </>
  );
};

export default StandalonePart;
