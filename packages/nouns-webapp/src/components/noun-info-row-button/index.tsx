import React from 'react';

import { Image } from 'react-bootstrap';

import { useAppSelector } from '@/hooks';

import classes from './NounInfoRowButton.module.css';

interface NounInfoRowButtonProps {
  iconImgSource: string;
  btnText: React.ReactNode;
  onClickHandler: () => void;
}

const NounInfoRowButton: React.FC<NounInfoRowButtonProps> = props => {
  const { iconImgSource, btnText, onClickHandler } = props;
  const isCool = useAppSelector(state => state.application.isCoolBackground);
  return (
    <div
      className={isCool ? classes.nounButtonCool : classes.nounButtonWarm}
      onClick={onClickHandler}
    >
      <div className={classes.nounButtonContents}>
        <Image src={iconImgSource} className="my-auto mr-1.5 size-5" />
        {btnText}
      </div>
    </div>
  );
};

export default NounInfoRowButton;
