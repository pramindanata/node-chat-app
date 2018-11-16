const socket = io();

// DOM process
document.addEventListener('DOMContentLoaded', () => {
  const messageForm = document.querySelector('#message-form');
  const messagesList = document.querySelector('#messages');

  // Listen message form's submit event
  messageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const message = document.querySelector('input[name="message"]').value;

    // Socket, create message emitter
    socket.emit('createMessage', {
      from: 'User',
      text: message,
    }, (data) => {
      console.log('Got it.', data);
    });
  });

  // Socket, connect listener
  socket.on('connect', () => {
    console.log('Connected to server');
  });

  // Socket, disconnect listener
  socket.on('disconnect', () => {
    console.log('Disconnected from server');
  });

  // Socket, new message listener
  socket.on('newMessage', (data) => {
    console.log('New message received', data);

    // Append new message to DOM
    const li = document.createElement('li');

    li.innerHTML = `<strong>${data.from}</strong>: ${data.text}`;
    messagesList.appendChild(li);
  });
});
