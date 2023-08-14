import classes from './NavBarTreasury.module.css';
import { NavBarButtonStyle } from '../NavBarButton';
import clsx from 'clsx';
import { Trans } from '@lingui/macro';
// import { i18n } from '@lingui/core';
import { IS_MAINNET } from '../../config';
import { useEthers } from '@usedapp/core';

interface NavBarTreasuryProps {
  treasuryBalance: string;
  treasuryStyle: NavBarButtonStyle;
}

const NavBarTreasury: React.FC<NavBarTreasuryProps> = props => {
  const { treasuryBalance, treasuryStyle } = props;
  const { chainId } = useEthers();

  console.log(treasuryBalance);
  let treasuryStyleClass;
  switch (treasuryStyle) {
    case NavBarButtonStyle.WARM_INFO:
      treasuryStyleClass = classes.warmInfo;
      break;
    case NavBarButtonStyle.COOL_INFO:
      treasuryStyleClass = classes.coolInfo;
      break;
    case NavBarButtonStyle.WHITE_INFO:
    default:
      treasuryStyleClass = classes.whiteInfo;
      break;
  }

  let output;

  if (IS_MAINNET) {
    if (chainId === 1) {
      output = <div className={`${classes.wrapper} ${treasuryStyleClass}`}>
        <div className={classes.button}>
          <div
            className="d-flex flex-row justify-content-around"
            style={{
              paddingTop: '1px',
            }}
          >
            <div
              className={clsx(
                classes.treasuryHeader,
                treasuryStyle === NavBarButtonStyle.WHITE_INFO ? classes.whiteTreasuryHeader : '',
              )}
            >
              <Trans>Treasury</Trans>
            </div>
            <div className={classes.treasuryBalance}>$ {treasuryBalance}</div>
          </div>
        </div>
      </div>
    } else {
        output = <div className={`${classes.wrapper} ${treasuryStyleClass}`}>
        <div className={classes.button}>
          <div
            className="d-flex flex-row justify-content-around"
            style={{
              paddingTop: '1px',
            }}
          >
            <div
              className={clsx(
                classes.treasuryHeader,
                treasuryStyle === NavBarButtonStyle.WHITE_INFO ? classes.whiteTreasuryHeader : '',
              )}
            >
              <Trans>Connect To Ethereum To View Treasury</Trans>
            </div>
          </div>
        </div>
      </div>
    }
  } else {
    console.log("IM ELSE");
  }

  return (
    <>
    {output}
    </>
    // <div className={`${classes.wrapper} ${treasuryStyleClass}`}>
    //   <div className={classes.button}>
    //     <div
    //       className="d-flex flex-row justify-content-around"
    //       style={{
    //         paddingTop: '1px',
    //       }}
    //     >
    //       <div
    //         className={clsx(
    //           classes.treasuryHeader,
    //           treasuryStyle === NavBarButtonStyle.WHITE_INFO ? classes.whiteTreasuryHeader : '',
    //         )}
    //       >
    //         <Trans>Treasury</Trans>
    //       </div>
    //       <div className={classes.treasuryBalance}>$ {treasuryBalance}</div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default NavBarTreasury;
