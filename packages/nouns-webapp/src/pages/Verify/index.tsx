import React from 'react';
import { useAppSelector } from '../../hooks';
import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { nounsIndex } from '../../wrappers/subgraph';
import classes from './Verify.module.css';
import clsx from 'clsx';
import Section from '../../layout/Section';
import { Button, Col, Form } from 'react-bootstrap';
import VerifySignature from '../../components/VerifySignature';
import * as R from 'ramda';
import { useEthers } from '@usedapp/core';

interface VerifyPageProp {}

const VerifyPage: React.FC<VerifyPageProp> = props => {
  const activeAccount = useAppSelector(state => state.account.activeAccount);
  const { data } = useQuery(nounsIndex());
  const [messageToSign, setMessageToSign] = useState<undefined | string>(undefined);
  const [signedMessage, setSignedMessage] = useState<undefined | object>(undefined);
  const { library } = useEthers();

  const extractOwnedNounIdsFromNounsIndex = (owner: string | undefined, nounsIndex: any) =>
    R.pipe(
      (nouns: any) =>
        nouns.filter((noun: any) =>
          !owner
            ? false
            : (noun.owner.id as string)
                .toLocaleLowerCase()
                .localeCompare(owner.toLocaleLowerCase()) === 0,
        ),
      R.map((noun: any) => Number(noun.id)),
      R.sort((a: number, b: number) => a - b),
    )(nounsIndex.nouns);

  const loadingContent = () => <div className={classes.loadingContent}>loading your Nouns...</div>;

  useEffect(() => {
    if (!data) return;
    const initialMessage = (nouns: number[]) =>
      [
        activeAccount ? `I am ${activeAccount}` : undefined,
        nouns.length > 0
          ? ` and I own Noun${nouns.length > 1 ? 's' : ''} ${nouns.join(', ')}`
          : undefined,
      ]
        .filter((part: string | undefined) => part)
        .join(' ');
    setMessageToSign(initialMessage(extractOwnedNounIdsFromNounsIndex(activeAccount, data)));
  }, [data, activeAccount]);

  return (
    <div className={clsx(classes.verifyBlock)}>
      <Section fullWidth={true}>
        <Col lg={{ span: 6, offset: 3 }}>
          {messageToSign === undefined ? (
            loadingContent()
          ) : (
            <>
              <h2>Sign Message</h2>
              <div>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                  <Form.Label>Message To Sign:</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    onChange={e => setMessageToSign(e.target.value)}
                    defaultValue={messageToSign}
                  />
                </Form.Group>
                <Button
                  onClick={async () => {
                    const signature = await library?.getSigner().signMessage(messageToSign);
                    setSignedMessage({
                      message: messageToSign,
                      signer: activeAccount,
                      signature,
                    });
                  }}
                >
                  Sign Message
                </Button>
              </div>
              <div className={classes.signedPayload}>
                {signedMessage && (
                  <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Signed Payload:</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      readOnly={true}
                      value={JSON.stringify(signedMessage)}
                    />
                  </Form.Group>
                )}
              </div>
            </>
          )}
        </Col>
        <Col lg={{ span: 6, offset: 3 }}>
          <VerifySignature />
        </Col>
      </Section>
    </div>
  );
};
export default VerifyPage;
