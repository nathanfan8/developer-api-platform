import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase } from './config/initDb';
import { analyticsMiddleware } from './middleware/analytics';
import nodeV8 = require('node:v8');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(analyticsMiddleware);

// Base health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Demo endpoint to test telemetry interception later
app.get('/api/demo', (_req: Request, res: Response) => {
  res.json({ message: 'Hello from monitored route!' });
});

//simulate slow response for testing telemetry
app.get('/api/demo/slow', async (_req: Request, res: Response) => {
  await new Promise(resolve => setTimeout(resolve, 400));
  res.json({ message: 'This was a slow response!' });
});


async function start() {
  await initDatabase();  
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

start();
