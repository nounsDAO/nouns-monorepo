import classes from './Modal.module.css';
import ReactDOM from 'react-dom';
import xIcon from '../../assets/x-icon.png';

const Backdrop: React.FC<{ onDismiss: () => void }> = props => {
  return <div className={classes.backdrop} onClick={props.onDismiss} />;
};

const ModalOverlay: React.FC<{
  title: string;
  message: string;
  onDismiss: () => void;
}> = props => {
  return (
    <div className={classes.modal}>
      <button onClick={props.onDismiss}>
        <img src={xIcon} alt="Button to close modal" />
      </button>
      <h3>{props.title}</h3>
      <div className={classes.content}>
        <p>{props.message}</p>
      </div>
    </div>
  );
};

const Modal: React.FC<{ title: string; message: string; onDismiss: () => void }> = props => {
  return (
    <>
      {ReactDOM.createPortal(
        <Backdrop onDismiss={props.onDismiss} />,
        document.getElementById('backdrop-root')!,
      )}
      {ReactDOM.createPortal(
        <ModalOverlay title={props.title} message={props.message} onDismiss={props.onDismiss} />,
        document.getElementById('overlay-root')!,
      )}
    </>
  );
};

export default Modal;
