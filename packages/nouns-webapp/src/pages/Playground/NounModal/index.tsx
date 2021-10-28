import { Button } from 'react-bootstrap';
import classes from './NounModal.module.css';
import React from 'react';
import ReactDOM from 'react-dom';
import Noun from '../../../components/Noun';
import { svg2png } from '../../../utils/svg2png';
import { Backdrop } from '../../../components/Modal';

const downloadNounPNG = async (svgString: string) => {
  const png = await svg2png(svgString);
  if (png === null) return;
  const downloadEl = document.createElement('a');
  downloadEl.href = png;
  downloadEl.download = 'noun.png';
  downloadEl.click();
};

const NounModal: React.FC<{ onDismiss: () => void; svg: string }> = props => {
  const { onDismiss, svg } = props;
  return (
    <>
      {ReactDOM.createPortal(
        <Backdrop
          onDismiss={() => {
            onDismiss();
          }}
        />,
        document.getElementById('backdrop-root')!,
      )}
      {ReactDOM.createPortal(
        <div className={classes.modal}>
          <Noun
            imgPath={`data:image/svg+xml;base64,${btoa(svg)}`}
            alt="noun"
            className={classes.nounImg}
          />
          <div className={classes.displayNounFooter}>
            <span>Use this Noun as your profile picture!</span>
            <Button
              onClick={() => {
                downloadNounPNG(svg);
              }}
            >
              Download
            </Button>
          </div>
        </div>,
        document.getElementById('overlay-root')!,
      )}
    </>
  );
};
export default NounModal;
