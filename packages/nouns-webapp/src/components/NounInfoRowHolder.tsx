import React from 'react';

import { Trans } from '@lingui/react/macro';
import { useQuery } from '@tanstack/react-query';
import { ExternalLinkIcon } from 'lucide-react';

import ShortAddress from '@/components/ShortAddress';
import { nounsAuctionHouseAddress } from '@/contracts';
import { cn } from '@/lib/utils';
import { execute } from '@/subgraphs/execute';
import { buildEtherscanAddressLink } from '@/utils/etherscan';
import { Address } from '@/utils/types';
import { defaultChain } from '@/wagmi';
import { auctionQuery } from '@/wrappers/subgraph';

interface NounInfoRowHolderProps {
  nounId: bigint;
  className?: string;
}

const NounInfoRowHolder: React.FC<NounInfoRowHolderProps> = props => {
  const { nounId, className } = props;

  const { isLoading, error, data } = useQuery({
    queryKey: ['auction', nounId],
    queryFn: () => execute(auctionQuery, { id: nounId.toString() }),
  });

  const winner = data && data.auction?.bidder?.id;

  if (isLoading) {
    return (
      <span className={cn('text-muted-foreground block', className)}>
        <Trans>Loading...</Trans>
      </span>
    );
  }

  if (error || !winner) {
    return <></>;
  }

  const etherscanURL = buildEtherscanAddressLink(winner);
  const shortAddressComponent = <ShortAddress address={winner as Address} />;
  const chainId = defaultChain.id;

  return (
    <span className={cn('text-muted-foreground block', className)}>
      <Trans>Winner</Trans>{' '}
      <a className="text-muted-foreground" href={etherscanURL} target={'_blank'} rel="noreferrer">
        {winner.toLowerCase() === nounsAuctionHouseAddress[chainId].toLowerCase() ? (
          <Trans>Nouns Auction House</Trans>
        ) : (
          shortAddressComponent
        )}
        <ExternalLinkIcon className="text-muted-foreground ml-0.5 inline-block size-3" />
      </a>
    </span>
  );
};

export default NounInfoRowHolder;
