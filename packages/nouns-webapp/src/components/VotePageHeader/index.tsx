import { Container, Col, Button } from 'react-bootstrap';
import { useAppSelector } from '../../hooks';
import { ProposalState } from '../../wrappers/nounsDao';
import ProposalStatus from '../ProposalStatus';
import classes from './VotePageHeader.module.css';


const HeaderMain = () => {

    return (
            <div className={classes.headerRow} style={{maxWidth: '40%'}}>
                <span>Proposal 17</span>
                <h1>
                    Fund an Engineer, Community manager, and Designer for Nouns
                </h1>
            </div>
    );
};

const VotePageHeader = () => {
    const activeAccount = useAppSelector(state => state.account.activeAccount);

    const backButtonClickHandler = () => {
        // eslint-disable-next-line no-restricted-globals
        location.href = "/vote"
    }

    return (
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
            <div style={{margin: '4.5rem 0'}}>
                <button
                    className={classes.leftArrowCool}
                    onClick={backButtonClickHandler}
                >
                ←
                </button>
            </div>
            <HeaderMain />
            <div style={{margin: '4.5rem 0', paddingTop: '1rem'}}>
                <ProposalStatus status={ProposalState.ACTIVE}/>
            </div>
            <div style={{margin: '4.5rem 0'}}>
                 {activeAccount === undefined ? <p>Connect wallet to vote.</p> : <></>}
            </div>
            <div style={{margin: '4.5rem 0'}}>
            <Button
              onClick={() => {
                  console.log("hello")
              }}
              className={ activeAccount === undefined ? classes.generateBtnDisabled : classes.generateBtn}
            >
                Submit vote
            </Button>
            </div>
        </div>
    );
};

export default VotePageHeader;