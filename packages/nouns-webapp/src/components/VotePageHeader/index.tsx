import { Container, Col, Row } from 'react-bootstrap';
import classes from './VotePageHeader.module.css';
import { Link } from 'react-router-dom';

const VotePageHeader = () => {

    const backButtonClickHandler = () => {
        // eslint-disable-next-line no-restricted-globals
        location.href = "/vote"
    }

    return (
        <Container>
            <Col lg={1}>
                <button
            className={classes.leftArrowCool}
            onClick={backButtonClickHandler}
        >
            ←
        </button>
            </Col>
        </Container>

    );
};

export default VotePageHeader;