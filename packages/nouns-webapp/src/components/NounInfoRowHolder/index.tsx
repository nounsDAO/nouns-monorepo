import { useQuery } from "@apollo/client";
import React from "react";
import { Image } from "react-bootstrap";
import _LinkIcon from '../../assets/icons/Link.svg';
import { nounQuery } from "../../wrappers/subgraph";
import ShortAddress from "../ShortAddress";

import classes from "./NounInfoRowHolder.module.css";

interface NounInfoRowHolderProps {
    nounId: number;
};

const NounInfoRowHolder: React.FC<NounInfoRowHolderProps> = props => {
    const {nounId} = props;

    const { loading, error, data } = useQuery(nounQuery(nounId.toString()));

    const etherscanURL = `https://etherscan.io/address/${data.noun.owner.id}`;


    if (loading) {
        return <p>Loading...</p> 
    } else if (error) {
        return <div>Failed to fetch noun info</div>;
    }

    return (
        <div className={classes.nounHolderInfoContainer}>
            Held by
            <a
                className={classes.nounHolderEtherscanLink}
                href={etherscanURL}
                target={'_blank'}
                rel="noreferrer"
                >
                    <ShortAddress address={data.noun.owner.id} />
            </a>
            <Image src={_LinkIcon} /> 
        </div>
    )
};

export default NounInfoRowHolder;