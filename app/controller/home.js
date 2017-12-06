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
    const { ctx } = this;

    try {
      const {
        qr_price
      } = ctx.request.body;
      const qrcodeRet = await this.createQrcode(qr_price);

      ctx.body = qrcodeRet;
    } catch (err) {
      ctx.status = 500;
      ctx.body = {
        message: err.message
      }
    }
  }

  async getToken() {
    const ctx = this.ctx;
    const { value, expire } = this.app.token;

    if (!expire || new Date().getTime() > expire){
      const result = await ctx.curl('https://open.youzan.com/oauth/token', {
        method: 'POST',
        data: {
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          grant_type: 'silent',
          kdt_id: process.env.KAT_ID
        },
        dataType: 'json'
      });

      if (result.data.error) {
        ctx.status = 401;
        ctx.body = result.data;
        return;
      }

      const token = result.data.access_token;
      this.app.token.value = token;
      this.app.token.expire = new Date().getTime() + 6 * 24 * 3600 * 1000;
      return token;
    } else {
      return value;
    }
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
    const { ctx } = this;

    ctx.body = {
      code: 0,
      msg: 'success'
    };

    try {
      const body = ctx.request.body;
      const users = ctx.app.users;
      const qrcodeId = await this.getTrade(body.id);
      const socketId = users[qrcodeId];

      if (body.status === 'TRADE_SUCCESS') {
        this.app.io.of('/').to(socketId).emit('res', 'TRADE_SUCCESS');
        delete users[qrcodeId];
      }
    } catch(err) {
      ctx.status = 500;
      ctx.body = {
        message: err.message
      }
    }
  }
}

module.exports = HomeController;
