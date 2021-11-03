import classes from './Lungs.module.css';
import rightArrow from './assets/rightArrow.svg';

const Lungs = () => (
  <div>
    <div style={{ backgroundColor: '#000' }}>
      <div className={classes.LungsContentWrapper}>
        <div className={classes.diatomImg}></div>
        <div className={classes.LungsContent}>
          <h2>Meet the real lungs of the planet</h2>
          <p>
            Diatoms are algae in oceans, lakes and waterways that are responsible for sequestering
            carbon and provide 50% of all the air that we breathe on earth.
          </p>
          <a href="#diatom" target="_blank">
            Learn more
            <img src={rightArrow} alt="Arrow" />
          </a>
        </div>
      </div>
    </div>
    <div className={classes.topics}>
      <div className={classes.topic}>
        <div className={classes.dot}></div>
        <h5>Asset-backed</h5>
        <p>
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod
          tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim.
        </p>
      </div>
      <div className={classes.topic}>
        <div className={classes.dot}></div>
        <h5>Protocol Controlled</h5>
        <p>
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod
          tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim.
        </p>
      </div>
      <div className={classes.topic}>
        <div className={classes.dot}></div>
        <h5>Community Governed</h5>
        <p>
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod
          tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim.
        </p>
      </div>
    </div>
  </div>
);

export default Lungs;
