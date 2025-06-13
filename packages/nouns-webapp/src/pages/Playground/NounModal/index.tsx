import React, { useEffect, useState } from 'react';

import { DownloadIcon } from 'lucide-react';
import ReactDOM from 'react-dom';

import LegacyNoun from '@/components/LegacyNoun';
import { Backdrop } from '@/components/Modal';
import { Button } from '@/components/ui/button';
import { svg2png } from '@/utils/svg2png';

import classes from './NounModal.module.css';

const downloadNounPNG = (png: string) => {
  const downloadEl = document.createElement('a');
  downloadEl.href = png;
  downloadEl.download = 'noun.png';
  downloadEl.click();
};

const downloadNounSVG = (svg: string) => {
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const downloadEl = document.createElement('a');
  downloadEl.href = url;
  downloadEl.download = 'noun.svg';
  downloadEl.click();
  URL.revokeObjectURL(url);
};

const NounModal: React.FC<{ onDismiss: () => void; svg: string }> = props => {
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
            <LegacyNoun
              imgPath={png}
              alt="noun"
              className={classes.nounImg}
              wrapperClassName={classes.nounWrapper}
            />
          )}
          <div className={classes.displayNounFooter}>
            {!isMobile && png && (
              <div className="flex gap-3">
                <Button
                  variant={'outline'}
                  onClick={() => {
                    downloadNounPNG(png);
                  }}
                >
                  <DownloadIcon size={16} />
                  PNG
                </Button>
                <Button
                  variant={'outline'}
                  onClick={() => {
                    downloadNounSVG(svg);
                  }}
                >
                  <DownloadIcon size={16} />
                  SVG
                </Button>
              </div>
            )}
          </div>
        </div>,
        document.getElementById('overlay-root')!,
      )}
    </>
  );
};
export default NounModal;
