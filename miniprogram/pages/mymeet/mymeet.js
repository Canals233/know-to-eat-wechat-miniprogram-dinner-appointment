// pages/mymeet/mymeet.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    articleinfo: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.showLoading({
      title: '加载中',
    })
    wx.getSystemInfo({
      success: (res)=> {
        this.setData({
          clientHeight: res.windowHeight
        });
      }
    })
    this.getMylist()
  },


  getMylist(){
    self = this
    wx.cloud.callFunction({
      name: 'getMyArticleList',
      data: {
        dbname:'eatmeet',
        openid: wx.getStorageSync("useropenid")
      },
      success: function(res) {
        wx.stopPullDownRefresh()
        wx.hideLoading({
          success: (res) => {},
        })
        self.setData({
          articleinfo: res.result.myarticleinfo.data,
        })
        console.log(self.data.articleinfo)
      },
      fail: function(res) {
        wx.showToast({
          'icon':'none',
          title: '糟糕，获取失败了',
        })
        wx.stopPullDownRefresh()
        console.log(res.errMsg)
      }
    })
  },
  toMeetDetail: function(event) {
    console.log(event)
    let id=event.currentTarget.dataset.id
    wx.navigateTo({
      url: '../meetDetail/meetDetail?id=' + id
    });
},
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.onShow();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})