import classes from './ModalSubtitle.module.css';
const ModalSubTitle = (props: { children: React.ReactNode }) => {
  return <div className={classes.subtitle}>{props.children}</div>;
};

export default ModalSubTitle;
