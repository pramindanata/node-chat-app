const expect = require('expect');
const { generateMessage, generateLocationMessage } = require('../utils/message');

describe('# Generate message', () => {
  describe('## generateMessage', () => {
    it('Should generate a correct message object', () => {
      const from = 'Human';
      const text = 'Hi';
      const message = generateMessage(from, text);

      expect(message).toEqual(expect.objectContaining({
        from,
        text,
      }));
      expect(typeof message.created_at).toBe('number');
    });
  });

  describe('## generateLocationMessage', () => {
    it('Should generate a correct location message object', () => {
      const from = 'Human';
      const latitude = -8.6786048;
      const longitude = 115.2073728;
      const message = generateLocationMessage(from, latitude, longitude);

      expect(message).toEqual(expect.objectContaining({
        from,
        url: `https://www.google.com/maps/?q=${latitude},${longitude}`,
      }));
      expect(typeof message.created_at).toBe('number');
    });
  });
});
