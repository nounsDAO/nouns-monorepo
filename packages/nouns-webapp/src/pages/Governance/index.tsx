import { Col, Row, Card } from 'react-bootstrap';
import Section from '../../layout/Section';
import classes from './Governance.module.css';
import clsx from 'clsx';
import { Trans } from '@lingui/macro';
import { i18n } from '@lingui/core';
import Link from '../../components/Link';
import snapshotImage from '../../assets/snapshot.jpeg';
import { useNftCall } from '../../wrappers/atxDaoNft/atxDaoNft';
import NumberGatedComponent from '../../components/NumberGatedComponent';
import { IS_MAINNET } from '../../config';
import { switchNetworkToLocalhost, switchNetworkToEthereum } from '../utils/NetworkSwitcher';
import { useAppSelector } from '../../hooks';


const GovernancePage = () => {
  const activeAccount = useAppSelector(state => state.account.activeAccount);

  if (!IS_MAINNET) {
    switchNetworkToLocalhost();
  }
  else {
    switchNetworkToEthereum();
  }

  let result = useNftCall('balanceOf', [activeAccount]);
  if (result === undefined)
    (result as any) = 0;
  else
    (result as any) = result[0].toNumber();

  const forumLink = (
    <Link
      text="the forum"
      url="https://atxdao.freeflarum.com/"
      leavesPage={true}
    />
  );

  return (
    <NumberGatedComponent number={result}>
      <Section fullWidth={false} className={classes.section}>
        <Col lg={10} className={classes.wrapper}>
          <Row className={classes.headerRow}>
            <span>
              <Trans>Governance</Trans>
            </span>
            <h1>
              <Trans>ATX DAO Proposals</Trans>
            </h1>
          </Row>
          <p className={classes.subheading}>
            Proposals are how we coordinate and accomplish our goals as an organization.
            All initiatives within the DAO which involve the use of treasury funds or leveraging the ATX DAO
            brand must be publicly proposed and voted on.
          </p>
          <p className={classes.subheading}>
            Any DAO member can submit a proposal. It is recommended that members use {forumLink} to
            gather feedback on their proposal before putting it to a vote.
          </p>
          <Card
          className={classes.card}
          onClick={(e) => {
            e.preventDefault();
            window.location.href='https://snapshot.org/#/atxdao.eth';
          }}  style={{ cursor: "pointer", padding: '1rem', paddingLeft: '2rem', marginBottom: '1rem'}}>
            <Row>
              <Col style={{padding: '40px'}}>
                <b>Snapshot Proposals</b>
              </Col>
              <Col style={{padding: '10px', marginRight: '3rem'}}>
                <img
                style={{ width: '5rem', float: 'right'}}
                src={snapshotImage}></img>
              </Col>
            </Row>
          </Card>
        </Col>
      </Section>
    </NumberGatedComponent>

  );
};
export default GovernancePage;
