// pages/meetDetail/meetDetail.js
var timeUtil = require('../../utils/timeUtils');
const db = wx.cloud.database()
const _ = db.command
const str='articleData.nowNum'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    articleData: {},
    userData: {},
    _id: "",
    myopenid: wx.getStorageSync('useropenid'),
    checked: false,
    alreadyIn: false,
    master: false,
    outdate: true,
    full: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this
    let theid = options.id
    self.setData({
      _id: theid,
      myopenid:wx.getStorageSync('useropenid')
    })

   this.getArticle()
   
  },

  

  getArticle(){
    db.collection('eatmeet').where({
      _id: this.data._id
    }).get().then(
      res => {
        console.log(res)
        let getarticleData=res.data[0]
        try {
          console.log(getarticleData.openid===this.data.myopenid)
          if (timeUtil.wxjudgeTime(getarticleData.DateTime)) {
            this.setData({
              outdate: false
            })
          }
          if (getarticleData.openid == this.data.myopenid) {
            
            this.setData({
              master:true
            })
          }
          if (getarticleData.nowNum == getarticleData.needNum) {
            this.setData({
              full:true
            })
          }
          if(getarticleData.costomerList.some(ele=>ele==this.data.myopenid)){
            this.setData({
              alreadyIn:true
            })
          }
         
        } catch (error) {
          console.log(error)
        }

        this.setData({
          articleData: getarticleData
        })
        this.getUser(getarticleData)
      }
    )
  },

  getUser(e) {
    var self = this
    const db = wx.cloud.database()
    db.collection('user').where({
      openid: e.openid
    }).get().then(
      res => {
        console.log(res)
        self.setData({
          userData: res.data[0]
        })
      }
    )
  },

  joinMeet() {
    if (!this.data.myopenid) {
      wx.showModal({
        cancelColor: 'cancelColor',
        title: "您还未登录",
        content: "是否前往个人页面登录",
        success: function (res) {
          if (res.confirm) {
            wx.reLaunch({
              url: '/pages/my/my',
            })
          } else {
            wx.showToast({
              icon: 'none',
              title: '您可以前往“我识”界面自行登录',
            })
          }
        }
      })
      return
    }
    if(!this.data.checked){
      wx.showToast({
        icon:'none',
        title: '请先阅读并同意《约饭须知》',
      })
      return
    }
    wx.showModal({
      cancelColor: 'cancelColor',
      title: "确定加入吗",
     
      success: res=> {
        if (res.confirm) {
          wx.showLoading({
            title: '正在加入约饭',
          })
          wx.cloud.callFunction({
            name:"costomerAndTalk",
            data:{
              id:this.data._id,
              costomeropenid:this.data.myopenid,
              state:'add',
              masteropenid:this.data.articleData.openid
            },
            success:(res)=>{
              console.log("调用",res)
              wx.hideLoading()
              wx.showToast({
                title: '加入成功',
              })
              this.setData({
                alreadyIn:true,
                [str]:this.data.articleData.nowNum+1
              })
            },
            fail:(error)=>{
              console.log("调用错！",error)
              wx.showToast({
                icon:'error',
                'title':'加入失败'
              })
            }
          })
        }
      }
    })
    
  },

  leaveMeet(){
    wx.showModal({
      cancelColor: 'cancelColor',
      title: "确定离开吗",
     
      success: res=> {
        if (res.confirm) {
          wx.showLoading({
            title: '正在退出约饭',
          })
          wx.cloud.callFunction({
            name:"costomerAndTalk",
            data:{
              id:this.data._id,
              costomeropenid:this.data.myopenid,
              state:'leave',
              masteropenid:this.data.articleData.openid
            },
            success:(res)=>{
              console.log("调用",res)
              wx.hideLoading()
              wx.showToast({
                title: '退出成功',
              })
              
              this.setData({
                alreadyIn:false,
                [str]:this.data.articleData.nowNum-1,
                full:false
              })
            },
            fail:(error)=>{
              console.log("调用错",error)
              wx.showToast({
                icon:'error',
                'title':'退出失败'
              })
            }
          })
        
        }
      }
    })
    
  },
  deleteMeet(){
    wx.showModal({
      cancelColor: 'cancelColor',
      title: "确定解散吗",
     
      success: res=>{
        if (res.confirm) {
          wx.showLoading({
            title: '正在解散约饭',
          })
          wx.cloud.callFunction({
            name:"costomerAndTalk",
            data:{
              id:this.data._id,
              costomeropenid:this.data.myopenid,
              state:'delete',
              masteropenid:this.data.articleData.openid
            },
            success:(res)=>{
              console.log("调用",res)
              wx.hideLoading()
              wx.showToast({
                title: '解散成功',
              })
              wx.navigateBack({
                delta: 1,
              })
            },
            fail:(error)=>{
              console.log("调用错",error)
              wx.showToast({
                icon:'error',
                'title':'解散失败'
              })
            }
          })
        }
      }
    })
    
  },

  gotoShouldKnow(){
wx.navigateTo({
  url: '/pages/shouldknow/shouldknow',
})
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
    
  },

  ViewImage(e) {
    console.log(e)
    wx.previewImage({
      urls: this.data.articleData.picture,
      current: e.currentTarget.dataset.url
    });
  },

  checkChange(e) {

    this.setData({
      checked: !this.data.checked
    })
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