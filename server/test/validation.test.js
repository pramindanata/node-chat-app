const expect = require('expect');
const { isRealString } = require('../utils/validation');

describe('isRealString', () => {
  it('Should reject non-string values', () => {
    const result = isRealString(12);

    expect(result).toBeFalsy();
  });

  it('Should reject string with only spaces', () => {
    const result = isRealString('     ');

    expect(result).toBeFalsy();
  });

  it('Should allow string with non-space characters', () => {
    const result = isRealString('   dummy data  ');

    expect(result).toBeTruthy();
  });
});
