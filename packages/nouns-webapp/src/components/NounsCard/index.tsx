import React from 'react';
import { Card } from 'react-bootstrap';
import classes from './NounsCard.module.css';

interface NounsCardProps {
  children: React.ReactNode;
}

const NounsCard: React.FC<NounsCardProps> = props => {
  const { children } = props;

  return (
    <Card className={classes.voteInfoCard}>
      <Card.Body className="p-2">{children}</Card.Body>
    </Card>
  );
};

export default NounsCard;
