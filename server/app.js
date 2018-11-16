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

app.use(bodyParser.json());
app.use(express.static(publicPath));

app.get('/', (req, res) => {
  res.json({
    status: 'OK',
  });
});

io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('createMessage', (data) => {
    io.emit('newMessage', {
      from: data.from,
      text: data.text,
      created_at: new Date().getTime(),
    });

    // socket.broadcast.emit('newMessage', {
    //   from: data.from,
    //   text: data.text,
    //   created_at: new Date().getTime(),
    // });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.emit('newMessage', {
    from: 'Admin',
    text: 'Welcome to the chat app.',
    created_at: new Date().getTime(),
  });

  socket.broadcast.emit('newMessage', {
    from: 'Admin',
    text: 'New user joined',
    created_at: new Date().getTime(),
  });
});

server.listen(port, () => {
  console.log(`Started on port ${port}`);
});
