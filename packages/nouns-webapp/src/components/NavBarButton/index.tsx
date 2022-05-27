import classes from './NavBarButton.module.css';

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
}

interface NavBarButtonProps {
  buttonText: React.ReactNode;
  buttonIcon?: React.ReactNode;
  buttonStyle?: NavBarButtonStyle;
  onClick?: (e?: any) => void;
}

export const getNavBarButtonVariant = (buttonStyle?: NavBarButtonStyle) => {
  switch (buttonStyle) {
    case NavBarButtonStyle.COOL_INFO: {
      return classes.coolInfo;
    }
    case NavBarButtonStyle.COOL_WALLET: {
      return classes.coolWallet;
    }
    case NavBarButtonStyle.WARM_INFO: {
      return classes.warmInfo;
    }
    case NavBarButtonStyle.WARM_WALLET: {
      return classes.warmWallet;
    }
    case NavBarButtonStyle.WHITE_INFO: {
      return classes.whiteInfo;
    }
    case NavBarButtonStyle.WHITE_ACTIVE: {
      return classes.whiteActive;
    }
    case NavBarButtonStyle.WHITE_ACTIVE_VOTE_SUBMIT: {
      return classes.whiteActiveVoteSubmit;
    }
    case NavBarButtonStyle.WHITE_WALLET: {
      return classes.whiteWallet;
    }
    case NavBarButtonStyle.DELEGATE_BACK: {
      return classes.delegateBack;
    }
    case NavBarButtonStyle.DELEGATE_PRIMARY: {
      return classes.delegatePrimary;
    }
    case NavBarButtonStyle.DELEGATE_SECONDARY: {
      return classes.delegateSecondary;
    }
    default: {
      return classes.info;
    }
  }
};

const NavBarButton: React.FC<NavBarButtonProps> = props => {
  const { buttonText, buttonIcon, buttonStyle, onClick } = props;

  return (
    <>
      <div
        className={`${classes.wrapper} ${getNavBarButtonVariant(buttonStyle)}`}
        onClick={onClick}
      >
        <div className={classes.button}>
          {buttonIcon && <div className={classes.icon}>{buttonIcon}</div>}
          <div>{buttonText}</div>
        </div>
      </div>
    </>
  );
};

export default NavBarButton;
