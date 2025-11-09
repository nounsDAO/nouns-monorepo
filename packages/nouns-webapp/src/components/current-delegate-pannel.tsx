import React from 'react';

import { Trans } from '@lingui/react/macro';
import { useAccount } from 'wagmi';

import NavBarButton, { NavBarButtonStyle } from '@/components/nav-bar-button';
import ShortAddress from '@/components/short-address';
import { useReadNounsTokenDelegates } from '@/contracts';
import { formatShortAddress } from '@/utils/address-and-ens-display-utils';

interface CurrentDelegatePannelProps {
  onPrimaryBtnClick: (e: React.MouseEvent<HTMLElement>) => void;
  onSecondaryBtnClick: (e: React.MouseEvent<HTMLElement>) => void;
}

const CurrentDelegatePannel: React.FC<CurrentDelegatePannelProps> = ({
  onPrimaryBtnClick,
  onSecondaryBtnClick,
}) => {
  const { address: maybeAccount } = useAccount();
  const { data: delegate } = useReadNounsTokenDelegates();
  const account = delegate ?? maybeAccount ?? '0x';
  const shortAccount = formatShortAddress(account);

  return (
    <div className="flex h-full flex-col justify-between">
      <div>
        <div className="px-3 pb-0 pt-4">
          <h1 className="font-londrina text-brand-cool-dark-text flex h-8 flex-col text-[42px] leading-[42px]">
            <Trans>Delegation</Trans>
          </h1>

          <p className="font-pt text-brand-cool-dark-text font-medium">
            <Trans>
              Noun votes are not transferable, but are{' '}
              <span className="font-bold">delegatable</span>, which means you can assign your vote
              to someone else as long as you own your Noun.
            </Trans>
          </p>
        </div>

        <div className="flex justify-between rounded-[14px] bg-white p-4">
          <div className="text-brand-cool-light-text mt-4 text-[18px] font-medium">
            <Trans>Current Delegate</Trans>
          </div>
          <div className="flex flex-col">
            <div className="text-brand-cool-dark-text flex flex-row text-[26px]">
              <ShortAddress address={account} avatar={true} size={39} />
            </div>
            <div className="text-brand-cool-light-text text-right text-[16px] font-medium">
              {shortAccount}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4 mt-2 flex justify-between lg:mb-0">
        <NavBarButton
          buttonText={<Trans>Close</Trans>}
          buttonStyle={NavBarButtonStyle.DELEGATE_BACK}
          onClick={onSecondaryBtnClick}
        />
        <NavBarButton
          buttonText={<Trans>Update Delegate</Trans>}
          buttonStyle={NavBarButtonStyle.DELEGATE_PRIMARY}
          onClick={onPrimaryBtnClick}
        />
      </div>
    </div>
  );
};

export default CurrentDelegatePannel;
