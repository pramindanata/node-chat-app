class Users {
  constructor() {
    this.users = [];
  }

  addUser(id, name, room) {
    const user = { id, name, room };
    this.users.push(user);

    return user;
  }

  getUser(id) {
    const user = this.users.find(item => item.id === id);

    return user;
  }

  getUserList(room) {
    const users = this.users
      .filter(item => item.room === room)
      .map(item => item.name);

    return users;
  }

  removeUser(id) {
    const user = this.getUser(id);

    if (user) {
      const index = this.users.findIndex(item => item.id === id);

      this.users.splice(index, 1);
    }

    return user;
  }
}

module.exports = Users;
