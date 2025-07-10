import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import WebSocket from 'ws';
import dotenv from 'dotenv';
import cors from 'cors';
import { startFetching } from './fetcher.js';
import { setupPushRoutes } from './push.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

setupPushRoutes(app);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connecté'))
  .catch(err => console.error('❌ Erreur MongoDB :', err));

wss.on('connection', (ws) => {
  console.log('📡 Client WebSocket connecté');
});

startFetching((symbol, data) => {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ symbol, ...data }));
    }
  });
});

server.listen(process.env.PORT || 4000, () => {
  console.log(`🚀 Serveur lancé sur le port ${process.env.PORT || 4000}`);
});
