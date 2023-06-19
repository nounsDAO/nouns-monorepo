import { Button } from 'react-bootstrap';
import classes from './VrbModal.module.css';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Vrb from '../../../components/Vrb';
import { svg2png } from '../../../utils/svg2png';
import { Backdrop } from '../../../components/Modal';

const downloadVrbPNG = (png: string) => {
  const downloadEl = document.createElement('a');
  downloadEl.href = png;
  downloadEl.download = 'vrb.png';
  downloadEl.click();
};

const VrbModal: React.FC<{ onDismiss: () => void; svg: string }> = props => {
  const { onDismiss, svg } = props;

  const [width, setWidth] = useState<number>(window.innerWidth);
  const [png, setPng] = useState<string | null>();

  const isMobile: boolean = width <= 991;

  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);

    const loadPng = async () => {
      setPng(await svg2png(svg, 512, 512));
    };
    loadPng();

    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, [svg]);

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
          {png && (
            <Vrb
              imgPath={png}
              alt="vrb"
              className={classes.vrbImg}
              wrapperClassName={classes.vrbWrapper}
            />
          )}
          <div className={classes.displayVrbFooter}>
            <span>Use this Vrb as your profile picture!</span>
            {!isMobile && png && (
              <Button
                onClick={() => {
                  downloadVrbPNG(png);
                }}
              >
                Download
              </Button>
            )}
          </div>
        </div>,
        document.getElementById('overlay-root')!,
      )}
    </>
  );
};
export default VrbModal;
