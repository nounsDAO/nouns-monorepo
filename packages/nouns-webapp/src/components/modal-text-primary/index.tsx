import classes from './modal-text-primary.module.css';

interface ModalTextPrimaryProps {
  children?: React.ReactNode;
}

const ModalTextPrimary = ({ children }: Readonly<ModalTextPrimaryProps>) => (
  <div className={classes.text}>{children}</div>
);
export default ModalTextPrimary;
