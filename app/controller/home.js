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
      const {
        qr_price
      } = this.ctx.request.body;
      const qrcodeRet = await this.createQrcode(qr_price);

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

    if (result.data.error) {
      this.ctx.status = 401;
      this.ctx.body = result.data;
      return;
    }

    return result.data.access_token;
  }

  async createQrcode(qr_price) {
    const token = await this.getToken();
    const ctx = this.ctx;
    const result = await ctx.curl(`${this.app.config.youzan.API}/youzan.pay.qrcode/3.0.0/create?access_token=${token}`, {
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

  async getTrade(id) {
    const token = await this.getToken();
    const ctx = this.ctx;
    const result = await ctx.curl(`${this.app.config.youzan.API}/youzan.trade/3.0.0/get?access_token=${token}&tid=${id}`, {
      method: 'GET',
      dataType: 'json'
    })
    return result.data.response.trade.qr_id;
  }

  async listen() {
    this.ctx.body = {
      code: 0,
      msg: 'success'
    };

    try {
      const body = this.ctx.request.body;
      const users = this.ctx.app.users;
      const qrcodeId = await this.getTrade(body.id);
      console.log(this.ctx.app.users)
      const socketId = users[qrcodeId];
      if (body.status === 'TRADE_SUCCESS') {
        this.app.io.of('/').to(socketId).emit('res', 'TRADE_SUCCESS');
        delete users[qrcodeId];
      }
    } catch(err) {
      this.ctx.status = 500;
      this.ctx.body = {
        message: err.message
      }
    }
  }
}

module.exports = HomeController;
