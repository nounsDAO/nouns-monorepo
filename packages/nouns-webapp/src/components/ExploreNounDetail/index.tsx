import React, { ReactNode } from 'react';
import { useNounSeed } from '../../wrappers/nounToken';
import { BigNumber } from 'ethers';
import { StandaloneNounImage } from '../../components/StandaloneNoun';
import { StandalonePart } from '../StandalonePart';
import classes from './ExploreNounDetail.module.css';
import { ImageData } from '@nouns/assets';
import { Trans } from '@lingui/macro';
interface ExploreNounDetailProps {
    nounId: number | undefined;
    handleNounDetail: Function;
}

const ExploreNounDetail: React.FC<ExploreNounDetailProps> = props => {
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

    const traitTypeKeys = (s: string) => {
        const traitMap = new Map([
          ['background', 'backgrounds'],
          ['body', 'bodies'],
          ['accessory', 'accessories'],
          ['head', 'heads'],
          ['glasses', 'glasses'],
        ]);
        const result = traitMap.get(s);
        if (result) {
            return result;
        } else {
            throw new Error(`Trait key for ${s} not found`);
        }
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
        <div className={classes.detailWrap}>
            <div className={classes.sidebar}>
                <button onClick={() => props.handleNounDetail('close')}>close</button>
                <StandaloneNounImage nounId={BigNumber.from(props.nounId)} />
                <h2>Noun: {props.nounId}</h2>
                <ul>
                    {Object.values(seed).map((val,index) => {    
                        const traitType = traitTypeKeys(traitKeys[index]);
                        if (traitType === "backgrounds") {
                            return (
                                <li>
                                    {traitKeyToLocalizedTraitKeyFirstLetterCapitalized(traitKeys[index])}: {traitValues[index]}
                                </li>
                            )
                        } else {
                            return (
                                <li>
                                    <StandalonePart partType={traitType} partIndex={val} />
                                    {traitKeyToLocalizedTraitKeyFirstLetterCapitalized(traitKeys[index])}: {traitValues[index]}
                                </li>
                            )
                        }
                    })}
                </ul>
            </div>
        </div>
    )
}


export default ExploreNounDetail;
