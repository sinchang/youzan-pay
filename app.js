'use strict';

module.exports = app => {
  app.users = {};
  app.token = {
    value: '',
    expire: '',
  };
};
