var util = require('../../util/util.js')
var app = getApp();
Page({
  // RESTFul API JSON
  // SOAP XML
  //粒度 不是 力度
  data: {
    inTheaters: {},
    comingSoon: {},
    top250: {},
    searchResult: {},
    containerShow: true,
    // 显示搜索内容
    searchPanelShow: false,
  },

  onLoad: function(event) {
    var inTheatersUrl = app.globalData.doubanBase +
      "/v2/movie/in_theaters" + "?start=0&count=3";
    var comingSoonUrl = app.globalData.doubanBase +
      "/v2/movie/coming_soon" + "?start=0&count=3";
    var top250Url = app.globalData.doubanBase +
      "/v2/movie/top250" + "?start=0&count=3";

    // 向豆瓣api发送三次请求
    // 注意这些请求都是异步的所以这些url要先在data上定义不然会报错
    this.getMovieListData(inTheatersUrl, "inTheaters", "正在热映");
    this.getMovieListData(comingSoonUrl, "comingSoon", "即将上映");
    this.getMovieListData(top250Url, "top250", "豆瓣Top250");
  },
  // 更多电影内容
  onMoreTap: function(event) {
    var category = event.currentTarget.dataset.category;
    // console.log(category)
    wx.navigateTo({
      url: "more-movie/more-movie?category=" + category
    })
  },

  onMovieTap: function(event) {
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: "movie-detail/movie-detail?id=" + movieId
    })
  },
  //请求豆瓣api
  getMovieListData: function(url, settedKey, categoryTitle) {
    var that = this;
    wx.request({
      url: url,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "json;x-www-form-urlencoded;charset=utf-8"
      },
      success: function(res) {
        console.log(res)
        // 成功请求后筛选数据
        that.processDoubanData(res.data, settedKey, categoryTitle)
      },
      fail: function(error) {
        // fail
        console.log(error)
      }
    })
  },
  // 关闭搜索框
  onCancelImgTap: function(event) {
    this.setData({
      containerShow: true,
      searchPanelShow: false,
      searchResult: {}
    })
  },
//  当焦点在搜索框的时候隐藏电影页面显示搜索内容模块
  onBindFocus: function(event) {
    this.setData({
      containerShow: false,
      searchPanelShow: true
    })
  },
//  失去焦点的时候更新并显示搜索内容
  onBindBlur: function(event) {
    var text = event.detail.value;
    // console.log(text)
    var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + text;
    console.log(searchUrl)
    this.getMovieListData(searchUrl, "searchResult", "");
  },

// 获取api传来的数据并进行筛选
  processDoubanData: function(moviesDouban, settedKey, categoryTitle) {
    var movies = [];
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      //标题
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      // [1,1,1,1,1] [1,1,1,0,0]
      // 将获取到的数据放入对象中
      var temp = {
        // 评星，10分一颗星
        stars: util.convertToStarsArray(subject.rating.stars),
        title: title,
        // 评分
        average: subject.rating.average,
        // 图片地址
        coverageUrl: subject.images.large,
        // id号用于跳转
        movieId: subject.id
      }
      movies.push(temp)
    }

    //定义一个空对象 动态添加属性和值
    var readyData = {};
    readyData[settedKey] = {
      // 主标题
      categoryTitle: categoryTitle,
      movies: movies
    }
    // console.log(readyData)
    // console.log(readyData[settedKey])
    this.setData(readyData);
  }
})