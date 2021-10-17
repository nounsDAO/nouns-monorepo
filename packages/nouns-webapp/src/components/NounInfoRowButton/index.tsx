import React from "react";
import { Button, Image } from "react-bootstrap";

interface NounInfoRowButtonProps {
    iconImgSource: string;
    btnText: string;
    onClickHandler: () => void
};

const NounInfoRowButton: React.FC<NounInfoRowButtonProps> = props => {
    const { iconImgSource, btnText, onClickHandler } = props;
        return (
            <>
                <Button variant='light' style={{
                    fontFamily: 'PT Root UI Bold',
                    backgroundColor: '#E9EBF3',
                    border: '0px',
                    borderRadius: '10px',
                    marginRight: '10px',
                    marginTop: '5px',
                    marginBottom: '5px'
                }} onClick={onClickHandler}>
                    <Image src={iconImgSource} style = {{
                        paddingRight: 5
                    }}/>
                        {btnText}
                </Button>
            </>
    );
};

export default NounInfoRowButton;