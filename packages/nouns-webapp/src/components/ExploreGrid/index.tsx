import React, { ReactNode, useState, useRef, useEffect } from 'react';
import { useReverseENSLookUp } from '../../utils/ensLookup';
import { containsBlockedText } from '../../utils/moderation/containsBlockedText';
import { useNounSeed } from '../../wrappers/nounToken';
import { BigNumber } from 'ethers';
import { StandaloneNounImage } from '../../components/StandaloneNoun';
import { getNoun } from '../../components/StandaloneNoun';
import classes from './ExploreGrid.module.css';
import Image from 'react-bootstrap/Image';
import cx from 'classnames';
import { ImageData } from '@nouns/assets';
import { Trans } from '@lingui/macro';
import ExploreNounDetail from '../ExploreNounDetail';

// import {AnimatePresence, motion} from 'framer-motion/dist/framer-motion';

interface ExploreGridProps {
//   address: string;
}

interface ExploreSidebarProps {
    nounId: number | undefined;
}

interface Trait {
    title: string;
    traitNames: string[];
}


const ExploreSidebar: React.FC<ExploreSidebarProps> = props => {
    // Modified from playground function to remove dashes in filenames
    const parseTraitName = (partName: string): string =>
        capitalizeFirstLetter(partName.substring(partName.indexOf('-') + 1).replace(/-/g, ' '));
    const capitalizeFirstLetter = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

    const traitKeyToLocalizedTraitKeyFirstLetterCapitalized = (s: string): ReactNode => {
        const traitMap = new Map([
          ['background', <Trans>Background</Trans>],
          ['body', <Trans>Body</Trans>],
          ['accessory', <Trans>Accessory</Trans>],
          ['head', <Trans>Head</Trans>],
          ['glasses', <Trans>Glasses</Trans>],
        ]);
        return traitMap.get(s);
      };

    const traitNames = [
      ['cool', 'warm'],
      ...Object.values(ImageData.images).map(i => {
        return i.map(imageData => imageData.filename);
      }),
    ];

    const seed = useNounSeed(BigNumber.from(props.nounId));

    const nounTraits = {
        background: parseTraitName(traitNames[0][seed.background]),
        body: parseTraitName(traitNames[1][seed.body]),
        accessory: parseTraitName(traitNames[2][seed.accessory]),
        head: parseTraitName(traitNames[3][seed.head]),
        glasses: parseTraitName(traitNames[4][seed.glasses]),
    }
    const traitKeys = Object.keys(nounTraits);
    const traitValues = Object.values(nounTraits);

    
    return (
        <>
            <StandaloneNounImage nounId={BigNumber.from(props.nounId)} />
            <p>Noun: {props.nounId}</p>
            <ul>
                {Object.keys(traitValues).map((val,index) => {
                    return (
                        <li>
                            {traitKeyToLocalizedTraitKeyFirstLetterCapitalized(traitKeys[index])}: <Trans>{traitValues[index]}</Trans>
                        </li>
                    )
                })}
            </ul>
        </>
    )
}

type RectScalerResult = {
    area: number;
    cols: number;
    rows: number;
    width: number;
    height: number;
};

const findBestFit = (
    containerWidth: number,
    containerHeight: number,
    numRects: number,
  ): RectScalerResult => {
    if (containerWidth < 0 || containerHeight < 0) {
      throw new Error("Container must have a non-negative area");
    }
    if (numRects < 1 || !Number.isInteger(numRects)) {
      throw new Error("Number of shapes to place must be a positive integer");
    }
    const aspectRatio = 1;
    if (isNaN(aspectRatio)) {
      throw new Error("Aspect ratio must be a number");
    }
  
    let best = { area: 0, cols: 0, rows: 0, width: 0, height: 0 };
  
    // TODO: Don't start with obviously-bad candidates.
    const startCols = numRects;
    const colDelta = -1;
  
    // For each combination of rows + cols that can fit the number of rectangles,
    // place them and see the area.
    for (let cols = startCols; cols > 0; cols += colDelta) {
      const rows = Math.ceil(numRects / cols);
      const hScale = containerWidth / (cols * aspectRatio);
      const vScale = containerHeight / rows;
      let width: number;
      let height: number;
      // Determine which axis is the constraint.
      if (hScale <= vScale) {
        width = containerWidth / cols;
        height = width / aspectRatio;
      } else {
        height = containerHeight / rows;
        width = height * aspectRatio;
      }
      const area = width * height;
      if (area > best.area) {
        best = { area, width, height, rows, cols };
      }
    }
    return best;
  };
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
    }, []); // Empty array ensures that effect is only run on mount and unmount
    return keyPressed;
  }

const ExploreGrid: React.FC<ExploreGridProps> = props => {
    const nounCount = 427;
    const gridOptions = [2.5, 5, 12.5];
    const [isFullView, setIsFullView] = useState<boolean>(false);
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
    }, [keyboardPrev])
    useEffect(() => {
        keyboardNext && handleKeyboardNavigation('keyboardNext', activeNoun);
    }, [keyboardNext])
    
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
