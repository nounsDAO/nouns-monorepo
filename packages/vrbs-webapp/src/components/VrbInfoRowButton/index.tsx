import React from 'react';
import { Image } from 'react-bootstrap';
import classes from './VrbInfoRowButton.module.css';
import { useAppSelector } from '../../hooks';

interface VrbInfoRowButtonProps {
  iconImgSource: string;
  btnText: React.ReactNode;
  onClickHandler: () => void;
}

const VrbInfoRowButton: React.FC<VrbInfoRowButtonProps> = props => {
  const { iconImgSource, btnText, onClickHandler } = props;
  const isCool = useAppSelector(state => state.application.isCoolBackground);
  return (
    <div
      className={isCool ? classes.vrbButtonCool : classes.vrbButtonWarm}
      onClick={onClickHandler}
    >
      <div className={classes.vrbButtonContents}>
        <Image src={iconImgSource} className={classes.buttonIcon} />
        {btnText}
      </div>
    </div>
  );
};

export default VrbInfoRowButton;
