// pages/myCollect/myCollect.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    articleinfo: [],
    userinfo: [],
    myAuthorization:wx.getStorageSync('Authorization')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    self = this
    wx.cloud.callFunction({
      name: 'getMyCollectList',
      data: {
        Authorization: self.data.myAuthorization
      },
      success: function(res) {
        wx.stopPullDownRefresh()
        self.setData({
          articleinfo: res.result.collectArticleinfo.data,
          userinfo: res.result.collectArticleUserinfo.data
        })
      },
      fail: function(res) {
        wx.stopPullDownRefresh()
        console.log(res.errMsg)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.onLoad();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  viewItem: function(event) {
    wx.navigateTo({
      url: '/pages/articles/articles?id='+event.currentTarget.dataset.id,
    });
  },
  onCollect: function(event) {
    var articledata = event.currentTarget.dataset.item
    var articleindex = event.currentTarget.dataset.index
    console.log(articleindex)
    self = this
    wx.cloud.callFunction({
      name: 'onCollect',
      data: {
        articleid: articledata._id,
        Authorization: self.data.myAuthorization
      },
      success: function(res) {
        console.log(res)
        if (res.result.isCollect == false) {
          wx.showToast({
            icon: 'none',
            title: '取消收藏成功',
          })
          self.data.articleinfo.splice(articleindex, 1)
          self.data.userinfo.splice(articleindex, 1)
          self.setData({
            articleinfo: self.data.articleinfo,
            userinfo: self.data.userinfo
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '取消收藏失败',
          })
        }
      },
      fail: function(res) {
        console.log(res)
      }
    })

  }
})