import React from 'react';

import { Image } from 'react-bootstrap';
import { cn } from '@/lib/utils';

import { useAppSelector } from '@/hooks';

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
      className={cn(
        'font-pt hover:bg-brand-gray-hover mb-[5px] mr-[10px] mt-[5px] flex h-10 cursor-pointer flex-row items-center justify-center rounded-[10px] px-[10px] py-0 text-center align-middle font-bold no-underline transition-all duration-150 ease-in-out active:text-black',
        isCool
          ? 'bg-brand-cool-accent text-brand-cool-dark-text'
          : 'bg-brand-warm-accent text-brand-warm-dark-text',
      )}
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
