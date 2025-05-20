const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Permitir todas as origens por enquanto
    methods: ["GET", "POST"]
  }
});

app.get('/', (req, res) => {
  res.send('Servidor Socket.IO rodando!');
});

io.on('connection', (socket) => {
  console.log('Usuário conectado:', socket.id);

  socket.on('chat-message', (message) => {
    // Adiciona um ID à mensagem
    const messageWithId = {
      ...message,
      id: Date.now().toString()
    };
    // Reencaminha a mensagem para todos os clientes
    io.emit('chat-message', messageWithId);
  });

  socket.on('disconnect', () => {
    console.log('Usuário desconectado:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
