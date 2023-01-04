import React, { useState, useEffect } from 'react';
import classes from './ExploreGrid.module.css';
import cx from 'classnames';
import ExploreGridItem from './ExploreGridItem';
import Placeholder from 'react-bootstrap/esm/Placeholder';

interface ExploreGridProps {
  nounCount: number;
  activeNoun: number;
  selectedNoun: number | undefined;
  setActiveNoun: Function;
  setSelectedNoun: Function;
  setNounsList: Function;
  handleFocusNoun: Function;
  isNounHoverDisabled: boolean;
  nounsList: Noun[];
  sortOrder: string;
  buttonsRef: React.MutableRefObject<(HTMLButtonElement | null)[]>;
}

// noun.pics object
type NounPic = {
  id: number | null;
  svg: string | undefined;
};

type Noun = {
  id: number | null;
  imgSrc: string | undefined;
};

const ExploreGrid: React.FC<ExploreGridProps> = props => {
  const [individualNouns, setIndividualNouns] = useState<Noun[]>([]);
  const placeholderNoun: Noun = { id: null, imgSrc: undefined };

  // Handle events
  const getInitialNouns = (individualCount: number) => {
    // Fetch initial nouns by url
    const nouns = new Array(individualCount)
      .fill(placeholderNoun)
      .map((x, i): Noun => {
        return {
          id: i + (props.nounCount - individualCount),
          imgSrc: `https://noun.pics/${i + (props.nounCount - individualCount)}.svg`,
        };
      })
      .reverse();

    setIndividualNouns(nouns);
    // After initial nouns are set, run range calls
    rangeCalls(props.nounCount, nouns);

    // Add initial nouns to end of placeholder array to display them first on load
    props.setNounsList((arr: Noun[]) => [...nouns, ...arr]);
  };

  // Range calls
  const initialChunkSize = 10;
  const rangeChunkSize = 100;
  const rangeCalls = async (nounCount: number, individualNouns: Noun[]) => {
    if (nounCount >= 0) {
      for (let i = nounCount - individualNouns.length; i >= 0; i -= rangeChunkSize) {
        const start = i - rangeChunkSize < 0 ? 0 : i - rangeChunkSize;
        const end = i - 1;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const nounsRange = await fetchNouns(start, end);
      }
    }
  };

  const fetchNouns = async (start: number, end: number) => {
    const url = `https://noun.pics/range?start=${start}&end=${end}`;
    try {
      const response = await fetch(url);
      const json = await response.json();
      // Convert noun.pic svg key to generic imgSrc key
      const rangeNouns: Noun[] = json.reverse().map((noun: NounPic, i: number) => {
        return {
          id: noun.id,
          imgSrc: noun.svg,
        };
      });

      props.setNounsList((arr: Noun[]) => {
        let sliced = arr.slice(0, props.nounCount - 1 - end).concat(rangeNouns);
        // if list is only individual nouns + placeholders
        // keep individual nouns, clear others and replace with ranges
        if (arr[individualNouns.length + 1].id === null) {
          sliced = arr.slice(0, individualNouns.length).concat(rangeNouns);
        }
        return sliced;
      });

      return rangeNouns;
    } catch (error) {
      console.log('error fetching nouns', error);
    }
  };

  // Once nounCount is known, run dependent functions
  useEffect(() => {
    const placeholderNounsData = new Array(rangeChunkSize)
      .fill(placeholderNoun)
      .map((x, i): Noun => {
        return {
          id: null,
          imgSrc: undefined,
        };
      });
    props.setNounsList(placeholderNounsData);

    if (props.nounCount >= 0) {
      getInitialNouns((props.nounCount % initialChunkSize) + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.nounCount]);

  return (
    <div
      className={cx(
        classes.exploreGrid,
        ((props.selectedNoun !== undefined && props.selectedNoun < 0) ||
          props.selectedNoun === undefined) &&
          props.nounCount >= 0 &&
          classes.sidebarHidden,
      )}
    >
      <ul>
        {(props.sortOrder === 'date-ascending'
          ? [...props.nounsList].reverse()
          : props.nounsList
        ).map((noun, i) => {
          return (
            <li className={noun.id === props.selectedNoun ? classes.activeNoun : ''} key={i}>
              <button
                ref={el => (props.buttonsRef.current[noun.id ? noun.id : -1] = el)}
                key={`${i}${noun.id}`}
                onClick={e => noun.id !== null && props.handleFocusNoun(noun.id)}
                onFocus={e => noun.id !== null && props.handleFocusNoun(noun.id)}
                onMouseOver={() =>
                  !props.isNounHoverDisabled && noun.id !== null && props.setActiveNoun(noun.id)
                }
                onMouseOut={() =>
                  props.selectedNoun !== undefined && props.setActiveNoun(props.selectedNoun)
                }
              >
                <ExploreGridItem nounId={noun.id} imgSrc={noun.imgSrc} />
                <p className={classes.nounIdOverlay}>
                  {noun.id != null ? noun.id : <Placeholder xs={12} animation="glow" />}
                </p>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ExploreGrid;
