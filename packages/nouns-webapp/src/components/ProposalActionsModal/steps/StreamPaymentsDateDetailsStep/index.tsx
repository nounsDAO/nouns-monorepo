import React, { useEffect, useState } from 'react';

import { Trans } from '@lingui/react/macro';

import BrandDatePicker from '@/components/BrandDatePicker';
import ModalBottomButtonRow from '@/components/ModalBottomButtonRow';
import ModalSubTitle from '@/components/ModalSubtitle';
import ModalTitle from '@/components/ModalTitle';
import { currentUnixEpoch, toUnixEpoch } from '@/utils/timeUtils';

import { ProposalActionModalStepProps } from '../..';

const StreamPaymentDateDetailsStep: React.FC<ProposalActionModalStepProps> = props => {
  const { onPrevBtnClick, onNextBtnClick, setState } = props;

  const [startDate, setStartDate] = useState('');
  const [startTimestamp, setStartTimestamp] = useState(0);
  const [endDate, setEndDate] = useState('');
  const [endTimestamp, setEndTimestamp] = useState(0);

  useEffect(() => {
    setEndTimestamp(toUnixEpoch(endDate));
    setStartTimestamp(toUnixEpoch(startDate));
  }, [startDate, endDate]);

  return (
    <>
      <ModalTitle>
        <Trans>Add Streaming Payment Action</Trans>
      </ModalTitle>

      <ModalSubTitle>
        <Trans>
          We suggest adding a buffer between when you assume the proposal to be executed and when
          the stream begins.
        </Trans>
      </ModalSubTitle>

      <BrandDatePicker
        onChange={e => setStartDate(e.target.value)}
        label="Start date"
        isInvalid={startTimestamp > 0 && currentUnixEpoch() > startTimestamp}
      />

      <BrandDatePicker
        isInvalid={endTimestamp > 0 && endTimestamp < startTimestamp}
        onChange={e => setEndDate(e.target.value)}
        label="End date"
      />

      <ModalSubTitle>
        <Trans>Streams start and end at 00:00 UTC on selected dates.</Trans>
      </ModalSubTitle>

      <ModalBottomButtonRow
        prevBtnText={<Trans>Back</Trans>}
        onPrevBtnClick={onPrevBtnClick}
        nextBtnText={<Trans>Review Action Details</Trans>}
        onNextBtnClick={() => {
          setState(x => ({
            ...x,
            streamStartTimestamp: startTimestamp,
            streamEndTimestamp: endTimestamp,
          }));
          onNextBtnClick();
        }}
        isNextBtnDisabled={startTimestamp > 0 && endTimestamp > 0 && endTimestamp < startTimestamp}
      />
    </>
  );
};

export default StreamPaymentDateDetailsStep;
