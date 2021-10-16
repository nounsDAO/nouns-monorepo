import { useQuery } from "@apollo/client";
import React from "react";
import { Image } from "react-bootstrap";
import _LinkIcon from '../../assets/icons/Link.svg';
import { useReverseENSLookUp } from "../../utils/ensLookup";
import { nounQuery } from "../../wrappers/subgraph";

import classes from "./NounInfoRowHolder.module.css";

interface NounInfoRowHolderProps {
    nounId: number;
};

const NounInfoRowHolder: React.FC<NounInfoRowHolderProps> = props => {
    const {nounId} = props;

    const { loading, error, data } = useQuery(nounQuery(nounId.toString()));

    var userAddressRaw = "";
    if (data) {
        userAddressRaw = data.noun.owner.id;
    }
  
    const userENSAddress = useReverseENSLookUp(userAddressRaw);
    const etherscanURL = "https://etherscan.io/address/" + userAddressRaw;


    if (loading) {
        return <p>Loading...</p> 
    } else if (error) {
        return <div>Failed to fetch noun info</div>;
    }

    return (
        <>
            Held by <strong style={{
                paddingLeft: 4,
                fontWeight: 'bold',
            }}>
                    <a
                        className={classes.nounHolderEtherscanLink}
                        href={etherscanURL}
                        target={'_blank'}
                        rel="noreferrer"
                        >
                        {userENSAddress || userAddressRaw}
                    </a>
            </strong>    
                
            <Image src={_LinkIcon} style = {{
                paddingLeft: 5
            }}/>
        </>
    )
};

export default NounInfoRowHolder;