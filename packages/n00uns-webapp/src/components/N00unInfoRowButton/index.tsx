import React from 'react';
import { Image } from 'react-bootstrap';
import classes from './N00unInfoRowButton.module.css';
import { useAppSelector } from '../../hooks';

interface N00unInfoRowButtonProps {
  iconImgSource: string;
  btnText: React.ReactNode;
  onClickHandler: () => void;
}

const N00unInfoRowButton: React.FC<N00unInfoRowButtonProps> = props => {
  const { iconImgSource, btnText, onClickHandler } = props;
  const isCool = useAppSelector(state => state.application.isCoolBackground);
  return (
    <div
      className={isCool ? classes.n00unButtonCool : classes.n00unButtonWarm}
      onClick={onClickHandler}
    >
      <div className={classes.n00unButtonContents}>
        <Image src={iconImgSource} className={classes.buttonIcon} />
        {btnText}
      </div>
    </div>
  );
};

export default N00unInfoRowButton;
