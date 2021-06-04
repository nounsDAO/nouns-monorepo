import express from 'express';
import envar from './envar.config';
require('dotenv').config();

const config = {
  port: Number(envar.Port),
};

const logger = console;
const app = express();

app.get('/', (_req, res) => {
  res.send('');
});

const server = app.listen(config.port, () => {
  logger.info(`HTTP service listening on 0.0.0.0:${config.port}`);
});

let connections: any = [];

server.on('connection', (connection: any) => {
  connections.push(connection);
  connection.on(
    'close',
    () =>
      (connections = connections.filter((curr: any) => curr !== connection)),
  );
});

const handles = {
  shutdown: () => {
    logger.info('Received kill signal, shutting down gracefully');
    server.close(() => {
      logger.info('Closed out remaining connections');
      process.exit(0);
    });

    setTimeout(() => {
      logger.error(
        'Could not close connections in time, forcefully shutting down',
      );
      process.exit(1);
    }, 10000);

    connections.forEach((curr: any) => curr.end());
    setTimeout(() => connections.forEach((curr: any) => curr.destroy()), 5000);
  },
};
process.on('SIGTERM', handles.shutdown);
process.on('SIGINT', handles.shutdown);
