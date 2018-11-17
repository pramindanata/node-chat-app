const socket = io();

// DOM process
document.addEventListener('DOMContentLoaded', () => {
  const messageForm = document.querySelector('#message-form');
  const messagesList = document.querySelector('#messages');
  const locationBtn = document.querySelector('#location-btn');

  // # Function list
  // ## Append new message to DOM
  const appendMessage = (data) => {
    const li = document.createElement('li');

    li.innerHTML = `<strong>${data.from}</strong>: ${data.text}`;
    messagesList.appendChild(li);
  };

  // ## Emit create message io event
  const emitCreateMessage = (message) => {
    // Socket, create message emitter
    socket.emit('createMessage', {
      from: 'User',
      text: message,
    }, (data) => {
      console.log('Got it.', data);
    });
  };

  // # Listener list
  // ## Listen message form's submit event
  messageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const message = document.querySelector('input[name="message"]').value;

    emitCreateMessage(message);
  });

  // ## Listen location button's click event
  locationBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
      return alert('Geolocation not supported by your browser.');
    }

    navigator.geolocation.getCurrentPosition((position) => {
      socket.emit('createLocationMessage', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    }, (err) => {
      alert('Unable to fetch location', err);
    });
  });

  // # Immediately invoked socket listener
  // ## Socket, connect listener
  socket.on('connect', () => {
    console.log('Connected to server');
  });

  // ## Socket, disconnect listener
  socket.on('disconnect', () => {
    console.log('Disconnected from server');
  });

  // ## Socket, new message listener
  socket.on('newMessage', (data) => {
    console.log('New message received', data);

    appendMessage(data);
  });
});
