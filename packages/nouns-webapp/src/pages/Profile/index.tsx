import { Row, Col, Container } from 'react-bootstrap';
import NounProfileCard from '../../components/NounProfileCard';
import ProfileActivityFeed from '../../components/ProfileActivityFeed';
import Section from '../../layout/Section';
import classes from './Profile.module.css';

interface ProfilePageProps {
  nounId: number;
}

const ProfilePage: React.FC<ProfilePageProps> = props => {
  const { nounId } = props;

  return (
    <Section bgColor={classes.whiteBg} fullWidth={false}>
      <Container>
        <Row>
          <Col sm={4}>
            <NounProfileCard nounId={nounId} />
          </Col>
          <Col sm={8}>
            <ProfileActivityFeed nounId={nounId} />
          </Col>
        </Row>
      </Container>
    </Section>
  );
};
export default ProfilePage;
