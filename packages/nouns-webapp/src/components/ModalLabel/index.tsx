import classes from './ModalLabel.module.css';

interface ModalLabelProps {
  children?: React.ReactNode;
}

export default function ModalLabel({ children }: ModalLabelProps) {
  return <div className={classes.label}>{children}</div>;
}
