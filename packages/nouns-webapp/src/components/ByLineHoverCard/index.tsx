import { useQuery } from "@apollo/client";
import { Trans } from "@lingui/macro";
import React from "react";
import { Spinner } from "react-bootstrap";
import { currentlyDelegatedNouns } from "../../wrappers/subgraph";
import HorizontalStackedNouns from "../HorizontalStackedNouns";
import ShortAddress from "../ShortAddress";
import classes from "./ByLineHoverCard.module.css";

interface ByLineHoverCardProps {
  proposerAddress: string;
}

const ByLineHoverCard: React.FC<ByLineHoverCardProps> = props => {
    const { proposerAddress } = props;

  const { data, loading, error } = useQuery(currentlyDelegatedNouns(proposerAddress));

  if (loading || (data && data.delegates.length === 0)) {
    return (
        <div style={{
            height: '100px'
        }}>
            <Spinner animation="border" />
        </div>
    );
  }
  if (error) {
    return <>Error fetching Vote info</>;
  }

  const sortedNounIds = data.delegates[0].nounsRepresented
    .map((noun: { id: string }) => {
      return parseInt(noun.id);
    })
    .sort((a: number, b: number) => {
      return a - b;
    });

  return (
    <div
        className={
            classes.wrapper
        }
    >
      <div
        className={classes.stackedNounWrapper}
      >
        <HorizontalStackedNouns
          nounIds={data.delegates[0].nounsRepresented.map((noun: { id: string }) => noun.id)}
        />
      </div>

      <div
        className={classes.address}
      >
        <ShortAddress address={data ? data.delegates[0].id : ''} />
      </div>

      <div
        className={classes.nounsRepresented}
      >

        <div
        >
          <Trans>
            <span className={classes.bold}>Representing Noun(s):</span>
          </Trans>{' '}
          {sortedNounIds.map((nounId: number, i: number) => {
            return (
              <span>
                {nounId}
                {i !== sortedNounIds.length - 1 && ', '}{' '}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ByLineHoverCard;
