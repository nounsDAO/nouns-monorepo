import Section from '../../layout/Section';
import { Col } from 'react-bootstrap';
import classes from './Documentation.module.css';
import Accordion from 'react-bootstrap/Accordion';
import { Trans } from '@lingui/macro';

const Documentation = () => {
  return (
    <Section fullWidth={false}>
      {/* Overview */}
      <Col lg={{ span: 10, offset: 1 }}>
        <div className={classes.headerWrapper}>
          <h1>
            <Trans>Overview</Trans>
          </h1>
          <blockquote>
            The Boston DAO is a crypto-native community formed out of the greater Boston area. We
            are a collective of early adopters of blockchain technology, leaders, builders,
            investors, artists, musicians, and creators. Our mission is to build an innovative and
            inclusive communal foundation in Boston to accelerate the web3 movement. Our members all
            organize around the broader theme of making Boston the most desirable city for crypto
            contributors.
          </blockquote>
        </div>
      </Col>
      {/* Our Existence */}
      <Col lg={{ span: 10, offset: 1 }}>
        <div className={classes.headerWrapper}>
          <h1>
            <Trans>Our Existence</Trans>
          </h1>
          <ul>
            <li>
              <Trans>
                We believe that humans are at their best when they cooperate together in
                positive-sum activities.
              </Trans>
            </li>
            <li>
              <Trans>
                Historically we have gathered to form organizations such as countries, states,
                churches, and companies in order to govern how we work together to achieve our
                goals. We believe that Decentralized Autonomous Organizations (DAOs) enable a new
                form of human cooperation, which allows for new innovative governance models. DAOs
                help us fairly establish how decisions are made, the rules that members follow, and
                how those rules are changed over time.c. Boston is the place where Tea and Blood
                were spilled in order to liberate its members from an outdated governance system in
                pursuit of an equitable system — an ideal system — one that trusts the subjects with
                the responsibility and the authority to govern themselves. However, as time passes,
                like any structure without proper care, ideal systems rust and wither. We believe
                the time has come to innovate once again. We aim to accelerate the adoption of
                decentralized technology and governance, ultimately educating and indoctrinating
                more like-minded individuals to our community and to the{' '}
                <span className={classes.boldText}>Web3 World</span>.
              </Trans>
            </li>
            <li>
              <Trans>
                We believe that everything we are experimenting with and building here at The Boston
                DAO should serve a purpose. We seek to foster evergreen and prolific ideas that
                should withstand winter and summer cycles to come.
              </Trans>
            </li>
          </ul>
        </div>
      </Col>
      {/* Our values */}
      <Col lg={{ span: 10, offset: 1 }}>
        <div className={classes.headerWrapper}>
          <h1>Our Values</h1>
          <ol>
            <li>
              <Trans>Collaborate with Boston area policymakers and other DAOs</Trans>
            </li>
            <li>
              <Trans>Host events that grow and support the Boston Web3 community</Trans>
            </li>
            <li>
              <Trans>Contribute to and support non-profits</Trans>
            </li>
            <li>
              <Trans>Secure communal assets (fungible or non-fungible)</Trans>
            </li>
            <li>
              <Trans>Invest in Boston area Web3 community and projects</Trans>
            </li>
            <li>
              <Trans>
                Incubate and support game-changing ideas; No matter our direction, the community
                will embody the following values, ranked in their respective order, for when
                conflict occurs:
              </Trans>
            </li>{' '}
          </ol>
          <Accordion flush>
            <Accordion.Item eventKey="a" className={classes.accordionItem}>
              <Accordion.Header className={classes.accordionHeader}>
                <Trans>By the community, for the community</Trans>
              </Accordion.Header>
              <Accordion.Body>
                <Trans>
                  We always want to further our mission; we want to build an ever-expanding and
                  inclusive community in Boston. Our community will leverage network effects to
                  increasingly provide more benefits to our members by sharing resources,
                  connections, and ideas. We aim to make The Boston DAO and our city, Boston, a
                  welcoming and bountiful epicenter for the coming of the new internet.
                </Trans>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="b" className={classes.accordionItem}>
              <Accordion.Header className={classes.accordionHeader}>
                <Trans>Innovative, positive, and exceptional</Trans>
              </Accordion.Header>
              <Accordion.Body>
                <Trans>
                  Do things that are new, positive-sum, and disruptive so that people who learn
                  about us can leverage and improve our framework — this is how we grow. We stand
                  for Boston and Boston stands for trailblazing, pioneering revolutionists. This
                  Manifesto is no exception; it should evolve with the DAO.
                </Trans>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="c" className={classes.accordionItem}>
              <Accordion.Header className={classes.accordionHeader}>
                <Trans>Open, transparent, and adaptable</Trans>
              </Accordion.Header>
              <Accordion.Body>
                <Trans>
                  We believe that the future of governance involves operating publicly and
                  deliberately. Rather than assuming an uneducated majority, we seek to educate the
                  majority.
                </Trans>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="d" className={classes.accordionItem}>
              <Accordion.Header className={classes.accordionHeader}>
                <Trans>Inclusive and diverse</Trans>
              </Accordion.Header>
              <Accordion.Body>
                <Trans>
                  The Boston DAO is holistically meritocratic — understanding that every decision is
                  not black and white, but also pushing to innovate and govern in a truly digital
                  world.
                </Trans>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
      </Col>
      {/* Our focus */}
      <Col lg={{ span: 10, offset: 1 }}>
        <div className={classes.headerWrapper}>
          <h1>
            <Trans>Our Focus</Trans>
          </h1>
          <p className={classes.aboutText} style={{ paddingBottom: '4rem' }}>
            <Trans>
              All great organizations effectively leverage their values into meaningful actions. As
              an  organization, we initially seek to impact the world in three areas:
            </Trans>
          </p>
        </div>
        <Accordion flush>
          <Accordion.Item eventKey="99" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              <Trans>Policy & Philanthropy</Trans>
            </Accordion.Header>
            <Accordion.Body>
              <p>
                <Trans>
                  As members of one of the most influential states in the United States, we
                  advocate, advise and support any policy that is beneficial for both the crypto
                  industry and the  broader governing body.   ii. As benefactors of a hyperbolic
                  asset class, we seek to direct resources towards less hyperbolic asset classes,
                  namely the non-profit industry. As a DAO, we aim to  develop a roadmap for
                  compliant and effective benevolence.{' '}
                </Trans>
              </p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              <Trans>Conferences & Gatherings</Trans>
            </Accordion.Header>
            <Accordion.Body>
              <ol>
                <li>
                  <Trans>
                    Boston’s largest export is knowledge. As an organization, we strive to bolster
                    this great city by directing human and financial resources toward educating
                    policymakers, students, and individuals like ourselves that are constantly
                    seeking to learn more.
                  </Trans>
                </li>
                <li>
                  <Trans>
                    We believe that conferences are positive-sum for the Boston ecosystem,
                    optimizing network effects and education globally.{' '}
                  </Trans>
                </li>
                <li>
                  <Trans>
                    We want to bring the most desirable crypto conferences back to Boston.{' '}
                  </Trans>
                </li>
              </ol>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              <Trans>Partnering, Mentoring & Funding</Trans>
            </Accordion.Header>
            <Accordion.Body>
              <ol>
                <li>
                  <Trans>
                    The Boston network is rich and deep. We believe that we can leverage this to
                    make Boston and the world an extension a better place to live.
                  </Trans>
                </li>
                <li>
                  <Trans>
                    We welcome any crypto-entrepreneur or crypto-investor to join and contribute to
                    our network.
                  </Trans>
                </li>
                <li>
                  <Trans>
                    We strive to direct resources (financial and non-financial) towards individuals,
                    companies, or networks advancing and embodying our ideals.
                  </Trans>
                </li>
              </ol>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Col>
      {/* Our objectives */}
      <Col lg={{ span: 10, offset: 1 }}>
        <div className={classes.headerWrapper}>
          <h1>
            <Trans>Our Objectives</Trans>
          </h1>
          <p className={classes.aboutText} style={{ paddingBottom: '4rem' }}>
            <Trans>
              Boston is not just a city, it is a mindset. Anyone anywhere can be a Bostonian. As a
              community, we embrace the duality of nature: an idyllic optimism in summer held in
              tandem with a stoic persevering temperament through winter, but with constant progress
              forward. This mentality begets achievement and, as Bostonians in mindset, we intend to
              sustain this tradition of achievement. Our objectives are simple:{' '}
            </Trans>
          </p>
        </div>
        {/*  */}
        <Accordion flush>
          <Accordion.Item eventKey="0" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              <Trans>Policy & Philanthropy</Trans>
            </Accordion.Header>
            <Accordion.Body>
              <ol>
                <li>
                  <Trans>
                    Help policy and academic leadership see the full potential of Web3/Crypto, and
                    help them develop policy that is supportive of the adoption of Web3/Crypto and
                    the community.
                  </Trans>
                </li>
                <li>
                  <Trans>
                    Support the non-profit community to be successful in achieving their missions to
                    the overall betterment of the Boston area community.
                  </Trans>
                </li>
              </ol>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="1" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              <Trans>Conferences & Gatherings</Trans>
            </Accordion.Header>
            <Accordion.Body>
              <ol>
                <li>
                  <Trans>
                    Help Boston regain its status as one of the hubs of Web3/Crypto in the US and
                    world.
                  </Trans>
                </li>
                <li>
                  <Trans>
                    Create events and conferences that bring the best Web3/Crypto, academic, and
                    policymakers' minds together to advance the development and support of
                    Web3/Crypto principles and projects for the overall improvement of the community
                    and society as a whole.
                  </Trans>
                </li>
              </ol>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Col>
    </Section>
  );
};
export default Documentation;
