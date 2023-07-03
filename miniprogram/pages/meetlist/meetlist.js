// pages/meetlist/meetlist.js
import timeUtils from '../../utils/timeUtils'
const citySelector = requirePlugin('citySelector');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    meetList: [],
    userList:[],
    city:"",
    filter:"",
    timer:null,
    inputShowed:false,
    clientHeight:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    self = this
    this.getCity()
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      filter:""
    })
    wx.getSystemInfo({
      success: function(res) {
        self.setData({
          clientHeight: res.windowHeight
        });
      }
    })
  


    this.getArticle(options)

  
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
    this.getArticle()
    this.getCity()
  },

  getArticle(options){
    
    wx.cloud.callFunction({
      name: 'getArticle',
      data:{
        dbname:'eatmeet',
          filter:options?options.filter:""
      },
      success: function(res) {
        wx.stopPullDownRefresh()
        wx.hideLoading()
        console.log(res)
        let oriMeetList=res.result.articleList.data
        let oriUserList=res.result.userList.data
        let resMeetList=[],resUserList=[]
        let filter=self.data.city
        for(let i=0;i<oriMeetList.length;i++){
          if(timeUtils.wxjudgeTime(oriMeetList[i].DateTime)){
            if(oriMeetList[i].city!=filter && filter){
              continue
            }
             resMeetList.push(oriMeetList[i])
              resUserList.push(oriUserList[i])
          }
          
        }
        self.setData({
          meetList: resMeetList,
          userList: resUserList
        })
       
      },
      fail: function(res) {
        wx.stopPullDownRefresh()
        wx.showToast({
          icon:"none",
          title: '暂无相关',
          duration:3000
        })
        console.log(res.errMsg)
        if(options.filter){
        self.getArticle()}
      }
    })
  },

  chooseCity(){
    const key = 'UQPBZ-HQDWW-U5FRD-RW6N7-P7DDJ-DCBH7'; //使用在腾讯位置服务申请的key
    const referer = '识食小程序'; // 调用插件的app的名称
    const hotCitys = '北京,上海,天津,重庆,广州,深圳,成都,杭州'; // 用户自定义的的热门城市
    
    wx.navigateTo({
      url: `plugin://citySelector/index?key=${key}&referer=${referer}&hotCitys=${hotCitys}`,
    })
    
  },

  ViewImage(e) {
    console.log(e)
    wx.previewImage({
      urls: e.currentTarget.dataset.urls,
      
    });
  },

  toMeetDetail(e){
    console.log(e)
    wx.navigateTo({
      url: '/pages/meetDetail/meetDetail?id='+e.currentTarget.dataset.id,
    })
  },


  onSearch(e){
    clearTimeout(this.data.timer)
    // 启动新的定时器
    
    this.data.timer = setTimeout(()=>{
      // 取出搜索的值
      let options={
        filter:"",
      }
      options.filter= e.detail.value
      // 取出数据源
       this.onLoad(options)
      },800)
      
  },

  getCity(){
    const selectedCityLocation = citySelector.getCity()
    
    const city=selectedCityLocation?selectedCityLocation.fullname:wx.getStorageSync('cityLocation').fullname
    console.log(city)
    this.setData({
      city:city
    })
   //如果选择了城市，就会显示当前城市
  },

  // 使文本框进入可编辑状态
  showInput: function () {
    this.setData({
      inputShowed: true   //设置文本框可以输入内容
    });
  },
  // 取消搜索
  hideInput: function () {
   
    this.setData({
      inputShowed: false
    });
    this.getArticle()
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
    this.onLoad()
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