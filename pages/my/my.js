import {
  ClassicModel
} from '../../models/classic.js'
import {
  BookModel
} from '../../models/book.js'

import {
  promisic
} from '../../util/common.js'

const classicModel = new ClassicModel()
const bookModel = new BookModel()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    authorized: false,
    userInfo: null,
    bookCount: 0,
    classics: null,
    bgimg: ['/images/my/my@bg.png', '/images/my/my@bg2.png','/images/my/my@bg4.png'],
    bgImg:'/images/my/my@bg.png',
    i: 1
  },

  onShow(options) {
    // 在页面展示时获取是否授权的信息
    this.userAuthorized1()
    this.getMyBookCount()
    this.getMyFavor()
    // wx.getUserInfo({
    //   success:data=>{
    //     console.log(data)
    //   }
    // })
  },

  getMyFavor() {
    classicModel.getMyFavor().then(res => {
      this.setData({
        classics: res
      })
    })
  },

  getMyBookCount() {
    bookModel.getMyBookCount()
      .then(res => {
        this.setData({
          bookCount: res.count
        })
      })
  },

  userAuthorized1() {
    promisic(wx.getSetting)()
      .then(data => {
        if (data.authSetting['scope.userInfo']) {
          return promisic(wx.getUserInfo)()
        }
        return false
      })
      .then(data => {
        if (!data) return
        this.setData({
          authorized: true,
          userInfo: data.userInfo
        })
      })
  },

// 判断用户是否授权
  userAuthorized() {
    wx.getSetting({
      success: data => {
        if (data.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: data => {
              this.setData({
                authorized: true,
                userInfo: data.userInfo
              })
            }
          })
        }
      }
    })
  },



  onGetUserInfo(event) {
    const userInfo = event.detail.userInfo
    if (userInfo) {
      this.setData({
        userInfo,
        authorized: true
      })
    }
  },

  onJumpToAbout(event) {
    wx.navigateTo({
      url: '/pages/about/about',
    })
  },

// 切换图片
  onStudy() {
    // console.log('ff')
    let iI = this.data.i == 3 ? 0 : this.data.i
    // console.log(iI)
    let bgIMG = this.data.bgimg[iI]
    iI+=1
    // console.log(bgIMG)
    this.setData({
      bgImg : bgIMG,
      i:iI
    })
    
  },

  onJumpToDetail(event) {
    const cid = event.detail.cid
    const type = event.detail.type
    console.log(cid,type)
    // wx.navigateTo
    wx.navigateTo({
      url: `/pages/classic-detail/classic-detail?cid=${cid}&type=${type}`
    })
  }


})









// wx.navigateTo({
//   url:`/pages/classic-detail/index?cid=${cid}
//     &type=${type}`
// })