import { Trans } from '@lingui/react/macro';
import { Nav } from 'react-bootstrap';

import Section from '@/components/section';
import { Link } from 'react-router';

const NounsIntroSection = () => {
  return (
    <>
      <Section fullWidth={false} className="mb-[60px] !p-0 lg:!pb-8 lg:!pt-16">
        <div className="lg:col-span-6">
          <div className="ml-[20px] p-8 lg:ml-0 lg:px-0 lg:pr-8">
            <h1 className="font-londrina text-[3.75rem] lg:text-[5rem]">
              <Trans>One Noun, Every Day, Forever.</Trans>
            </h1>
            <p className="text-[1.2rem]">
              <Trans>
                Behold, an infinite work of art! Nouns is a community-owned brand that makes a
                positive impact by funding ideas and fostering collaboration. From collectors and
                technologists, to non-profits and brands, Nouns is for everyone.
              </Trans>
            </p>
          </div>
        </div>
        <div className="lg:col-span-6">
          <iframe
            src="https://www.youtube.com/embed/lOzCA7bZG_k"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
            allowFullScreen
          ></iframe>
          <small
            className={
              'text-muted absolute bottom-[-40px] top-[350px] px-10 lg:bottom-auto lg:top-[365px]'
            }
          >
            This video was commissioned in{' '}
            <Nav.Link as={Link} to="/vote/113">
              Prop 113
            </Nav.Link>{' '}
            <span className="sm:block">
              and minted in{' '}
              <Nav.Link as={Link} to="/vote/190">
                Prop 190
              </Nav.Link>
            </span>
          </small>
        </div>
      </Section>
      <Section fullWidth={false} className="mb-[60px] !p-0 lg:!pb-8 lg:!pt-16">
        <div className="order-lg-1 order-2 lg:col-span-6">
          <iframe
            src="https://www.youtube.com/embed/oa79nN4gMPs"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
            allowFullScreen
          ></iframe>

          <small
            className={
              'text-muted absolute bottom-[-40px] top-[350px] px-10 lg:bottom-auto lg:top-[365px]'
            }
          >
            This video was produced as part of <Link to="/vote/143">Prop 143</Link>
          </small>
        </div>

        <div className="order-lg-2 order-1 lg:col-span-6">
          <div className="ml-[20px] p-8 pr-0 lg:ml-0 lg:px-0 lg:pr-8">
            <h1 className="font-londrina text-[3.75rem] lg:text-[5rem]">
              <Trans>Build With Nouns. Get Funded.</Trans>
            </h1>
            <p className="text-[1.2rem]">
              <Trans>
                There&apos;s a way for everyone to get involved with Nouns. From whimsical endeavors
                like naming a frog, to ambitious projects like constructing a giant float for the
                Rose Parade, or even crypto infrastructure like Prop House. Nouns funds projects of
                all sizes and domains.
              </Trans>
            </p>
          </div>
        </div>
      </Section>
    </>
  );
};

export default NounsIntroSection;
