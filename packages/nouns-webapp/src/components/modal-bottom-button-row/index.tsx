import React from 'react';

import NavBarButton, { NavBarButtonStyle } from '../nav-bar-button';

export interface ModalBottomButtonRowProps {
  onPrevBtnClick: (e?: React.MouseEvent<HTMLDivElement>) => void;
  onNextBtnClick: (e?: React.MouseEvent<HTMLDivElement>) => void;
  prevBtnText: React.ReactNode;
  nextBtnText: React.ReactNode;
  isNextBtnDisabled?: boolean;
}

const ModalBottomButtonRow: React.FC<ModalBottomButtonRowProps> = props => {
  const {
    onPrevBtnClick,
    onNextBtnClick,
    prevBtnText,
    nextBtnText,
    isNextBtnDisabled = false,
  } = props;

  return (
    <div className="mt-8 flex justify-between">
      <NavBarButton
        buttonText={prevBtnText}
        buttonStyle={NavBarButtonStyle.DELEGATE_BACK}
        onClick={onPrevBtnClick}
      />
      <NavBarButton
        buttonText={nextBtnText}
        buttonStyle={
          isNextBtnDisabled
            ? NavBarButtonStyle.DELEGATE_DISABLED
            : NavBarButtonStyle.DELEGATE_SECONDARY
        }
        onClick={onNextBtnClick}
        disabled={isNextBtnDisabled}
      />
    </div>
  );
};

export default ModalBottomButtonRow;
