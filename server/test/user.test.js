const expect = require('expect');
const Users = require('../utils/users');

describe('Users', () => {
  let users = [];

  beforeEach(() => {
    users = new Users();
    users.users = [
      {
        id: 123,
        name: 'Eksa',
        room: 'Test Room',
      },
      {
        id: 124,
        name: 'Pramindanata',
        room: 'Test Room',
      },
      {
        id: 321,
        name: 'Test',
        room: 'Uwu Room',
      },
    ];
  });

  it('Should add a new user', () => {
    const user = {
      id: 123,
      name: 'EKsa',
      room: 'Test Room',
    };

    users.addUser(user.id, user.name, user.room);

    expect(users.users[3]).toEqual(user);
  });

  it('Should return names from users', () => {
    const userList = users.getUserList('Test Room');

    expect(userList).toEqual(['Eksa', 'Pramindanata']);
  });

  it('Should find a user', () => {
    const userId = 123;
    const user = users.getUser(userId);

    expect(user.id).toBe(userId);
  });

  it('Should not find a user', () => {
    const userId = 1234;
    const user = users.getUser(userId);

    expect(user).toBe(undefined);
  });

  it('Should remove a user', () => {
    const userId = 123;
    users.removeUser(userId);
    const user = users.getUser(userId);

    expect(users.users.length).toBe(2);
    expect(user).toBe(undefined);
  });

  it('Should not remove a user', () => {
    const userId = 1234;
    users.removeUser(userId);

    expect(users.users.length).toBe(3);
  });
});
