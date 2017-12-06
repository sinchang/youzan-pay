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
    API: 'https://open.youzan.com/api/oauthentry'
  };

  config.security = {
    csrf: {
      enable: false
    }
  };

  exports.io = {
    namespace: {
      '/': {
        connectionMiddleware: ['auth'],
        packetMiddleware: ['filter'],
      }
    }
  };

  return config;
};
