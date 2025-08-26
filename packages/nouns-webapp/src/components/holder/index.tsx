import React from 'react';

import { useQuery } from '@apollo/client';
import { Trans } from '@lingui/react/macro';

import ShortAddress from '@/components/short-address';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useAppSelector } from '@/hooks';
import { cn } from '@/lib/utils';
import { buildEtherscanAddressLink } from '@/utils/etherscan';
import { nounQuery } from '@/wrappers/subgraph';

import classes from './holder.module.css';

interface HolderProps {
  nounId: bigint;
  isNounders?: boolean;
}

const Holder: React.FC<HolderProps> = props => {
  const { nounId, isNounders } = props;

  const isCool = useAppSelector(state => state.application.isCoolBackground);

  const { query, variables } = nounQuery(nounId.toString());
  const { loading, error, data } = useQuery(query, { variables });

  if (loading) {
    return <></>;
  } else if (error) {
    return (
      <div>
        <Trans>Failed to fetch Noun info</Trans>
      </div>
    );
  }

  const holder = data?.noun?.owner?.id;

  const nonNounderNounContent = (
    <a
      href={buildEtherscanAddressLink(holder)}
      target={'_blank'}
      rel="noreferrer"
      className={classes.link}
    >
      <Tooltip>
        <TooltipContent id="holder-etherscan-tooltip">
          <Trans>View on Etherscan</Trans>
        </TooltipContent>
        <TooltipTrigger>
          <ShortAddress size={40} address={holder} avatar={true} />
        </TooltipTrigger>
      </Tooltip>
    </a>
  );

  const nounderNounContent = 'nounders.eth';

  return (
    <>
      <div className={cn('grid grid-cols-12 gap-3', classes.wrapper, classes.section)}>
        <div className={cn('col-span-1 lg:col-span-12', classes.leftCol)}>
          <h4
            style={{
              color: isCool ? 'var(--brand-cool-light-text)' : 'var(--brand-warm-light-text)',
            }}
            className={classes.holderCopy}
          >
            <Trans>Held by</Trans>
          </h4>
        </div>
        <div className="col-auto lg:col-span-12">
          <h2
            className={classes.holderContent}
            style={{
              color: isCool ? 'var(--brand-cool-dark-text)' : 'var(--brand-warm-dark-text)',
            }}
          >
            {isNounders === true ? nounderNounContent : nonNounderNounContent}
          </h2>
        </div>
      </div>
    </>
  );
};

export default Holder;
