/* eslint-disable react/prop-types */
import { cn } from '@/lib/utils';

interface VoteStatusPillProps {
  status: string;
  text: React.ReactNode;
}

const VoteStatusPill: React.FC<VoteStatusPillProps> = props => {
  const { status, text } = props;
  const base =
    'font-pt my-[5px] flex h-7 w-fit items-center justify-center rounded-[8px] px-2 text-center align-middle text-[14px] font-bold';
  switch (status) {
    case 'success':
      return (
        <div className={cn(base, 'bg-brand-color-blue-translucent text-brand-color-blue')}>
          {text}
        </div>
      );
    case 'failure':
      return (
        <div className={cn(base, 'bg-brand-color-red-translucent text-brand-color-red')}>
          {text}
        </div>
      );
    default:
      return (
        <div className={cn(base, 'bg-brand-color-green-translucent text-brand-color-green')}>
          {text}
        </div>
      );
  }
};

export default VoteStatusPill;
