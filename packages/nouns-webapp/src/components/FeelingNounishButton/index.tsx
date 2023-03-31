import classes from './FeelingNounishButton.module.css';
import { ExternalURL, externalURL } from '../../utils/externalURL';
import FeelingNounishGraphic from '../../assets/feeling-nounish-graphic.png';
import FeelingNounishGraphic2 from '../../assets/feeling-nounish-graphic2.png';

const FeelingNounishButton = () => {
  const feelingNounishURL = externalURL(ExternalURL.feelingNounish);

  return (
    <div className={classes.container}>
      <p>Feeling Nounish?</p>
      <img
        draggable={false}
        onMouseDown={e => {
          e.currentTarget.src = FeelingNounishGraphic2;
        }}
        onMouseUp={e => {
          e.currentTarget.src = FeelingNounishGraphic;
          window.location.href = feelingNounishURL;
        }}
        onMouseOut={e => {
          e.currentTarget.src = FeelingNounishGraphic;
        }}
        src={FeelingNounishGraphic}
        alt="A link to the I'm Feeling Nounish website"
      />
    </div>
  );
};

export default FeelingNounishButton;
