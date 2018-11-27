const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const Users = require('./utils/users');
const { isRealString } = require('./utils/validation');

const app = express();
const port = process.env.PORT || 4000;
const publicPath = path.join(__dirname, '../public');
const server = http.createServer(app);

const io = socketIO(server);
const users = new Users();

const { generateMessage, generateLocationMessage } = require('./utils/message');

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
    const user = users.getUser(socket.id);

    if (user && isRealString(data.text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, data.text));
    }

    // socket.broadcast.emit('newMessage', generateMessage(data.from, data.text));
    callback();
  });

  socket.on('createLocationMessage', (coords, callback) => {
    const user = users.getUser(socket.id);

    if (user) {
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }

    callback();
  });

  socket.on('disconnect', () => {
    const user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
      console.log('User disconnected');
    }
  });

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room are required');
    }

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} connected`));

    return callback();
  });
});

server.listen(port, () => {
  console.log(`Started on port ${port}`);
});
