// pages/secondtalk/secondtalk.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myopenid: wx.getStorageSync('useropenid'),
    meetid: null,
    costomerids:[],
   talkList:[],
   costomers:[],
    clientHeight:null,
    textInput:null,
    title:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
   var costomerids=JSON.parse(options.costomerList)
    this.setData({
      meetid: options.id,
      costomerids:costomerids,
     title:options.title
    })
    wx.getSystemInfo({
      success: res=> {
        this.setData({
          clientHeight: res.windowHeight
        });
      }
    })
    this.getCostomer()
  },

  getCostomer(){
    const mycostomer=this.data.costomerids
    const meetid=this.data.meetid
wx.cloud.callFunction({
  name:'getCostomer',
  
  data:{
    costomerids:mycostomer,
    meetid:meetid
  },
  success:res=>{
    console.log(res)
    this.setData({
      talkList:res.result.talkList.data,
      costomers:res.result.costomers.data
    })
  },
 fail:res=>{
    console.log(res)
    wx.showToast({
      icon:'error',
      title: '加载失败了',
    })
  }
})
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  gotoTalk(e){
    console.log(e)
    
    
      wx.navigateTo({
        url: '/pages/talkDetail/talkDetail?id='+e.currentTarget.dataset.id+'&masterid='+this.data.myopenid+'&title='+this.data.title+'&costomerid='+e.currentTarget.dataset.costomerid,
      })
    },
  

  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getCostomer()
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
this.getCostomer()
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