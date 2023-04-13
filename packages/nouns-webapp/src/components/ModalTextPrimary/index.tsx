import classes from './ModalTextPrimary.module.css';

interface ModalTextPrimaryProps {
  children?: React.ReactNode;
}

export default function ModalTextPrimary({ children }: ModalTextPrimaryProps) {
  return <div className={classes.text}>{children}</div>;
}
