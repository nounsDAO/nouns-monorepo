import { Button } from 'react-bootstrap';
import classes from './N00unModal.module.css';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import N00un from '../../../components/N00un';
import { svg2png } from '../../../utils/svg2png';
import { Backdrop } from '../../../components/Modal';

const downloadN00unPNG = (png: string) => {
  const downloadEl = document.createElement('a');
  downloadEl.href = png;
  downloadEl.download = 'n00un.png';
  downloadEl.click();
};

const N00unModal: React.FC<{ onDismiss: () => void; svg: string }> = props => {
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
            <N00un
              imgPath={png}
              alt="n00un"
              className={classes.n00unImg}
              wrapperClassName={classes.n00unWrapper}
            />
          )}
          <div className={classes.displayN00unFooter}>
            <span>Use this N00un as your profile picture!</span>
            {!isMobile && png && (
              <Button
                onClick={() => {
                  downloadN00unPNG(png);
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
export default N00unModal;
