import classes from '../App.module.css';

/**
 * Helper function wrapping logic to select page background color.
 * @param useGreyBg State variable determing if we should use grey or beige background
 * @param pathname page pathname to allow for manual overrides
 * @returns background color string
 */
export const selectPageBgColors = (useGreyBg: boolean, pathname: string) => {
  if (pathname.startsWith('/profile/')) {
    return 'white';
  }

  return useGreyBg ? classes.greyBg : classes.beigeBg;
};
