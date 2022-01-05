import { Container, Col, Row } from 'react-bootstrap';
import classes from './VotePageHeader.module.css';


const HeaderMain = () => {

    return (
        <Container className={classes.headerRow}>
            <Col lg={7}>
                <span>Proposal 17</span>
                <h1>
                    Fund an Engineer, Community manager, and Designer for Nouns
                </h1>
            </Col>
            <Col lg={4}>
                other stuff
            </Col>
        </Container>
    );
};

const VotePageHeader = () => {

    const backButtonClickHandler = () => {
        // eslint-disable-next-line no-restricted-globals
        location.href = "/vote"
    }

    return (
        <div style={{display: 'flex', flexDirection: 'row'}}>
            <button
                className={classes.leftArrowCool}
                onClick={backButtonClickHandler}
            >
            ←
            </button>
            <HeaderMain />
        </div>
    );
};

export default VotePageHeader;