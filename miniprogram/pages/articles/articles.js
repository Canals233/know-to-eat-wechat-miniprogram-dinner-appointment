// pages/comments.js



Page({

  /**
   * 页面的初始数据
   */
  data:{
    CollectImgUrl:"/static/star.png",
    likeImgUrl:"/static/like.png",
    //自定义变量，存储详情信息
    articleData:{},
    userData:{},
    _id:"",
    isCollect:false,
    isLike:false,
    myopenid: wx.getStorageSync('useropenid')
  },

  //页面加载
  onLoad(options){
  var self=this
   let theid=options.id
   self.setData({
   _id:theid,
  })


  const db=wx.cloud.database()
  db.collection('articles').where({
    _id:this.data._id
  }).get().then(
    res=>{
      console.log(res)
      let getarticleData=res.data[0]
      self.setData({
        articleData:getarticleData
      })
      this.getUser(getarticleData)
      
      this.isCollectAndLike()
    }
  )
  


  
  
  },

  getUser(e){
    var self=this
    const db=wx.cloud.database()
    db.collection('user').where({
      openid:e.openid
    }).get().then(
      res=>{
        console.log(res)
        self.setData({
          userData:res.data[0]
        })
      }
    )
  },
  //获取收藏状态
  isCollectAndLike(){
    self=this
    console.log(self.data.myopenid,self.data.articleData)
    wx.cloud.callFunction({
      name: 'isCollectAndLike',
      data: {
        articleid: self.data.articleData._id,
        openid: self.data.myopenid
      },
      success: function(res) {
        
        self.setData({
          isCollect: res.result.isCollect,
          isLike: res.result.isLike
        })
        
      },
      fail: function(res) {
        console.log(res)
      }
    })
  },

  //点击收藏功能
  onCollect: function() {
   if(!this.data.myopenid){
    wx.showModal({
      cancelColor: 'cancelColor',
      title: "您还未登录",
      content:"是否前往个人页面登录",
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
   let collectState=this.data.isCollect
   let collectNum=this.data.articleData.collectNum
   
    console.log("original state",collectState)
    this.setData({
      isCollect:!collectState,
      'articleData.collectNum':collectState?collectNum-1:collectNum+1
    })
    //取消收藏
    wx.cloud.callFunction({
      name:"onCollect",
      data:{
        articleid: this.data.articleData._id,
          openid: this.data.myopenid
      },
      // success:function(res){
      //   self.setData({
      //     isCollect:res.result.isCollect
      //   })
      // },
      fail:function(err){
        console.log(err)
      }
    })
    
  },

  //点赞功能
  onLike: function() {
    if(!this.data.myopenid){
      wx.showModal({
        cancelColor: 'cancelColor',
        title: "您还未登录",
        content:"是否前往个人页面登录",
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
    let likeState=this.data.isLike
   let likeNum=this.data.articleData.likeNum
    console.log("original state",this.data.isLike)
    this.setData({
      isLike:!this.data.isLike,
      'articleData.likeNum':likeState?likeNum-1:likeNum+1
    })
    wx.cloud.callFunction({
      name:"onLike",
      data:{
        articleid: this.data.articleData._id,
          openid: this.data.myopenid
      },
      // success:function(res){
      //   console.log(res)
        
      // },
      fail:function(err){
        console.log(err)
      }
    })
    
  },

  //点击图片会发生的事情
  ViewImage(e) {
    console.log(e)
    wx.previewImage({
      urls: this.data.articleData.picture,
      current: e.currentTarget.dataset.url
    });
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