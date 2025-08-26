import type { Address } from '@/utils/types';

import React from 'react';

import { Trans } from '@lingui/react/macro';

import ShortAddress from '@/components/short-address';
import { buildEtherscanAddressLink } from '@/utils/etherscan';


type OriginalSignatureProps = {
  voteCount: number;
  signer: Address;
  isParentProposalUpdatable: boolean;
};

const OriginalSignature: React.FC<OriginalSignatureProps> = ({
  isParentProposalUpdatable,
  signer,
  voteCount,
}) => {
  return (
    <li
      className={
        'm-0 mb-[10px] min-h-[40px] list-none rounded-[12px] border-2 border-dashed border-[rgba(0,0,0,0.05)] p-[10px]'
      }
    >
      <div className={'flex flex-row justify-between'}>
        <div>
          <p className={'m-0 p-0 leading-[1.1]'}>
            <a href={buildEtherscanAddressLink(signer)} target={'_blank'} rel="noreferrer">
              <ShortAddress address={signer} />
            </a>
          </p>
        </div>
        <p className={'m-0 p-0 text-[13px] font-bold text-[#646465]'}>
          {voteCount} vote{voteCount !== 1 && 's'}
        </p>
      </div>
      <p className={'mt-[15px] text-center text-[14px] leading-[1.2] text-[#646465]'}>
        {isParentProposalUpdatable ? (
          <Trans>Awaiting signature</Trans>
        ) : (
          <Trans>Did not re-sign</Trans>
        )}
      </p>
    </li>
  );
};

export default OriginalSignature;
