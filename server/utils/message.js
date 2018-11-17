const generateMessage = (from, text) => ({
  from,
  text,
  created_at: new Date().getTime(),
});

const generateLocationMessage = (from, latitude, longitude) => ({
  from,
  url: `https://www.google.com/maps/?q=${latitude},${longitude}`,
  created_at: new Date().getTime(),
});

module.exports = {
  generateMessage,
  generateLocationMessage,
};
