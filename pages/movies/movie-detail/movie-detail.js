import { Movie } from 'class/Movie.js';
var util = require('../../../util/util.js')
var app = getApp();
Page({
  data: {
    movie: {}
  },
  onLoad: function (options) {
    // 获取从more-movie中点击电影时时的电影id
    var movieId = options.id;
    var url = app.globalData.doubanBase +
      "/v2/movie/subject/" + movieId;
    var movie = new Movie(url);
    util.http(url,this.processDoubanData);
   
    // var movieData = movie.getMovieData();
    // var that = this;
    // movie.getMovieData(function (movie) {
    //   that.setData({
    //     movie: movie
    //   })
    // })
    //C#、Java、Python lambda
    movie.getMovieData((movie) => {
      this.setData({
        movie: movie
      })
    })
  },
  // 查看豆瓣数据
  processDoubanData: function (data) {
    console.log(data);
  },
  /*查看图片*/
  viewMoviePostImg: function (e) {
    var src = e.currentTarget.dataset.src;
    // 图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: [src] // 需要预览的图片http链接列表
    })
  },
})