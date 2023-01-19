import React, { useState, useEffect } from 'react';
import classes from './ExploreGrid.module.css';
import cx from 'classnames';
import ExploreGridItem from './ExploreGridItem';
import Placeholder from 'react-bootstrap/esm/Placeholder';

interface ExploreGridProps {
  n00unCount: number;
  activeN00un: number;
  selectedN00un: number | undefined;
  setActiveN00un: Function;
  setSelectedN00un: Function;
  setN00unsList: Function;
  handleFocusN00un: Function;
  isN00unHoverDisabled: boolean;
  n00unsList: N00un[];
  sortOrder: string;
  buttonsRef: React.MutableRefObject<(HTMLButtonElement | null)[]>;
}

// n00un.pics object
type N00unPic = {
  id: number | null;
  svg: string | undefined;
};

type N00un = {
  id: number | null;
  imgSrc: string | undefined;
};

const ExploreGrid: React.FC<ExploreGridProps> = props => {
  const [individualN00uns, setIndividualN00uns] = useState<N00un[]>([]);
  const placeholderN00un: N00un = { id: null, imgSrc: undefined };

  // Handle events
  const getInitialN00uns = (individualCount: number) => {
    // Fetch initial n00uns by url
    const n00uns = new Array(individualCount)
      .fill(placeholderN00un)
      .map((x, i): N00un => {
        return {
          id: i + (props.n00unCount - individualCount),
          imgSrc: `https://n00un.pics/${i + (props.n00unCount - individualCount)}.svg`,
        };
      })
      .reverse();

    setIndividualN00uns(n00uns);
    // After initial n00uns are set, run range calls
    rangeCalls(props.n00unCount, n00uns);

    // Add initial n00uns to end of placeholder array to display them first on load
    props.setN00unsList((arr: N00un[]) => [...n00uns, ...arr]);
  };

  // Range calls
  const initialChunkSize = 10;
  const rangeChunkSize = 100;
  const rangeCalls = async (n00unCount: number, individualN00uns: N00un[]) => {
    if (n00unCount >= 0) {
      for (let i = n00unCount - individualN00uns.length; i >= 0; i -= rangeChunkSize) {
        const start = i - rangeChunkSize < 0 ? 0 : i - rangeChunkSize;
        const end = i - 1;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const n00unsRange = await fetchN00uns(start, end);
      }
    }
  };

  const fetchN00uns = async (start: number, end: number) => {
    const url = `https://n00un.pics/range?start=${start}&end=${end}`;
    try {
      const response = await fetch(url);
      const json = await response.json();
      // Convert n00un.pic svg key to generic imgSrc key
      const rangeN00uns: N00un[] = json.reverse().map((n00un: N00unPic, i: number) => {
        return {
          id: n00un.id,
          imgSrc: n00un.svg,
        };
      });

      props.setN00unsList((arr: N00un[]) => {
        let sliced = arr.slice(0, props.n00unCount - 1 - end).concat(rangeN00uns);
        // if list is only individual n00uns + placeholders
        // keep individual n00uns, clear others and replace with ranges
        if (arr[individualN00uns.length + 1].id === null) {
          sliced = arr.slice(0, individualN00uns.length).concat(rangeN00uns);
        }
        return sliced;
      });

      return rangeN00uns;
    } catch (error) {
      console.log('error fetching n00uns', error);
    }
  };

  // Once n00unCount is known, run dependent functions
  useEffect(() => {
    const placeholderN00unsData = new Array(rangeChunkSize)
      .fill(placeholderN00un)
      .map((x, i): N00un => {
        return {
          id: null,
          imgSrc: undefined,
        };
      });
    props.setN00unsList(placeholderN00unsData);

    if (props.n00unCount >= 0) {
      getInitialN00uns((props.n00unCount % initialChunkSize) + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.n00unCount]);

  return (
    <div
      className={cx(
        classes.exploreGrid,
        ((props.selectedN00un !== undefined && props.selectedN00un < 0) ||
          props.selectedN00un === undefined) &&
          props.n00unCount >= 0 &&
          classes.sidebarHidden,
      )}
    >
      <ul>
        {(props.sortOrder === 'date-ascending'
          ? [...props.n00unsList].reverse()
          : props.n00unsList
        ).map((n00un, i) => {
          return (
            <li className={n00un.id === props.selectedN00un ? classes.activeN00un : ''} key={i}>
              <button
                ref={el => (props.buttonsRef.current[n00un.id ? n00un.id : -1] = el)}
                key={`${i}${n00un.id}`}
                onClick={e => n00un.id !== null && props.handleFocusN00un(n00un.id)}
                onFocus={e => n00un.id !== null && props.handleFocusN00un(n00un.id)}
                onMouseOver={() =>
                  !props.isN00unHoverDisabled && n00un.id !== null && props.setActiveN00un(n00un.id)
                }
                onMouseOut={() =>
                  props.selectedN00un !== undefined && props.setActiveN00un(props.selectedN00un)
                }
              >
                <ExploreGridItem n00unId={n00un.id} imgSrc={n00un.imgSrc} />
                <p className={classes.n00unIdOverlay}>
                  {n00un.id != null ? n00un.id : <Placeholder xs={12} animation="glow" />}
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
