const generateMessage = (from, text) => ({
  from,
  text,
  created_at: new Date().getTime(),
});

module.exports = {
  generateMessage,
};
