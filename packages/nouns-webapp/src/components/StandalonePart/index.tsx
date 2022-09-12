import { ImageData as data, getPartData } from '@nouns/assets';
import { buildPartSVG } from '@nouns/sdk';
import Image from 'react-bootstrap/Image';

interface StandalonePartProps {
    partType: string;
    partIndex: number;
}

export const getPart = (partType: string, partIndex: number) => {
  const part = getPartData(partType, partIndex);
  const image = `data:image/svg+xml;base64,${btoa(buildPartSVG(part, data.palette))}`;

  return {
    image,
  };
};

export const StandalonePart: React.FC<StandalonePartProps> = (props: StandalonePartProps) => {

  const trait = getPart(props.partType, props.partIndex);

  return (
    <>
      <Image
          src={trait ? trait.image : ''}
          fluid
        />
    </>
  );
};

export default StandalonePart;
