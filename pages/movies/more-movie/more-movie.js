// pages/movies/more-movie/more-movie.js
var app = getApp()
var util = require('../../../utils/util.js')
Page({
  data: {
    movies: {},
    navigateTitle: "",
    requestUrl: "",
    totalCount: 0,
    isEmpty: true,
  },
  // 首先如何知道这个页面要加载三个主题中哪个主题的更多页面
  // 要获取当前点击更多时的category是哪个值
  // catergory会在movie.js中接收值
  onLoad: function (options) {
    var category = options.category;
    // console.log(category)
    this.data.navigateTitle = category;
    var dataUrl = "";
    switch (category) {
      case "正在热映":
        dataUrl = app.globalData.doubanBase +
          "/v2/movie/in_theaters";
        break;
      case "即将上映":
        dataUrl = app.globalData.doubanBase +
          "/v2/movie/coming_soon";
        break;
      case "豆瓣Top250":
        dataUrl = app.globalData.doubanBase + "/v2/movie/top250";
        break;
    }
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle
    })
    // 将dataUrl放进data中requestUrl方便其他函数使用这个url
    this.data.requestUrl = dataUrl;
    util.http(dataUrl, this.processDoubanData)
  },
// 页面下拉到底部时执行的函数
  onReachBottom: function (event) {
    var nextUrl = this.data.requestUrl +
      "?start=" + this.data.totalCount + "&count=20";
      console.log(nextUrl)
    util.http(nextUrl, this.processDoubanData)
    // 导航条加载动画
    wx.showNavigationBarLoading()
  },
  // 下拉刷新
  onPullDownRefresh: function (event) {
    var refreshUrl = this.data.requestUrl +
      "?star=0&count=20";
    this.data.movies = {};
    this.data.isEmpty = true;
    this.data.totalCount = 0;
    util.http(refreshUrl, this.processDoubanData);
    wx.showNavigationBarLoading();
  },
  // 处理豆瓣传过来的数据
  processDoubanData: function (moviesDouban) {
    var movies = [];
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      // title长度大于6的话就截到长度为6的地方
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      // [1,1,1,1,1] [1,1,1,0,0]
      // 将数据写出json格式存入到temp中
      var temp = {
        stars: util.convertToStarsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp)
    }
    // 更新电影数据
    var totalMovies = {}
    //如果要绑定新加载的数据，那么需要同旧有的数据合并在一起
    if (!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies);
    }
    else {
      // 不是第一次加载的时候
      totalMovies = movies;
      this.data.isEmpty = false;
    }
    this.setData({
      movies: totalMovies
    });
    // 每次下拉数据数加20
    this.data.totalCount += 20;
    // 隐藏导航头加载动画
    wx.hideNavigationBarLoading();
    // 停止下拉刷新
    wx.stopPullDownRefresh()
  },
  // 在页面渲染完成时将设置bar的标题
  onReady: function (event) {
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle
    })
  },
  // 跳转到电影详情页面
  onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id=' + movieId
    })
  },
})