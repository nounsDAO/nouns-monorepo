import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tuple } from 'ramda';
import { Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import {
  capitalizeFirstLetter,
  parseTraitName,
  traitNames,
  traitTitles,
} from '../../../pages/Playground';
import { INounSeed } from '../../../wrappers/nounToken';
import classes from './NounSeed.module.css';

interface NounSeedProps {
  seed: INounSeed;
  traitRarity: Map<string, Tuple<number, number>>;
}

const NounSeed = (props: NounSeedProps) => {
  return (
    <>
      {Object.entries(props.seed)
        .map((entry: [string, number]) => {
          if (traitTitles.indexOf(entry[0]) < 0) return null;
          return (
            <Col className={classes.seedDataText}>
              <OverlayTrigger
                trigger={['focus', 'hover']}
                placement="top"
                overlay={
                  <Tooltip>
                    <i>
                      Trait Rarity: {(props.traitRarity.get(entry[0])![1] * 100).toFixed(2)}%,{' '}
                      {props.traitRarity.get(entry[0])![0]} total{' '}
                    </i>
                  </Tooltip>
                }
              >
                <span {...props}>
                  <span className={classes.boldText}>{capitalizeFirstLetter(entry[0])}: </span>
                  {parseTraitName(traitNames[traitTitles.indexOf(entry[0])][entry[1]])}{' '}
                  {props.traitRarity.get(entry[0])![0] === 1 ? (
                    <FontAwesomeIcon icon={faStar} />
                  ) : (
                    ''
                  )}
                </span>
              </OverlayTrigger>
            </Col>
          );
        })
        .filter(a => !!a)}
    </>
  );
};

export default NounSeed;
