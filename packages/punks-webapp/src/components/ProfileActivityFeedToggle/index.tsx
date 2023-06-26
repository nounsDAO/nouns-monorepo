import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Trans } from '@lingui/macro';
import React from 'react';
import classes from './ProfileActivityFeedToggle.module.css';

interface ProfileActivityFeedToggleProps {
  isExpanded: boolean;
  numEvents: number;
  toggleCallback: () => void;
}

const ProfileActivityFeedToggle: React.FC<ProfileActivityFeedToggleProps> = props => {
  const { isExpanded, numEvents, toggleCallback } = props;

  if (isExpanded) {
    return (
      <div className={classes.expandCollapseCopy} onClick={toggleCallback}>
        <Trans>Show fewer</Trans> <FontAwesomeIcon icon={faChevronUp} />
      </div>
    );
  }

  return (
    <div className={classes.expandCollapseCopy} onClick={toggleCallback}>
      <Trans>Show all {numEvents} events </Trans> <FontAwesomeIcon icon={faChevronDown} />
    </div>
  );
};

export default ProfileActivityFeedToggle;
