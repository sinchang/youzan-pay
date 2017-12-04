'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/success', controller.home.success);
  router.post('/createQrcode', controller.home.handleCreateQrcode);
  router.post('/listen', controller.home.listen);
  app.io.route('chat', app.io.controllers.chat.ping);
};
