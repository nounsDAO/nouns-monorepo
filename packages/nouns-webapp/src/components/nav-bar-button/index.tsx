import { FC, HTMLAttributes } from 'react';

import { faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { cn } from '@/lib/utils';

// Migrated from CSS modules to Tailwind utility classes

export enum NavBarButtonStyle {
  COOL_INFO,
  COOL_WALLET,
  WARM_INFO,
  WARM_WALLET,
  WHITE_INFO,
  WHITE_ACTIVE,
  WHITE_ACTIVE_VOTE_SUBMIT,
  WHITE_WALLET,
  DELEGATE_BACK,
  DELEGATE_PRIMARY,
  DELEGATE_SECONDARY,
  DELEGATE_DISABLED,
  FOR_VOTE_SUBMIT,
  AGAINST_VOTE_SUBMIT,
  ABSTAIN_VOTE_SUBMIT,
}

interface NavBarButtonProps extends HTMLAttributes<HTMLDivElement> {
  buttonText: React.ReactNode;
  buttonIcon?: React.ReactNode;
  buttonStyle?: NavBarButtonStyle;
  disabled?: boolean;
  className?: string;
  isDropdown?: boolean;
  isButtonUp?: boolean;
}

export const getNavBarButtonVariant = (buttonStyle?: NavBarButtonStyle) => {
  const whiteInfo =
    'border border-black/10 bg-white text-[rgb(95,95,95)] hover:bg-[#e2e3e8] hover:text-black';
  switch (buttonStyle) {
    case NavBarButtonStyle.COOL_INFO: {
      return 'rounded-[10px] border border-[var(--brand-cool-border)] text-[var(--brand-cool-dark-text)] hover:bg-[var(--brand-cool-accent)] hover:text-black';
    }
    case NavBarButtonStyle.COOL_WALLET: {
      return 'rounded-[10px] border border-[var(--brand-cool-border)] bg-[var(--brand-cool-accent)] px-3 py-0 text-[var(--brand-warm-dark-text)] transition-all duration-[200ms] ease-in-out hover:bg-[var(--brand-color-blue)] hover:text-white hover:brightness-110';
    }
    case NavBarButtonStyle.WARM_INFO: {
      return 'rounded-[10px] border border-[var(--brand-warm-border)] text-[var(--brand-warm-dark-text)] hover:bg-[var(--brand-warm-accent)] hover:text-black';
    }
    case NavBarButtonStyle.WARM_WALLET: {
      return 'rounded-[10px] border border-[var(--brand-warm-border)] bg-[var(--brand-warm-accent)] px-3 py-0 text-[var(--brand-warm-dark-text)] transition-all duration-[200ms] ease-in-out hover:bg-[var(--brand-color-red)] hover:text-white hover:brightness-110';
    }
    case NavBarButtonStyle.WHITE_INFO: {
      return whiteInfo;
    }
    case NavBarButtonStyle.WHITE_ACTIVE: {
      return 'bg-[#f4f4f8] text-black';
    }
    case NavBarButtonStyle.WHITE_ACTIVE_VOTE_SUBMIT: {
      return 'bg-[#e2e3e8] text-black';
    }
    case NavBarButtonStyle.WHITE_WALLET: {
      return whiteInfo;
    }
    case NavBarButtonStyle.DELEGATE_BACK: {
      return 'w-[100px] border border-black/10 bg-white text-[var(--brand-cool-dark-text)] hover:bg-[#e2e3e8] hover:text-[var(--brand-cool-dark-text)]';
    }
    case NavBarButtonStyle.DELEGATE_PRIMARY: {
      return 'w-[210px] bg-[var(--brand-cool-dark-text)] text-white hover:brightness-200 lg:w-[315px]';
    }
    case NavBarButtonStyle.DELEGATE_SECONDARY: {
      return 'w-[210px] border-0 bg-[var(--brand-color-blue)] text-white hover:bg-[var(--brand-color-blue-darker)] lg:w-[315px]';
    }
    case NavBarButtonStyle.DELEGATE_DISABLED: {
      return 'w-[210px] border-0 bg-[var(--brand-color-blue)] text-white opacity-50 lg:w-[315px]';
    }
    case NavBarButtonStyle.FOR_VOTE_SUBMIT: {
      return 'bg-[var(--brand-color-green-translucent)] text-[var(--brand-color-green)] hover:brightness-[.8]';
    }
    case NavBarButtonStyle.AGAINST_VOTE_SUBMIT: {
      return 'bg-[var(--brand-color-red-translucent)] text-[var(--brand-color-red)] hover:brightness-[.8]';
    }
    case NavBarButtonStyle.ABSTAIN_VOTE_SUBMIT: {
      return 'bg-[var(--brand-gray-light-text-translucent)] text-[var(--brand-gray-light-text)] hover:brightness-[.8]';
    }
    default: {
      // default "info" state maps to neutral/white button
      return whiteInfo;
    }
  }
};

const NavBarButton: FC<NavBarButtonProps> = ({
  buttonText,
  buttonIcon,
  buttonStyle,
  onClick,
  isDropdown,
  isButtonUp,
  disabled,
  className = '',
}) => {
  const isDisabled = disabled ?? false;

  const baseWrapper =
    'font-pt h-12 rounded-[10px] border border-black/10 px-3 text-[18px] font-bold leading-4 !shadow-none transition-all duration-150 ease-in-out lg:h-10 lg:text-base';
  const baseButton =
    'flex h-full w-full flex-row items-center justify-center text-[18px] lg:text-base';
  const baseIcon = 'mr-[0.4rem] [&>svg]:max-h-[17px] [&>svg]:opacity-50 lg:[&>svg]:max-h-[14px]';
  const dropdownWrapper = 'pl-1';
  const dropdownIcon =
    'mr-[0.2rem] block w-[30px] [&>svg]:relative [&>svg]:top-[1px] [&>svg]:max-h-10 [&>svg]:w-full';
  const stateCursor = isDisabled ? 'cursor-not-allowed' : 'cursor-pointer';

  return (
    <>
      <div
        className={cn(
          baseWrapper,
          getNavBarButtonVariant(buttonStyle),
          isDropdown === true && dropdownWrapper,
          className,
        )}
        onClick={isDisabled ? () => {} : onClick}
      >
        <div className={cn(baseButton, stateCursor)}>
          {buttonIcon !== undefined && (
            <div className={cn(baseIcon, isDropdown === true && dropdownIcon)}>{buttonIcon}</div>
          )}
          <div>{buttonText}</div>
          {isDropdown === true && (
            <div className={cn('ml-2', isButtonUp === true ? 'mt-2' : 'mb-1')}>
              <FontAwesomeIcon icon={isButtonUp === true ? faSortUp : faSortDown} />{' '}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NavBarButton;
