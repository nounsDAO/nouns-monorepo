import { BigNumber } from 'ethers';
import { useNextNoun } from '../../wrappers/nextNoun';
import Noun from '../Noun';
import classes from './NextNoun.module.css';
import Section from '../../layout/Section';
import { Col } from 'react-bootstrap';
import { useNounDescriptor } from '../../wrappers/nounDescriptor';
import clsx from 'clsx';

interface NextNounProps {}

type NounProperty = 'background' | 'body' | 'accessory' | 'head' | 'glasses';

const acceptableValues = {
  background: [],
  body: [0,10,20,30,40,50],
  accessory: [1,2,3,4,5,6,7,8,9,10],
  head: [0,10,20,30,40,50,60,70,80,90,100],
  glasses: [],
};

const matchesAcceptableValues = (propertyName: NounProperty, value: number) =>
  acceptableValues[propertyName].filter(acceptableValue => acceptableValue === value).length > 0;

const NextNoun: React.FC<NextNounProps> = (props: NextNounProps) => {
  const nextSeed = useNextNoun(BigNumber.from(0));
  const nextNoun = useNounDescriptor(BigNumber.from(0), nextSeed ? nextSeed[0] : undefined);

  return (
    <Section bgColor="white" fullWidth={false}>
      <Col lg={7}>
        <div>
          <h3>If minted in the next block, Noun #0 would be:</h3>
          <table>
            {nextSeed &&
              Object.keys(nextSeed[0])
                .filter(key => isNaN(Number(key)))
                .map((key, i) => {
                  const rowClasses = clsx(
                    matchesAcceptableValues(key as NounProperty, nextSeed[0][i]) && classes.match
                  )
                  return <tr
                    className={rowClasses}
                    key={key}
                  >
                    <td>{key}</td>
                    <td>{nextSeed[0][i]} </td>
                  </tr>
                })}
          </table>
          <p><i>blue background = matches preferred attribute</i></p>
        </div>
      </Col>
      <Col lg={5}>
        <Noun imgPath={nextNoun ? nextNoun.image : ''} alt={nextNoun ? nextNoun.description : ''} />
      </Col>
    </Section>
  );
};

export default NextNoun;
