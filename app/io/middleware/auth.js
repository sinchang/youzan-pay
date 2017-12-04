module.exports = app => {
  return function* (next) {
      this.socket.emit('res', 'connected!');
      yield* next;
      // execute when disconnect.
      console.log('disconnection!');
  };
};
