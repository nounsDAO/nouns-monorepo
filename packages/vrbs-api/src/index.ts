import dotenv from 'dotenv';
import { createServer } from './server';
import { createAPI } from './api';

dotenv.config();

const app = createAPI();

createServer(app);
