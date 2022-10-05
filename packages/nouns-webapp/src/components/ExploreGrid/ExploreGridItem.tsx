import React, { ReactNode, useEffect, useState } from 'react';
import { Placeholder } from 'react-bootstrap';
import classes from './ExploreGrid.module.css';
interface ExploreGridItemProps {
    nounId?: number;
    selectedNoun: number | undefined;
    imgSrc?: string;
    // // nounCount: number;
    handleOnFocus: Function;
    // removeFocus: Function;
    setActiveNoun: Function;
    // sortOrder: string;
    isKeyboardNavigating: boolean;
    // isNounsDataLoaded: boolean;
}
const ExploreGridItem: React.FC<ExploreGridItemProps> = props => {
    const nounId = (props.nounId !== undefined && props.nounId > -1 ? props.nounId : undefined);
    const imgSrc = props.imgSrc ? props.imgSrc : (props.nounId && props.nounId >= 0 ? `https://noun.pics/${nounId}.svg` : undefined);
    
    return (
        <li 
            className={nounId === props.selectedNoun ? classes.activeNoun : ''} 
            key={nounId}
        >
            <button 
                // ref={el => props.buttonsRef.current[nounId] = el} 
                id={`${nounId} - ${props.nounId}`}
                onMouseDown={(e) => (props.selectedNoun === nounId && document.activeElement && parseInt(document.activeElement.id) === nounId) && props.handleOnFocus(nounId)}
                onFocus={(e) => props.handleOnFocus(nounId)}
                onMouseOver={() => !props.isKeyboardNavigating && props.setActiveNoun(nounId)} 
                onMouseOut={() => props.selectedNoun && props.setActiveNoun(props.selectedNoun)}
                >
                    {imgSrc ? (
                        <img 
                            src={imgSrc}
                            alt={`Noun ${nounId}`}
                        />
                    ) : (
                        <Placeholder xs={12} animation="glow" />
                    )}
                
                <p className={classes.nounIdOverlay}>
                    {nounId}
                </p>
                {/* <StandaloneNounImage nounId={BigNumber.from(i)} /> */}
            </button>
        </li>
    )
}


export default ExploreGridItem;
