// pages/talkDetail/talkDetail.js
const db = wx.cloud.database()
const _ = db.command
Page({
  /**
   * 页面的初始数据
   */
  data: {
    myopenid: wx.getStorageSync('useropenid'),
    myprofile: wx.getStorageSync('lcuserInfo'),
    meetid: null,
    masterid: null,
    costomerid: null,
    state: null,
    title: null,
    talklist: [],
    clientHeight: null,
    friendprofile: null,
    textInput: '',
    flag:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const self =this
    const myopenid = this.data.myopenid
    
    console.log(options)
    this.setData({
      meetid: options.id,
      masterid: options.masterid,
      costomerid: options.costomerid,
      title: options.title,
      
    })
    wx.getSystemInfo({
      success: res => {
        this.setData({
          clientHeight: res.windowHeight
        });
      }
    })
    if (options.masterid == myopenid) {
      this.setData({
        state: 'master'
      })
      db.collection('user').where(
        {
          openid: options.costomerid,
        }
      ).get().then(
        res => {
          this.setData({
            friendprofile: res.data[0]
          })
        }
      )
    }
    else {
      this.setData({
        state: 'costomer'
      })
      db.collection('user').where(
        {
          openid: options.masterid,
        }
      ).get().then(
        res => {
          this.setData({
            friendprofile: res.data[0]
          })
        }
      )
    }
    
   
      this.getNewTalk()

   




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
    
  },

  getNewTalk() {
    console.log(this.data)
    db.collection('talklist').where(
      {
        masterid: this.data.masterid,
        costomerid: this.data.costomerid,
        meetid: this.data.meetid
      }
    ).get().then(
      res => {
        console.log(res)
        this.setData({
          talklist: res.data[0].talklist,
          flag:`item${res.data[0].talklist.length-1}`
        })
        wx.stopPullDownRefresh({
          success: (res) => { },
        })
       
      }
    )
  },

  onInput(e) {
    if (this.data.textInput == e.detail.value) {
      return
    }
    this.setData({
      textInput: e.detail.value
    })
  },

  sendTalk() {

    const state = this.data.state
    const msg = this.data.textInput

    if (msg == '') {
      wx.showToast({
        icon: 'none',
        title: '请输入内容',
      })
      return
    }
    const obj = {
      state: state,
      content: msg
    }
    console.log(obj)

    db.collection('talklist').where({
      masterid: this.data.masterid,
      costomerid: this.data.costomerid,
      meetid: this.data.meetid
    }).update({
      data: {
        talklist: _.push(obj)
      }
    }).then(res => {
      console.log(res)
      wx.showToast({
        title: '发送留言成功',
      })
      this.setData({
        textInput: null
      })
      this.getNewTalk()
      
    }).catch(
      res => {
        wx.showToast({
          icon: 'error',
          title: '发送失败',
        })
      }
    )
  },


  gotoShouldKnow() {

    wx.navigateTo({
      url: '/pages/shouldknow/shouldknow',
    })
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
    this.getNewTalk()
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