const socket = io();

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

socket.on('newMessage', (data) => {
  console.log('New message received', data);
});

// socket.emit('createMessage', {
//   from: 'Pramindanata',
//   text: 'Wut ?',
// });
