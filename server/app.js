const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const app = express();
const port = process.env.PORT || 4000;
const publicPath = path.join(__dirname, '../public');
const server = http.createServer(app);

const io = socketIO(server);

const { generateMessage } = require('./utils/message');

app.use(bodyParser.json());
app.use(express.static(publicPath));

app.get('/', (req, res) => {
  res.json({
    status: 'OK',
  });
});

io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('createMessage', (data, callback) => {
    io.emit('newMessage', generateMessage(data.from, data.text));

    // socket.broadcast.emit('newMessage', generateMessage(data.from, data.text));

    callback('This is from the server.');
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user connected'));
});

server.listen(port, () => {
  console.log(`Started on port ${port}`);
});
