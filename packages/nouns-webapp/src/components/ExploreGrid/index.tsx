import React, { useState, useEffect, useRef } from 'react';
import { BigNumber } from 'ethers';
import { StandaloneNounImage } from '../../components/StandaloneNoun';
import classes from './ExploreGrid.module.css';
import cx from 'classnames';
import ExploreNounDetail from '../ExploreNounDetail';
// import {AnimatePresence, motion} from 'framer-motion/dist/framer-motion';

interface ExploreGridProps {
}

// Custom hook
function useKeyPress(targetKey: string) {
    // console.log("useKeyPress");
    // State for keeping track of whether key is pressed
    const [keyPressed, setKeyPressed] = useState(false);
  
    // Add event listeners
    useEffect(() => {
      // If pressed key is our target key then set to true
      function downHandler({ key }: KeyboardEvent) {
        if (key === targetKey) {
          setKeyPressed(true);
        }
      }
      // If released key is our target key then set to false
      const upHandler = ({ key }: KeyboardEvent) => {
        if (key === targetKey) {
          setKeyPressed(false);
        }
      };
  
      window.addEventListener('keydown', downHandler);
      window.addEventListener('keyup', upHandler);
      // Remove event listeners on cleanup
      return () => {
        window.removeEventListener('keydown', downHandler);
        window.removeEventListener('keyup', upHandler);
      };
    }, [targetKey]); // rerun the effect if the targetKey changes
  
    return keyPressed;
  }

const ExploreGrid: React.FC<ExploreGridProps> = props => {
    const nounCount = 429;
    // const gridOptions = [2.5, 5, 12.5];
    const [isFullView] = useState<boolean>(false);
    const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(false);
    const [activeSizeOption, setSizeOption] = useState<string>("medium");
    const sizeOptions = ["small", "medium", "large"];

    const [activeNoun, setActiveNoun] = useState<number | undefined>();
    
    const handleNounDetail = (nounId: number, sidebarVisibility: string) => {
        nounId > -1 && nounId < nounCount && setActiveNoun(nounId);
        sidebarVisibility === "visible" ? setIsSidebarVisible(true) : setIsSidebarVisible(false);
        sidebarVisibility !== "visible" && setActiveNoun(undefined);
    }

    const keyboardPrev: boolean = useKeyPress("ArrowLeft");
    const keyboardNext: boolean = useKeyPress("ArrowRight");
    const keyboardUp: boolean = useKeyPress("ArrowUp");
    const keyboardDown: boolean = useKeyPress("ArrowDown");

    useEffect(() => {
        if (keyboardPrev) {
            focusNoun(activeNoun && activeNoun - 1);
        }
        if (keyboardNext) {
            focusNoun(activeNoun && activeNoun + 1);
        }
        if (keyboardUp) {
            if (activeSizeOption === "small") {
                focusNoun(activeNoun && activeNoun - 20);
            }
            if (activeSizeOption === "medium") {
                focusNoun(activeNoun && activeNoun - 10);
            }
            if (activeSizeOption === "large") {
                focusNoun(activeNoun && activeNoun - 7);
            }
        }
        if (keyboardDown) {
            if (activeSizeOption === "small") {
                focusNoun(activeNoun && activeNoun + 20);
            }
            if (activeSizeOption === "medium") {
                focusNoun(activeNoun && activeNoun + 10);
            }
            if (activeSizeOption === "large") {
                focusNoun(activeNoun && activeNoun + 7);
            }
        }
    }, [keyboardPrev, keyboardNext, keyboardUp, keyboardDown, activeNoun, activeSizeOption]);

    const buttonsRef = useRef<(HTMLButtonElement | null)[]>([])
    const focusNoun = (index: number | undefined) => {
        index && buttonsRef.current[index]?.focus()
    };

    return (
        <div className={classes.contentWrap}>
            {/* Todo: move wrapper into parent component */}
            <div className={cx(classes.gridWrap, isSidebarVisible && classes.sidebarVisible)}>
                <div className={classes.nav}>
                    {sizeOptions.map((option, i) => {
                        return (
                            <button 
                            style={{
                                border: activeSizeOption === option ? '2px solid green' : 'none'
                            }}
                            key={option} onClick={() => setSizeOption(option)}>
                                {option}
                            </button>
                        )
                    })}
                </div>
                <div 
                    className={cx(classes.exploreGrid, isFullView && classes.fullViewGrid, classes[activeSizeOption])}
                >
                    <ul>
                        {[...Array(nounCount)].map((x, i) =>
                            <li 
                                style={{ 
                                    "--animation-order": i, 
                                    borderColor: i === activeNoun ? "green" : "transparent",
                                } as React.CSSProperties
                                }
                                key={i}
                            >
                                <button 
                                    ref={el => buttonsRef.current[i] = el} 
                                    onFocus={() => handleNounDetail(i, i === activeNoun ? 'close' : 'visible')}
                                    onClick={event => focusNoun(i)}
                                    >
                                    <StandaloneNounImage nounId={BigNumber.from(i)} />
                                </button>
                            </li>
                        )}
                    </ul>
                </div>
                </div>
            {isSidebarVisible && <ExploreNounDetail handleNounDetail={handleNounDetail} nounId={activeNoun}/>}
        </div>
    );
};

export default ExploreGrid;
