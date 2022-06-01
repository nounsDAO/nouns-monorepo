import { StandaloneNounCircular } from '../StandaloneNoun';
import classes from './StackedCircleNouns.module.css';
import {BigNumber} from "ethers";

interface StackedCircleNounsProps {
    nounIds: Array<number>;
    tightStack?: boolean;
}

const StackedCircleNouns: React.FC<StackedCircleNounsProps> = props => {

    const {nounIds, tightStack } = props;

    return (
        <div
            className={classes.wrapper}
        >
            {
                nounIds.slice(0, tightStack ? 3 : 10).map((nounId: number, i: number) => {
                    return (
                        <div 
                        style={{
                            top:  tightStack ? `${3*i}px` : '0px',
                            left: tightStack ? `${-2*i}px`: `${-25*i}px`
                        }}
                        className={classes.nounWrapper}>
                            <StandaloneNounCircular nounId={BigNumber.from(nounId)} border={true}/>
                        </div>
                    );
                })
            }
        </div>
    );
}

export default StackedCircleNouns;