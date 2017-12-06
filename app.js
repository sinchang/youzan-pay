require('dotenv').config();

module.exports = app => {
  app.users = {};
  app.token = {
    value: '',
    expire: ''
  }
};
