import React from 'react';

import { Image } from 'react-bootstrap';

import { useAppSelector } from '@/hooks';

interface NounInfoRowButtonProps {
  iconImgSource: string;
  btnText: React.ReactNode;
  onClickHandler: () => void;
}

const NounInfoRowButton: React.FC<NounInfoRowButtonProps> = props => {
  const { iconImgSource, btnText, onClickHandler } = props;
  const isCool = useAppSelector(state => state.application.isCoolBackground);

  const baseBtnClasses =
    "mb-[5px] mr-[10px] mt-[5px] flex h-10 cursor-pointer flex-row items-center justify-center rounded-[10px] px-[10px] py-0 text-center align-middle font-pt font-bold transition-all duration-150 ease-in-out hover:bg-[var(--brand-gray-hover)] no-underline active:text-black";
  const coolClasses = 'bg-[var(--brand-cool-accent)] text-[var(--brand-cool-dark-text)]';
  const warmClasses = 'bg-[var(--brand-warm-accent)] text-[var(--brand-warm-dark-text)]';

  return (
    <div
      className={`${baseBtnClasses} ${isCool ? coolClasses : warmClasses}`}
      onClick={onClickHandler}
    >
      <div className="flex flex-row justify-between">
        <Image src={iconImgSource} className="my-auto mr-1.5 size-5" />
        {btnText}
      </div>
    </div>
  );
};

export default NounInfoRowButton;
