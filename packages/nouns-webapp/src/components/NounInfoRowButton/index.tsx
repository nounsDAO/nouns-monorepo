import React from "react";
import { Button, Image } from "react-bootstrap";
import { Link } from "react-router-dom";

import classes from './NounInfoRowButton.module.css';

interface NounInfoRowButtonProps {
    iconImgSource: string;
    btnText: string;
    linkURL: string;
    isInternalLink: boolean;
};

const NounInfoRowButton: React.FC<NounInfoRowButtonProps> = props => {
    const { iconImgSource, btnText, linkURL, isInternalLink } = props;
    if (isInternalLink) {
        return (
            <>
                <Button variant='light' style={{
                    fontFamily: 'PT Root UI Bold',
                    backgroundColor: '#E9EBF3',
                    border: '0px',
                    borderRadius: '10px',
                    marginRight: '10px',
                    marginTop: '5px',
                    marginBottom: '5px',
                }}>
                    <Image src={iconImgSource} style = {{
                        paddingRight: 5
                    }}/>
                        <Link to={linkURL} className={classes.nounHolderEtherscanLink} >
                            {btnText}
                        </Link>
                </Button>
            </>
    );
    } else {
        return (
                <>
                    <Button variant='light' style={{
                        fontFamily: 'PT Root UI Bold',
                        backgroundColor: '#E9EBF3',
                        border: '0px',
                        borderRadius: '10px',
                        marginRight: '10px',
                        marginTop: '5px',
                        marginBottom: '5px',
                    }}>
                        <Image src={iconImgSource} style = {{
                            paddingRight: 5
                        }}/>
                        <a
                            className={classes.nounHolderEtherscanLink}
                            href={linkURL}
                            target={'_blank'}
                            rel="noreferrer"
                            >
                            {btnText}
                        </a>
                    </Button>
                </>
        );
    }
};

export default NounInfoRowButton;