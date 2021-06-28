import express, { Express, Request } from 'express';
import { param, validationResult } from 'express-validator';
import { getTokenMetadata } from './utils';

/**
 * Create the express app and attach routes
 */
export const createAPI = (): Express => {
  const app = express();

  app.use(express.json());

  app.get('/', (_req, res) => {
    res.status(200).send({
      message: 'Nouns API Root',
    });
  });

  app.get(
    '/metadata/:tokenId',
    param('tokenId').isInt({ min: 0, max: 1000 }),
    async (req: Request, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).send({ errors: errors.array() });
      }

      const metadata = await getTokenMetadata(req.params.tokenId);
      if (!metadata) {
        return res.status(500).send({ error: 'Failed to fetch token metadata' });
      }

      res.send(metadata);
    },
  );

  return app;
};
