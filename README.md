# youzan-pay

> 通过有赞云开发的个人收款案例 [demo](https://youzan-pay.herokuapp.com/)

## QuickStart

<!-- add docs here for user -->

see [egg docs][egg] for more detail.

### Development

环境变量：

* CLIENT_ID
* CLIENT_SECRET
* KAT_ID

本地开发的时候可以使用 [ngrok](https://ngrok.com/docs) 来做路由转发

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### Deploy

```bash
$ npm start
$ npm stop
```

### npm scripts

* Use `npm run lint` to check code style.
* Use `npm test` to run unit test.
* Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.

[egg]: https://eggjs.org

## Releated

* [xu42/pay](https://github.com/xu42/pay)
* [个人网站即时到账收款解决方案](https://blog.xu42.cn/2017/11/26/person-website-instant-payment-solution/)
