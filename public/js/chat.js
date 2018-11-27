const socket = io();

// DOM process
document.addEventListener('DOMContentLoaded', () => {
  const messageForm = document.querySelector('#message-form');
  const messagesList = document.querySelector('#messages');
  const locationBtn = document.querySelector('#location-btn');

  // # Function list
  // ## Append new message to DOM
  function appendMessage(data) {
    const time = moment(data.created_at).format('h:mm A');
    const template = document.querySelector('#message-template').innerHTML;
    const html = Mustache.render(template, {
      from: data.from,
      text: data.text,
      createdAt: time,
    });

    messagesList.insertAdjacentHTML('beforeend', html);
  }

  // ## Append new location message to DOM
  function appendLocationMessage(data) {
    const time = moment(data.created_at).format('h:mm A');
    const template = document.querySelector('#message-loc-template').innerHTML;
    const html = Mustache.render(template, {
      from: data.from,
      text: 'My current position.',
      url: data.url,
      createdAt: time,
    });

    messagesList.insertAdjacentHTML('beforeend', html);
  }

  // ## IO - Emit create message
  function emitCreateMsg(message) {
    return new Promise((resolve) => {
      socket.emit('createMessage', {
        from: 'User',
        text: message,
      }, (data) => {
        resolve(data);
      });
    });
  }

  // ## IO - Emit location message
  function emitLocationMsg(position) {
    return new Promise((resolve) => {
      socket.emit('createLocationMessage', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }, () => {
        resolve();
      });
    });
  }

  // ## Init geolocation
  function geoInit() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported by your browser.'));
      } else {
        resolve();
      }
    });
  }

  // ## Get current location position
  function geoGetCurrentPos() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((position) => {
        resolve(position);
      }, () => {
        reject(new Error('Unable to fetch location.'));
      });
    });
  }

  // ## Reset location button
  function resetLocationBtn() {
    locationBtn.textContent = 'Send Location';
    locationBtn.removeAttribute('disabled');
  }

  // ## Scroll to the bottom of the last message
  function scrollToBottom() {
    const lastMessage = messagesList.lastElementChild;
    const lastMessageHeight = lastMessage.clientHeight;
    const { scrollHeight, scrollTop, clientHeight } = document.querySelector('#messages');

    if (scrollHeight <= (scrollTop + clientHeight + lastMessageHeight)) {
      messagesList.scrollTop = messagesList.scrollHeight;
    }

    return false;
  }

  // ## Update user list
  function updateUserList(users) {
    const usersWrapper = document.querySelector('#users');
    const ol = document.createElement('ol');

    users.forEach((user) => {
      const li = document.createElement('li');

      li.textContent = user;
      ol.append(li);
    });

    usersWrapper.innerHTML = '';
    usersWrapper.append(ol);
  }

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
    const params = window.deparam(window.location.search);

    socket.emit('join', params, (err) => {
      if (err) {
        alert(err);
        window.location.href = '/';
      }
    });
  });

  // ## Socket, disconnect listener
  socket.on('disconnect', () => {
    console.log('Disconnected from server');
  });

  // ## Socket, update user listener
  socket.on('updateUserList', (users) => {
    updateUserList(users);
  });

  // ## Socket, new message listener
  socket.on('newMessage', (data) => {
    appendMessage(data);
    scrollToBottom();
  });

  // ## Socket, new message listener
  socket.on('newLocationMessage', (data) => {
    appendLocationMessage(data);
    scrollToBottom();
  });
});
