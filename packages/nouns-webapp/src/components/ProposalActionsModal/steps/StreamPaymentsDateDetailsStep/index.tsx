import { Trans } from '@lingui/macro';
import React, { useEffect, useState } from 'react';
import { ProposalActionModalStepProps } from '../..';
import BrandDatePicker from '../../../BrandDatePicker';
import ModalBottomButtonRow from '../../../ModalBottomButtonRow';
import ModalSubTitle from '../../../ModalSubtitle';
import ModalTitle from '../../../ModalTitle';

const StreamPaymentDateDetailsStep: React.FC<ProposalActionModalStepProps> = props => {
  const { onPrevBtnClick, onNextBtnClick, setState } = props;

  const [startDate, setStartDate] = useState('');
  const [startTimestamp, setStartTimestamp] = useState(0);
  const [endDate, setEndDate] = useState('');
  const [endTimestamp, setEndTimestamp] = useState(0);

  useEffect(() => {
    setEndTimestamp(new Date(endDate).valueOf() / 1000);
    setStartTimestamp(new Date(startDate).valueOf() / 1000);
  }, [startDate, endDate]);

  return (
    <div>
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
        isInvalid={startTimestamp > 0 && new Date().getTime() / 1000 > startTimestamp}
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
        prevBtnText={<Trans>Close</Trans>}
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
    </div>
  );
};

export default StreamPaymentDateDetailsStep;
