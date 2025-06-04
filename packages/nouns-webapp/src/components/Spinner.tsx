import { LoaderCircleIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface SpinnerProps {
  className?: string;
}

export const Spinner = ({ className }: SpinnerProps) => (
  <LoaderCircleIcon className={cn('size-10 animate-spin', className)} />
);
