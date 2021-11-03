import classes from './HowItWorks.module.css';

const HowItWorks = () => (
  <div id="works" className={classes.container}>
    <h2>How it works</h2>
    <div className={classes.contentWrapper}>
      <div className={classes.contentImg} />
      <div className={classes.content}>
        <h3>This is another sub-header</h3>
        <p>
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod
          tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod
          tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim.
        </p>
      </div>
    </div>
  </div>
);

export default HowItWorks;
