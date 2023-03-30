import React from 'react';
import classes from './Cloud.module.css';
import cloud from '../../assets/cloud.png';

interface CloudProps {
  /**
   * Cloud height in pixels wide
   */
  size?: number;
  /**
   * The number of pixels to offset the cloud from the top
   */
  offset?: number;
  /**
   * The number of seconds to start into the animation
   */
  startOffset?: number;
}
const pxNum = (num: number) => `${num}px`;
const secNum = (num: number) => `${num}s`;

const Cloud = (props: CloudProps) => {
  const width = pxNum(props.size ?? 120);
  const top = pxNum((props.offset ?? 0) + 160);
  const animationDelay = secNum(0 - (props.startOffset ?? 0));
  return (
    <>
      <div
        className={classes.cloud}
        style={{ backgroundImage: `url(${cloud})`, width, top, animationDelay }}
      ></div>
    </>
  );
};

export default Cloud;
