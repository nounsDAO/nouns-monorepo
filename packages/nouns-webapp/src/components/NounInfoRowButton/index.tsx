import React from 'react';
import { Image } from 'react-bootstrap';
import classes from './NounInfoRowButton.module.css';
import { useAppSelector } from '../../hooks';
import { black, primary } from '../../utils/nounBgColors';

interface NounInfoRowButtonProps {
  iconImgSource: string;
  btnText: string;
  isEthereum?: boolean;
  onClickHandler: () => void;
}

const NounInfoRowButton: React.FC<NounInfoRowButtonProps> = props => {
  const { iconImgSource, btnText, onClickHandler, isEthereum } = props;
  const isCool = useAppSelector(state => state.application.isCoolBackground);
  return (
    <div
      className={classes.nounButtonCool}
      style={{ backgroundColor: isEthereum ? primary : black, color: isEthereum ? black : primary }}
      onClick={onClickHandler}
    >
      <div className={classes.nounButtonContents}>
        {/* <Image src={iconImgSource} className={classes.buttonIcon} /> */}
        {btnText}
      </div>
    </div>
  );
};

export default NounInfoRowButton;
