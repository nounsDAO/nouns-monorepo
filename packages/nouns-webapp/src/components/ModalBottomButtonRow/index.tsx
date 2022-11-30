import React from 'react';
import NavBarButton, { NavBarButtonStyle } from '../NavBarButton';
import classes from './ModalBottomButtonRow.module.css';

export interface ModalBottomButtonRowProps {
  onPrevBtnClick: (e?: any) => void;
  onNextBtnClick: (e?: any) => void;
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
    <div className={classes.buttonWrapper}>
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
