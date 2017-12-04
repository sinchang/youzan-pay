'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    await this.ctx.render('index.art');
  }

  async success() {
    await this.ctx.render('success.art');
  }

  async handleCreateQrcode() {
    try {
      const tokenRet = await this.getToken();

      if (tokenRet.error){
        this.ctx.status = 401;
        this.ctx.body = tokenRet;
        return;
      }

      const token = tokenRet.access_token;

      const { qr_price } = this.ctx.request.body;
      const qrcodeRet = await this.createQrcode(token, qr_price);

      this.ctx.body = qrcodeRet;
    } catch (err) {
      this.ctx.status = 500;
      this.ctx.body = {
        message: err.message
      }
    }
  }

  async getToken() {
    const ctx = this.ctx;
    const config = this.app.config.youzan
    const result = await ctx.curl('https://open.youzan.com/oauth/token', {
      method: 'POST',
      data: {
        client_id: config.CLIENT_ID,
        client_secret: config.CLIENT_SECRET,
        grant_type: 'silent',
        kdt_id: config.KAT_ID
      },
      dataType: 'json'
    });
    return result.data;
  }

  async createQrcode(token, qr_price) {
    const ctx = this.ctx;
    const result = await ctx.curl(`${this.app.config.youzan.API}/create?access_token=${token}`, {
      method: 'POST',
      data: {
        qr_type: 'QR_TYPE_DYNAMIC',
        qr_name: 'hello',
        qr_price: qr_price * 100
      },
      dataType: 'json'
    })
    return result.data;
  }

  async listen() {
    const body = this.ctx.request.body;
    this.app.io.of('/').emit('res', 'TRADE_SUCCESS');
  }
}

module.exports = HomeController;
