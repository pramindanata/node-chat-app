const expect = require('expect');
const { generateMessage } = require('../utils/message');

describe('generateMessage', () => {
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
