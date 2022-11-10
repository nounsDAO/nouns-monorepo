import React from 'react';
import { Image } from 'react-bootstrap';
import classes from './NounBRInfoRowButton.module.css';
import { useAppSelector } from '../../hooks';

interface NounBRInfoRowButtonProps {
  iconImgSource: string;
  btnText: React.ReactNode;
  onClickHandler: () => void;
}

const NounBRInfoRowButton: React.FC<NounBRInfoRowButtonProps> = props => {
  const { iconImgSource, btnText, onClickHandler } = props;
  const isCool = useAppSelector(state => state.application.isCoolBackground);
  return (
    <div
      className={isCool ? classes.nounbrButtonCool : classes.nounbrButtonWarm}
      onClick={onClickHandler}
    >
      <div className={classes.nounbrButtonContents}>
        <Image src={iconImgSource} className={classes.buttonIcon} />
        {btnText}
      </div>
    </div>
  );
};

export default NounBRInfoRowButton;
