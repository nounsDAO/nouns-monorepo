import { Trans } from "@lingui/macro";
import React from "react";
import { ProposalActionCreationStep, ProposalActionModalStepProps } from "../..";
import ModalTitle from "../../../ModalTitle";

const StreamPaymentsDetailsStep : React.FC<ProposalActionModalStepProps> = props => {

    const { onPrevBtnClick, onNextBtnClick, state, setState } = props;

    return (
        <div>
        <ModalTitle>
            <Trans>Stream Payment Details</Trans>
        </ModalTitle>

        </div>
    );

};

export default StreamPaymentsDetailsStep;