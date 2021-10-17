import { useQuery } from "@apollo/client";
import { BigNumber } from "@ethersproject/bignumber";
import { reduce } from "ramda";
import React from "react";
import { isNounderNoun } from "../../utils/nounderNoun";
import { auctionQuery } from "../../wrappers/subgraph";

import classes from './NounInfoRowBirthday.module.css';

interface NounInfoRowBirthdayProps {
    nounId: number;
};

const NounInfoRowBirthday: React.FC<NounInfoRowBirthdayProps> = props => {
    const { nounId } = props;


    // If the noun is a nounder noun, use the next noun to get the mint date.
    // We do this because we use the auction start time to get the mint date and 
    // nounder nouns do not have an auction start time.
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
            <div className={classes.birthdayInfoContainer} >
                Born 
              <div className={classes.nounInfoRowBirthday}> 
                  {monthNames[birthday.getUTCMonth()]} {birthday.getUTCDate()}, {birthday.getUTCFullYear()}
              </div>
          </div>
    );
};

export default NounInfoRowBirthday;