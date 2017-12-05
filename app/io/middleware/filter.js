module.exports = app => {
  return function* (next) {
      const socketId = this.packet[1].socketId;
      const qrcodeId = this.packet[1].qrcodeId;
      const users = app.users;
      users[qrcodeId] = socketId;
      yield* next;
  };
};
