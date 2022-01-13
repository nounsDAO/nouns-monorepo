import classes from './NavBarButton.module.css';

export enum NavBarButtonStyle {
    COOL_INFO,
    COOL_WALLET,
    WARM_INFO,
    WARM_WALLET,
    WHITE_INFO,
    WHITE_ACTIVE
}

interface NavBarButtonProps {
    buttonText: string;
    buttonIcon?: React.ReactNode;
    buttonStyle?: NavBarButtonStyle;
}

const NavBarButton: React.FC<NavBarButtonProps> = props => {
    const { buttonText, buttonIcon, buttonStyle } = props;

    const variant = () => {
        switch (buttonStyle) {
            case NavBarButtonStyle.COOL_INFO: {
                return classes.coolInfo;
            }
            case NavBarButtonStyle.COOL_WALLET: {
                return classes.coolWallet;
            }
            case NavBarButtonStyle.WARM_INFO: {
                return classes.warnInfo;
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
            default: {return classes.info;}
        }
    };

    return (
        <>
            <div className={`${classes.wrapper} ${variant()}`}>
                <div className={classes.button}>

                    {
                        buttonIcon &&  (
                            <div className={classes.icon}>
                                {buttonIcon}
                            </div>
                        )
                    }
                    <div>
                        {buttonText}
                    </div>
                </div>
            </div>
        </>
    )

};

export default NavBarButton;