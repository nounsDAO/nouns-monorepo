import React from "react";
import { Row, Image , Button} from "react-bootstrap";

// TODO note this is wrong in terms of path
import classes from './NounInfoCard.module.css';

import _AddressIcon from '../../assets/icons/Address.svg';
import _BirthdayIcon from '../../assets/icons/Birthday.svg';
import _HeartIcon from '../../assets/icons/Heart.svg';
import _ClockIcon from '../../assets/icons/Clock.svg';
import _LinkIcon from '../../assets/icons/Link.svg';
import _BidsIcon from '../../assets/icons/Bids.svg';

import NounInfoRowIcon from '../../components/NounInfoRowIcon';
import NounInfoRowBirthday from "../NounInfoRowBirthday";
import NounInfoRowHolder from "../NounInfoRowHolder";
import NounInfoRowButton from "../NounInfoRowButton";




interface NounInfoCardProps {
    nounId: number;
}

const NounInfoCard: React.FC<NounInfoCardProps> = props => {

    const { nounId } = props;

    return (
        <>
            <Row>
                <div className={classes.nounInfoHeader}>
                    <h3>Profile</h3>
                    <h2>Noun {nounId}</h2>
                </div>
            </Row>
            <div className={classes.nounInfo}>
                <Row className={classes.nounInfoRow}> 
                    <NounInfoRowIcon imgSrc={_BirthdayIcon}/>
                    <NounInfoRowBirthday nounId={nounId} />
                </Row>
                <Row className={classes.nounInfoRow}> 
                    <NounInfoRowIcon imgSrc={_HeartIcon} />
                    <NounInfoRowHolder nounId={nounId} />
                </Row>
                <Row className={classes.nounInfoRow}>
                    <NounInfoRowButton iconImgSource={_BidsIcon} btnText={"Bids"} linkURL={"/noun/"+nounId.toString()} isInternalLink={true} />
                    <NounInfoRowButton iconImgSource={_AddressIcon} btnText={"Etherscan"} linkURL={"https://etherscan.io/address/0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03/" + nounId.toString()} isInternalLink={false} />
                </Row>
            </div>
    </>
    );
};

export default NounInfoCard;