import { useQuery } from "@apollo/client";
import { BigNumber } from "@ethersproject/bignumber";
import React from "react";
import { isNounderNoun } from "../../utils/nounderNoun";
import { auctionQuery } from "../../wrappers/subgraph";

interface NounInfoRowBirthdayProps {
    nounId: number;
};

const NounInfoRowBirthday: React.FC<NounInfoRowBirthdayProps> = props => {
    const { nounId } = props;


    var nounIdForQuery = isNounderNoun(BigNumber.from(nounId)) ? nounId + 1 : nounId;

    const { loading, error, data } = useQuery(auctionQuery(nounIdForQuery));
    const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
    ];
  
    if (loading) {
      return <></>;
    } else if (error) {
      return <div>Failed to fetch noun auction info</div>;
    }
    
    const birthday = new Date(data.auction.startTime * 1000);

    return (
            <>
            Born 
            <div style={{
                paddingLeft: 4,
                fontFamily: 'PT Root UI Bold'
            }}>
                {monthNames[birthday.getUTCMonth()]} {birthday.getUTCDate()}, {birthday.getUTCFullYear()}
            </div>
      </>
    );
};

export default NounInfoRowBirthday;