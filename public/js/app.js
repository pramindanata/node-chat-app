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

  // ## Append new location message to DOM
  const appendLocationMessage = (data) => {
    const li = document.createElement('li');

    li.innerHTML = `<strong>${data.from}</strong>: <a href="${data.url}" target="_blank">My current location</a>`;
    messagesList.appendChild(li);
  };

  // ## IO - Emit create message
  const emitCreateMsg = message => new Promise((resolve) => {
    socket.emit('createMessage', {
      from: 'User',
      text: message,
    }, (data) => {
      resolve(data);
    });
  });

  // ## IO - Emit location message
  const emitLocationMsg = position => new Promise((resolve) => {
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    }, () => {
      resolve();
    });
  });

  // ## Init geolocation
  const geoInit = () => new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported by your browser.'));
    } else {
      resolve();
    }
  });

  // ## Get current location position
  const geoGetCurrentPos = () => new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition((position) => {
      resolve(position);
    }, () => {
      reject(new Error('Unable to fetch location.'));
    });
  });

  // ## Reset location button
  const resetLocationBtn = () => {
    locationBtn.textContent = 'Send Location';
    locationBtn.removeAttribute('disabled');
  };

  // # Listener list
  // ## Listen message form's submit event
  messageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const messageInput = document.querySelector('input[name="message"]');
    const message = messageInput.value;

    emitCreateMsg(message)
      .then(() => {
        messageInput.value = '';
      });
  });

  // ## Listen location button's click event
  locationBtn.addEventListener('click', () => {
    locationBtn.setAttribute('disabled', true);
    locationBtn.textContent = 'Sending Location...';

    geoInit()
      .then(() => geoGetCurrentPos())
      .then(position => emitLocationMsg(position))
      .then(() => {
        resetLocationBtn();
      })
      .catch((err) => {
        alert(err);

        resetLocationBtn();
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
    appendMessage(data);
  });

  // ## Socket, new message listener
  socket.on('newLocationMessage', (data) => {
    appendLocationMessage(data);
  });
});
