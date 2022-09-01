import React, { useState, useEffect } from 'react';
import { BigNumber } from 'ethers';
import { StandaloneNounImage } from '../../components/StandaloneNoun';
import classes from './ExploreGrid.module.css';
import cx from 'classnames';
import ExploreNounDetail from '../ExploreNounDetail';
// import {AnimatePresence, motion} from 'framer-motion/dist/framer-motion';

interface ExploreGridProps {
}

// Custom hook
function useKeyPress(targetKey: string): boolean {
    console.log("useKeyPress");
    // State for keeping track of whether key is pressed
    const [keyPressed, setKeyPressed] = useState(false);
    // If pressed key is our target key then set to true
    function downHandler({ key }: KeyboardEvent): void {
      if (key === targetKey) {
        setKeyPressed(true);
      }
    }
    // If released key is our target key then set to false
    const upHandler = ({ key }: KeyboardEvent): void => {
      if (key === targetKey) {
        setKeyPressed(false);
      }
    };
    // Add event listeners
    useEffect(() => {
      window.addEventListener("keydown", downHandler);
      window.addEventListener("keyup", upHandler);
      // Remove event listeners on cleanup
      return () => {
        window.removeEventListener("keydown", downHandler);
        window.removeEventListener("keyup", upHandler);
      };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty array ensures that effect is only run on mount and unmount
    return keyPressed;
}

const ExploreGrid: React.FC<ExploreGridProps> = props => {
    const nounCount = 429;
    // const gridOptions = [2.5, 5, 12.5];
    const [isFullView] = useState<boolean>(false);
    const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(false);
    const [sizeOption, setSizeOption] = useState<string>("large");
    const sizeOptions = ["small", "medium", "large"];

    const [activeNoun, setActiveNoun] = useState<number | undefined>();
    
    const handleNounDetail = (nounId: number, sidebarVisibility: string) => {
        nounId > -1 && nounId < nounCount && setActiveNoun(nounId);
        sidebarVisibility === "visible" ? setIsSidebarVisible(true) : setIsSidebarVisible(false);
        sidebarVisibility !== "visible" && setActiveNoun(undefined);
    }

    const keyboardPrev: boolean = useKeyPress("ArrowLeft");
    const keyboardNext: boolean = useKeyPress("ArrowRight");

    const handleKeyboardNavigation = (key: string, activeNoun: number | undefined) => {
        key === 'keyboardPrev' && setActiveNoun(activeNoun && activeNoun - 1);
        key === 'keyboardNext' && setActiveNoun(activeNoun && activeNoun + 1);

    }
    
    useEffect(() => {
        keyboardPrev && handleKeyboardNavigation('keyboardPrev', activeNoun);
    }, [activeNoun, keyboardPrev])
    useEffect(() => {
        keyboardNext && handleKeyboardNavigation('keyboardNext', activeNoun);
    }, [activeNoun, keyboardNext])
    
    return (
        <div className={classes.contentWrap}>
            {/* Todo: move wrapper into parent component */}
            <div className={cx(classes.gridWrap, isSidebarVisible && classes.sidebarVisible)}>
                <div className={classes.nav}>
                    {sizeOptions.map((option, i) => {
                        return (
                            <button key={option} onClick={() => setSizeOption(option)}>
                                {option}
                            </button>
                        )
                    })}
                </div>
                <div 
                    className={cx(classes.exploreGrid, isFullView && classes.fullViewGrid, classes[sizeOption])}
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
                                <button onClick={() => handleNounDetail(i, i === activeNoun ? 'close' : 'visible')}>
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
