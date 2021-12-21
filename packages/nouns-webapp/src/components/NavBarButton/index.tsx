import classes from './NavBarButton.module.css';

interface NavBarButtonProps {
    buttonText: string;
    buttonIcon?: React.ReactNode;
    buttonStyle?: string;
}

const NavBarButton: React.FC<NavBarButtonProps> = props => {
    const { buttonText, buttonIcon, buttonStyle } = props;

    const variant = () => {
        switch (buttonStyle) {
            case 'cool-info': {
                return classes.coolInfo;
            }
            case 'cool-wallet': {
                return classes.coolWallet;
            }
            case 'warm-info': {
                return classes.warnInfo;
            }
            case 'warm-wallet': {
                return classes.warmWallet;
            }
            case 'white-info': {
                return classes.whiteInfo;
            }
            case 'white-active': {
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
                        buttonIcon ?  (
                            <div className={classes.icon}>
                                {buttonIcon}
                            </div>
                        ): (<></>)
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