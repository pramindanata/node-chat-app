const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const app = express();
const publicPath = path.join(__dirname, '../public');
const server = http.createServer(app);
const port = process.env.PORT || 4000;

const io = socketIO(server);

app.use(bodyParser.json());
app.use(express.static(publicPath));

app.get('/', (req, res) => {
  res.json({
    status: 'OK',
  });
});

io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.on('createMessage', (data) => {
    io.emit('newMessage', {
      from: data.from,
      text: data.text,
      created_at: new Date().getTime(),
    });
  });
});

server.listen(port, () => {
  console.log(`Started on port ${port}`);
});
