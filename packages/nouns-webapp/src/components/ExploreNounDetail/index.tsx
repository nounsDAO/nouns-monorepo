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

    const nounTraitsOrdered = [
        { 
            partType: 'head',
            partName: parseTraitName(traitNames[3][seed.head]),
            partIndex: seed.head,
        },
        { 
            partType: 'glasses',
            partName: parseTraitName(traitNames[4][seed.glasses]),
            partIndex: seed.glasses,
        },
        { 
            partType: 'accessory',
            partName: parseTraitName(traitNames[2][seed.accessory]),
            partIndex: seed.accessory,
        },
        { 
            partType: 'body',
            partName: parseTraitName(traitNames[1][seed.body]),
            partIndex: seed.body,
        },
        { 
            partType: 'background',
            partName: parseTraitName(traitNames[0][seed.background]),
            partIndex: seed.background,
        },   
    ]

    const bgcolors = ["#d5d7e1", "#e1d7d5"];
    const backgroundColor = bgcolors[seed.background];
    console.log(backgroundColor);

    return (
        <div className={classes.detailWrap}>
            <div className={classes.sidebar}>
                <button onClick={() => props.handleNounDetail('close')}>close</button>
                <StandaloneNounImage nounId={BigNumber.from(props.nounId)} />
                <h2>Noun: {props.nounId}</h2>
                <ul className={classes.traitsList}>
                    {Object.values(nounTraitsOrdered).map((part,index) => {    
                        const partType = traitTypeKeys(nounTraitsOrdered[index].partType);
                        return (
                            <li>
                                <div 
                                    className={classes.thumbnail}
                                    style={{
                                        backgroundColor: backgroundColor ? backgroundColor : 'transparent',
                                    }}
                                >
                                    <StandalonePart partType={partType} partIndex={part.partIndex} />
                                </div>
                                <div className={classes.description}>
                                    <p className='small'><span>{traitKeyToLocalizedTraitKeyFirstLetterCapitalized(nounTraitsOrdered[index].partType)}</span></p>
                                    <p><strong>{nounTraitsOrdered[index].partName}</strong></p>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}


export default ExploreNounDetail;
