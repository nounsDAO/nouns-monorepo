import * as React from 'react';

import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import { cn } from '@/lib/utils';

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = ({
  ref,
  className,
  sideOffset = 4,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> & {
  ref?: React.RefObject<React.ElementRef<typeof TooltipPrimitive.Content> | null>;
}) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 origin-[--radix-tooltip-content-transform-origin] rounded-md bg-black px-3 py-1.5 text-xs',
        className,
      )}
      {...props}
    >
      {children}
      <TooltipPrimitive.Arrow />
    </TooltipPrimitive.Content>
  </TooltipPrimitive.Portal>
);
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
