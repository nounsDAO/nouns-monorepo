import React from "react";
import { Image } from "react-bootstrap";

interface NounInfoRowIconProps {
    imgSrc: string;
};

const NounInfoRowIcon: React.FC<NounInfoRowIconProps> = props => {
    const { imgSrc } = props;

    return (
        <Image src={imgSrc} style={{
            paddingRight: 5 
        }}/> 
    )
};

export default NounInfoRowIcon;