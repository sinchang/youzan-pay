'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1512306871888_157';

  // add your config here
  config.middleware = [];

  config.view = {
    defaultViewEngine: 'art',
    mapping: {
      '.art': 'art',
      '.html': 'art'
    }
  };

  config.art = {};

  config.youzan = {
    API: 'https://open.youzan.com/api/oauthentry',
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    KAT_ID: process.env.KAT_ID
  };

  config.security = {
    csrf: {
      enable: false
    }
  };

  exports.io = {
    init: {
      'transports': ['xhr-polling'],
      'polling duration': 10
    },
    namespace: {
      '/': {
        connectionMiddleware: ['auth'],
        packetMiddleware: ['filter'],
      }
    }
  };

  return config;
};
