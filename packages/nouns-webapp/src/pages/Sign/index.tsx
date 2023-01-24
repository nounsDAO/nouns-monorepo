import Section from '../../layout/Section';
import { Button, Col } from 'react-bootstrap';
import { Trans } from '@lingui/macro';
import { useEthers } from '@usedapp/core';


const SignPage = () => {

  const { library, chainId } = useEthers();

  async function sign() {
    const signer = library?.getSigner();
    console.log(signer);

    const domain = {
      name: 'Nouns DAO',
      version: 'V1',
      chainId: chainId,
      verifyingContract: '0x5615dEB798BB3E4dFa0139dFa1b3D433Cc23b72f'
    };

    const types = {
      Proposal: [
        { name: 'proposer', type: 'address' },
        { name: 'targets', type: 'address[]' },
        { name: 'values', type: 'uint256[]' },
        { name: 'signatures', type: 'string[]' },
        { name: 'calldatas', type: 'bytes[]' },
        { name: 'description', type: 'string' },
        { name: 'expiry', type: 'uint40' }
      ]
    };

    const value = {
      proposer: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      targets: ['0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC','0xaAaAaAaaAaAaAaaAaAAAAAAAAaaaAaAaAaaAaaAa'],
      values: ['1000000000000000000', '0'],
      signatures: ['sendOrRegisterDebt(address,uint256)', ''],
      calldatas: ['0x0000000000000000000000002B63BC71926AD001BCAFD9DF55952CF8FAD4F1B20000000000000000000000000000000000000000000000000000002F49B40F00', '0x'],
      description: 'This is my awesome proposal',
      expiry: 1677625200
    };

    const signature = await signer?._signTypedData(domain, types, value);
    console.log('signature: ', signature);
  }

  return (
    <Section fullWidth={true}>
      <Col lg={{ span: 6, offset: 3 }}>
        <h2 style={{ marginBottom: '2rem' }}>
          <Trans>Testing signatures</Trans>
        </h2>
        <Button onClick={() => sign()}>Sign</Button>
      </Col>
    </Section>
  );
};

export default SignPage;
