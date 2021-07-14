import classes from './Section.module.css';

const Section: React.FC<{ bgColor: string }> = props => {
  return (
    <div className={classes.container} style={{ backgroundColor: props.bgColor }}>
      {props.children}
    </div>
  );
};
export default Section;
