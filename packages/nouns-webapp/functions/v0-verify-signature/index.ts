import { Handler } from '@netlify/functions';
import { verifyMessage } from 'viem';
import { sharedResponseHeaders } from '../utils';
import { isNounDelegate, isNounOwner, nounsQuery } from '../theGraph';

interface ErrorReason {
  error: string;
  message: string;
}

const errorBuilder = (error: string, message: string) => ({ error, message });

const invalidBodyCheck = (body: string | undefined | null): false | ErrorReason => {
  if (!body || body.length === 0)
    return {
      error: 'empty_body',
      message: 'Request body is missing or empty',
    };
  const { message, signature, signer } = JSON.parse(body);

  if (!message) return errorBuilder('missing_msg', 'Request is missing msg');
  if (!signature) return errorBuilder('missing_sig', 'Request is missing signature');
  if (!signer) return errorBuilder('missing_signer', 'Request is missing signer');
  return false;
};

const handler: Handler = async (event, context) => {
  const checkResult = invalidBodyCheck(event.body);
  if (checkResult) {
    return {
      statusCode: 400,
      body: JSON.stringify(checkResult),
    };
  }

  try {
    const { message, signature, signer } = JSON.parse(event.body);

    // Verify message using viem
    const validSignature = await verifyMessage({
      address: signer,
      message,
      signature,
    });

    // check for ownership and delegation
    let participantData = {};
    if (event.queryStringParameters.fetchParticipation && validSignature) {
      const normalizedNouns = await nounsQuery();
      participantData = {
        isNounDelegate: isNounDelegate(signer, normalizedNouns),
        isNounOwner: isNounOwner(signer, normalizedNouns),
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        ...sharedResponseHeaders,
      },
      body: JSON.stringify({
        message,
        signature,
        providedSigner: signer,
        signer,
        validSignature,
        ...participantData,
      }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        ...sharedResponseHeaders,
      },
      body: JSON.stringify({
        error: 'signature_verification_failed',
        message: error.message || 'Failed to verify signature',
      }),
    };
  }
};

export { handler };
