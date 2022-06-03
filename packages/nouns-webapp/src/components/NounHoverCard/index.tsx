import { BigNumber } from "ethers";
import { isAddress } from "ethers/lib/utils";
import NounInfoCard from "../NounInfoCard";
import { StandaloneNounCircular } from "../StandaloneNoun";

interface NounHoverCardProps {
    nounId: string;
}

const NounHoverCard: React.FC<NounHoverCardProps> = props => {

    const { nounId } = props;

    if (!nounId) {
        return <></>;
    }

    return (
        <div>
            <div style={{
                display: 'flex',
            }}>
                <StandaloneNounCircular nounId={BigNumber.from(nounId)} /> 
                <div style={{
                    fontFamily: 'Londrina Solid',
                    fontSize: '24px',
                    marginLeft: '0.5rem',
                    marginTop: '0.25rem'
                }}>
                    Noun {nounId}
                </div>
            </div>

            {/* <NounInfoCard nounId={parseInt(nounId)} bidHistoryOnClickHandler={() => console.log("sup")} /> */}

            <div style={{
                color: 'var(--brand-gray-light-text)'
            }}>
                View Noun Profile 
            </div>
        </div>
    )

};

export default NounHoverCard;