// apps/api/src/server.ts
import express, { Request, Response } from 'express';
import { HelloApiResponse } from '@garden/types';

const app = express();
const port = 3001; // Dedicated port for the API

// Middleware to parse incoming JSON requests
app.use(express.json());

// Define the root route with explicit TypeScript types for Request and Response
app.get('/api/hello', (req: Request, res: Response<HelloApiResponse>) => {
  res.json({ 
    message: 'Hello from the Garden API',
    timestamp: new Date().toISOString(),
    status: 'ok' 
  });
});

app.listen(port, () => {
  console.log(`[API] Server running at http://localhost:${port}`);
});