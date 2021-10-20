import { useQuery } from "@apollo/client";
import { shortenAddress } from "@usedapp/core";
import React from "react";
import { Image } from "react-bootstrap";
import _LinkIcon from '../../assets/icons/Link.svg';
import { useReverseENSLookUp } from "../../utils/ensLookup";
import { nounQuery } from "../../wrappers/subgraph";
import _HeartIcon from '../../assets/icons/Heart.svg';
import classes from "./NounInfoRowHolder.module.css";

interface NounInfoRowHolderProps {
    nounId: number;
};

const NounInfoRowHolder: React.FC<NounInfoRowHolderProps> = props => {
    const {nounId} = props;

    const { loading, error, data } = useQuery(nounQuery(nounId.toString()));

    const etherscanURL = `https://etherscan.io/address/${data && data.noun.owner.id}`;

    var address = ""
    if (data) {
        address = data.noun.owner.id;
    }
    const ens = useReverseENSLookUp(address);

    if (loading) {
        return <p>Loading...</p> 
    } else if (error) {
        return <div>Failed to fetch noun info</div>;
    }

    return (
        <div className={classes.nounHolderInfoContainer}>
            <span>
                <Image src={_HeartIcon} className={classes.heartIcon} /> 
            </span>
            Held by
            <span>
                <a
                    className={classes.nounHolderEtherscanLink}
                    href={etherscanURL}
                    target={'_blank'}
                    rel="noreferrer"
                    >
                        {ens ? ens: shortenAddress(data.noun.owner.id)}
                </a>
            </span>
            <span className={classes.linkIconSpan}>
                <Image src={_LinkIcon} className={classes.linkIcon}/>
            </span>
        </div>
    )
};

export default NounInfoRowHolder;