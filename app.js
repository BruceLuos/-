import {Token} from '/models/token.js'
App({
  onLaunch: function () {
     const token = new Token()
     token.verify()
  },
  globalData: {
    doubanBase: "https://douban-api.uieee.com",
  }
})
