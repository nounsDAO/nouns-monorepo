import { useQuery } from '@apollo/client';
import { auctionQuery } from '../../wrappers/subgraph';
import classes from './NounProfileCardBirthday.module.css';
import React from 'react';

interface NounProfileCardBirthdayProps {
  nounId: number;
}

const NounProfileCardBirthday: React.FC<NounProfileCardBirthdayProps> = props => {
  const { nounId } = props;

  const { loading, error, data } = useQuery(auctionQuery(nounId));
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
        <h2 className={classes.birthday}>
            {monthNames[birthday.getUTCMonth()]} {birthday.getUTCDate()}, {birthday.getUTCFullYear()}
        </h2>
  );
};

export default NounProfileCardBirthday;
