import express from 'express';
import routes from './routes/index.js';
import cors from 'cors';
import { WebSocketServer } from 'ws';

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Middleware to enable CORS
app.use(cors({
    origin: 'http://localhost:5173', // Replace with your front-end URL
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));

// Use routes
app.use('/api', routes);

// Create a WebSocket server
const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('WebSocket connection established');

    // Notify clients when the API restarts
    ws.send(JSON.stringify({ message: 'API restarted' }));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
});