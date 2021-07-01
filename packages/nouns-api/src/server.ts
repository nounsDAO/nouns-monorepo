import { Express } from 'express';
import { config } from './config';
import { Server } from 'http';
import { Socket } from 'net';

/**
 * Create the HTTP server
 * @param app The express application
 */
export const createServer = (app: Express): Server => {
  const server = app.listen(config.serverPort, () => {
    console.info(`HTTP service listening on 0.0.0.0:${config.serverPort}`);
  });

  let connections: Socket[] = [];

  server.on('connection', (connection: Socket) => {
    connections.push(connection);
    connection.on(
      'close',
      () => (connections = connections.filter((curr: Socket) => curr !== connection)),
    );
  });

  const handles = {
    shutdown: () => {
      console.info('Received kill signal, shutting down gracefully');
      server.close(() => {
        console.info('Closed out remaining connections');
        process.exit(0);
      });

      setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);

      connections.forEach((curr: Socket) => curr.end());
      setTimeout(() => connections.forEach((curr: Socket) => curr.destroy()), 5000);
    },
  };
  process.on('SIGTERM', handles.shutdown);
  process.on('SIGINT', handles.shutdown);

  return server;
};
