import classes from './BrandSpinner.module.css';

const BrandSpinner = () => {
  return (
    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        className={classes.spinner}
        d="M23 13C23 14.9778 22.3816 16.9112 21.223 18.5557C20.0644 20.2002 18.4176 21.4819 16.4909 22.2388C14.5642 22.9957 12.4441 23.1937 10.3988 22.8078C8.35342 22.422 6.47463 21.4696 5 20.0711"
        stroke="black"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle opacity="0.2" cx="12.5" cy="12.5" r="10.5" stroke="black" strokeWidth="4" />
    </svg>
  );
};

export default BrandSpinner;
