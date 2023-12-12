// pages/publish/publish.js
var timeUtil = require('../../utils/timeUtils');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: null,
    imgList: [],
    textInput: '',
    textareaInput: '',
    shopInput:'',
    from:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
    this.setData({
      shopInput:"",
      from:options?options.from:""
      //from只会来自自己的评论和整个讨论
    })
    console.log(options)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    const myAuthorization = wx.getStorageSync('Authorization')
    if (!myAuthorization) {
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
            wx.navigateBack({
              delta: 1,
            })
            wx.showToast({
              icon: 'none',
              title: '您可以前往“我识”界面自行登录',
            })
          }
        }
      })
    }
  },

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

  //点选图片
  ChooseImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
      }
    });
  },

  //点击显示选择的图片
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },

  // 删除图片
  DelImg(e) {
    wx.showModal({
      title: '提示',
      content: '确定要删除这张图片吗？',
      cancelText: '再看看',
      confirmText: '删除',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },
  // 标题输入
  textInput(e) {
    if(this.data.textInput==e.detail.value)
    {
      return
    }
    
    
    this.setData({
      textInput: e.detail.value
    })
  },
  shopInput(e) {
    if(this.data.shopInput==e.detail.value)
    {
      return
    }
    this.setData({
      shopInput: e.detail.value
    })
  },
  // 内容输入
  textareaInput(e) {
    if(this.data.textareaInput==e.detail.value)
    {
      return
    }
    this.setData({
      textareaInput: e.detail.value
    })
  },
  //点击发布按钮事件
  publishBt: function() {
    const self=this
    const mytitle = this.data.textInput
    const mycontent = this.data.textareaInput
    const myshop = this.data.shopInput
    const mydatetime = timeUtil.formatTime(new Date());
    const myAuthorization=  wx.getStorageSync("Authorization")  
    const myImgList=self.data.imgList
    if (mytitle == '') {
      wx.showToast({
        icon: 'none',
        title: '请输入标题',
      })
      return
    }
   if(myImgList.length==0){
     wx.showToast({
       icon:'none',
       title: '请至少上传一张图片',
     })
     return
   }
    if (mycontent == '') {
      wx.showToast({
        icon: 'none',
        title: '请输入内容',
      })
      return
    }
    wx.showLoading({
      title: '发布中',
    })
    // 上传图片
    
    var resImgList=[];


    const addCloud= async function(){
      const db=wx.cloud.database()
      for(let i=0;i<myImgList.length;i++){
        const filePath = myImgList[i]
        const cloudPath = (Math.random() * 1000000) + "" + filePath.match(/\.[^.]+?$/)[0]
        await wx.cloud.uploadFile({
          cloudPath,
          filePath,
        }).then(res=>{
          console.log("似乎成功上传了图片")
          resImgList.push(res.fileID)
  
        }).catch(res=>{
          console.log("异步失败！")
          console.error
          wx.showLoading({
            title: '发布失败',
          })
        })
      }
      
    if(resImgList.length!=myImgList.length){
      wx.showToast({
        icon:"error",
        title: '发布失败',
        duration:2000
      })
      return
    }
    db.collection('articles').add({
      data: {
        collectionNum: 0,
        commentNum: 0,
        datetime: mydatetime,
        content: mycontent,
        Authorization: myAuthorization,
        picture: resImgList,
        title: mytitle,
        noteShopName:myshop,
        likeNum:0
      }
    }).then(res=>{
      console.log("成功添加数据")
      
      wx.showToast({
        title: '发布成功',
        icon: 'success',
        success: function() {
          setTimeout(function() {
            if(self.data.from=='discussion'){
              wx.reLaunch({
                url: '../discussion/discussion',
              })
            }
            else{
              wx.navigateBack({
                delta: 1,
              })
            }
          }, 2000);
        }
      })
    }).catch(res=>{
      wx.showToast({
        icon:"error",
        title: '发布失败',
        duration:2000
      })
    })

    }
    
    addCloud()
    
    
        

  },

  

})