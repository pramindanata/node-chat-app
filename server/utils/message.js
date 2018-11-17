const moment = require('moment');

const generateMessage = (from, text) => ({
  from,
  text,
  created_at: moment().valueOf(),
});

const generateLocationMessage = (from, latitude, longitude) => ({
  from,
  url: `https://www.google.com/maps/?q=${latitude},${longitude}`,
  created_at: moment().valueOf(),
});

module.exports = {
  generateMessage,
  generateLocationMessage,
};
