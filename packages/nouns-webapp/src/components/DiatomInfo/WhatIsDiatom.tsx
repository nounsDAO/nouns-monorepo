import classes from './WhatIsDiatom.module.css';

const WhatIsDiatom = () => (
  <div id="diatom" className={classes.container}>
    <h2>What is Diatom</h2>
    <div className={classes.contentWrapper}>
      <div className={classes.content}>
        <h3>A DAO backed by Earth's most valuable asset</h3>
        <p>
          Diatom is a decentralized currency that grows more valuable as our ocean is measurably
          restored and protected. Members of the DAO vote on projects that restore ocean health and
          expand our buying power to do so.
        </p>
      </div>
      <div className={classes.contentImg} />
    </div>
  </div>
);

export default WhatIsDiatom;
