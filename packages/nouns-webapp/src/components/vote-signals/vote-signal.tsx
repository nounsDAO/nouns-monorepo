import React from 'react';

import { blo } from 'blo';
import { useEnsName } from 'wagmi';

import ShortAddress from '@/components/short-address';
import { Address } from '@/utils/types';

type VoteSignalProps = {
  support: number;
  voteCount: number;
  reason: string;
  address: Address;
};

const VoteSignal: React.FC<VoteSignalProps> = ({ address, reason, voteCount }) => {
  const { data: ensName } = useEnsName({ address });

  return (
    <div>
      <div>
        <div className="mb-1 flex gap-2.5 leading-none">
          {!!ensName && (
            <div className="max-w-7.5">
              <img
                alt={address}
                src={blo(address)}
                width={30}
                height={30}
                className="w-full rounded-full"
              />
            </div>
          )}
          <div className="flex flex-col gap-0">
            <strong className="text-base font-bold leading-tight">
              <ShortAddress address={address} size={10} />
            </strong>
            <span className="text-13 text-brand-gray-light-text font-bold leading-tight">
              {voteCount} vote{voteCount === 1 ? '' : 's'}
            </span>
          </div>
        </div>

        <p className="text-brand-gray-light-text m-0 p-0 pl-10 text-sm">{reason}</p>
      </div>
    </div>
  );
};

export default VoteSignal;
