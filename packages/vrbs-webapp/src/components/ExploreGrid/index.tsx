import React, { useState, useEffect } from 'react';
import classes from './ExploreGrid.module.css';
import cx from 'classnames';
import ExploreGridItem from './ExploreGridItem';
import Placeholder from 'react-bootstrap/esm/Placeholder';

interface ExploreGridProps {
  vrbCount: number;
  activeVrb: number;
  selectedVrb: number | undefined;
  setActiveVrb: Function;
  setSelectedVrb: Function;
  setVrbsList: Function;
  handleFocusVrb: Function;
  isVrbHoverDisabled: boolean;
  vrbsList: Vrb[];
  sortOrder: string;
  buttonsRef: React.MutableRefObject<(HTMLButtonElement | null)[]>;
}

// vrb.pics object
type VrbPic = {
  id: number | null;
  svg: string | undefined;
};

type Vrb = {
  id: number | null;
  imgSrc: string | undefined;
};

const ExploreGrid: React.FC<ExploreGridProps> = props => {
  const [individualVrbs, setIndividualVrbs] = useState<Vrb[]>([]);
  const placeholderVrb: Vrb = { id: null, imgSrc: undefined };

  // Handle events
  const getInitialVrbs = (individualCount: number) => {
    // Fetch initial vrbs by url
    const vrbs = new Array(individualCount)
      .fill(placeholderVrb)
      .map((x, i): Vrb => {
        return {
          id: i + (props.vrbCount - individualCount),
          imgSrc: `https://vrb.pics/${i + (props.vrbCount - individualCount)}.svg`,
        };
      })
      .reverse();

    setIndividualVrbs(vrbs);
    // After initial vrbs are set, run range calls
    rangeCalls(props.vrbCount, vrbs);

    // Add initial vrbs to end of placeholder array to display them first on load
    props.setVrbsList((arr: Vrb[]) => [...vrbs, ...arr]);
  };

  // Range calls
  const initialChunkSize = 10;
  const rangeChunkSize = 100;
  const rangeCalls = async (vrbCount: number, individualVrbs: Vrb[]) => {
    if (vrbCount >= 0) {
      for (let i = vrbCount - individualVrbs.length; i >= 0; i -= rangeChunkSize) {
        const start = i - rangeChunkSize < 0 ? 0 : i - rangeChunkSize;
        const end = i - 1;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const vrbsRange = await fetchVrbs(start, end);
      }
    }
  };

  const fetchVrbs = async (start: number, end: number) => {
    const url = `https://vrb.pics/range?start=${start}&end=${end}`;
    try {
      const response = await fetch(url);
      const json = await response.json();
      // Convert vrb.pic svg key to generic imgSrc key
      const rangeVrbs: Vrb[] = json.reverse().map((vrb: VrbPic, i: number) => {
        return {
          id: vrb.id,
          imgSrc: vrb.svg,
        };
      });

      props.setVrbsList((arr: Vrb[]) => {
        let sliced = arr.slice(0, props.vrbCount - 1 - end).concat(rangeVrbs);
        // if list is only individual vrbs + placeholders
        // keep individual vrbs, clear others and replace with ranges
        if (arr[individualVrbs.length + 1].id === null) {
          sliced = arr.slice(0, individualVrbs.length).concat(rangeVrbs);
        }
        return sliced;
      });

      return rangeVrbs;
    } catch (error) {
      console.log('error fetching vrbs', error);
    }
  };

  // Once vrbCount is known, run dependent functions
  useEffect(() => {
    const placeholderVrbsData = new Array(rangeChunkSize)
      .fill(placeholderVrb)
      .map((x, i): Vrb => {
        return {
          id: null,
          imgSrc: undefined,
        };
      });
    props.setVrbsList(placeholderVrbsData);

    if (props.vrbCount >= 0) {
      getInitialVrbs((props.vrbCount % initialChunkSize) + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.vrbCount]);

  return (
    <div
      className={cx(
        classes.exploreGrid,
        ((props.selectedVrb !== undefined && props.selectedVrb < 0) ||
          props.selectedVrb === undefined) &&
          props.vrbCount >= 0 &&
          classes.sidebarHidden,
      )}
    >
      <ul>
        {(props.sortOrder === 'date-ascending'
          ? [...props.vrbsList].reverse()
          : props.vrbsList
        ).map((vrb, i) => {
          return (
            <li className={vrb.id === props.selectedVrb ? classes.activeVrb : ''} key={i}>
              <button
                ref={el => (props.buttonsRef.current[vrb.id ? vrb.id : -1] = el)}
                key={`${i}${vrb.id}`}
                onClick={e => vrb.id !== null && props.handleFocusVrb(vrb.id)}
                onFocus={e => vrb.id !== null && props.handleFocusVrb(vrb.id)}
                onMouseOver={() =>
                  !props.isVrbHoverDisabled && vrb.id !== null && props.setActiveVrb(vrb.id)
                }
                onMouseOut={() =>
                  props.selectedVrb !== undefined && props.setActiveVrb(props.selectedVrb)
                }
              >
                <ExploreGridItem vrbId={vrb.id} imgSrc={vrb.imgSrc} />
                <p className={classes.vrbIdOverlay}>
                  {vrb.id != null ? vrb.id : <Placeholder xs={12} animation="glow" />}
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
