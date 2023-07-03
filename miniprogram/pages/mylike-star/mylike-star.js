// pages/mylike-star/mylike-star.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    articleList: [],
    userList:[],
    clientHeight:0,
    state:null,
    likeflag:null,
    openid:wx.getStorageSync('useropenid')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    self = this
    wx.showLoading({
      title: '加载中',
    })
    wx.getSystemInfo({
      success: function(res) {
        self.setData({
          clientHeight: res.windowHeight
        });
      }
    })
    const mystate=options.state
    this.setData({
      state:mystate,
      likeflag:mystate=='like'?true:false
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    const myopenid=this.data.openid
    this.getArticle(myopenid)
  },


  getArticle(options){
    const mystate=this.data.state
    wx.cloud.callFunction({
      name: 'getMyCollectOrLike',
      data:{
        state:mystate,
        openid:options
      },
      success: function(res) {
       
        wx.hideLoading()
        console.log(res)
        

        self.setData({
          articleList: res.result.articleList.data,
          userList: res.result.userList.data
        })
        
        self.createOriginWaterfall()
      },
      fail: function(res) {
        wx.stopPullDownRefresh()
        wx.showToast({
          icon:"none",
          title: '暂无数据哦',
          duration:3000
        })
        console.log(res.errMsg)
        
      }
    })
  },


  

  createOriginWaterfall(){

    this.waterfallRef = this.selectComponent('#waterfall');
    this.waterfallRef.run([this.data.articleList,this.data.userList], () => {
    });
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})