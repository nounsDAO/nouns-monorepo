import { BigNumber } from "ethers";
import React from "react";
import StandaloneNoun from "../../components/StandaloneNoun";

interface ProfilePageProps {
    nounId: number;
}

const ProfilePage: React.FC<ProfilePageProps> = props => {
    const { nounId } = props;

    const nounContent = (
        <div>
          <StandaloneNoun nounId={BigNumber.from(nounId)} />
        </div>
     );

    return (
        <div>
            {nounContent}
        </div>
    );
};

export default ProfilePage;