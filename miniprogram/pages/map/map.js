// pages/map/map.js
var timeUtil = require('../../utils/timeUtils');
const citySelector = requirePlugin('citySelector');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scale:9,
    wh: '',
    ww: '',
    markers: [
     
    ],
    searchSourse:[

    ],
    search:[],
    marker: {
     
    },
    lastMarker: {},
    longitude: 104.066128,
    latitude: 30.572924,
    viewshow: false,
    // listshow: false,
    searchshow:false,
    timer:null,
    cityChose:false,
    authorized:false,
    maypublish:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const res = wx.getSystemInfoSync()
    
    this.setData({
      wh: res.windowHeight + 'px',
      ww: res.windowWidth + 'px'
    })
    this.mapCtx = wx.createMapContext('map')
    
    this.getmap()
    //记得改成按城市来获取地图，默认加载成都
  },

  AuthorizeLocate: function () {
    var that = this
    wx.authorize({
      scope: 'scope.userLocation',//发起定位授权
      success: function () {
        console.log('有定位授权')
        that.setData({
          authorized:true
        })
        that.chooseCity()
       
      
      }, fail() {
       //如果用户拒绝授权，则要告诉用户不授权就不能使用，引导用户前往设置页面。
        console.log('没有定位授权')
        wx.showModal({
          cancelColor: 'cancelColor',
          title: '没有授权无法完整使用本小程序',
          content: '是否前往设置页面手动开启',
          success: function (res) {
            if (res.confirm) {
              wx.openSetting({
                withSubscriptions: true,
              })
            } else {
              wx.showToast({
                icon: 'none',
                title: '您取消了定位授权',
              })
            }
          }, fail: function (e) {
            console.log(e)
          }
        })
      }
    })
  },


  


  chooseCity(){
    const key = 'UQPBZ-HQDWW-U5FRD-RW6N7-P7DDJ-DCBH7'; //使用在腾讯位置服务申请的key
    const referer = 'know-to-eat'; // 调用插件的app的名称
    const hotCitys = '北京,上海,天津,重庆,广州,深圳,成都,杭州'; // 用户自定义的的热门城市
    
    wx.navigateTo({
      url: `plugin://citySelector/index?key=${key}&referer=${referer}&hotCitys=${hotCitys}`,
    })
    
  },




  getCity(){
    const selectedCityLocation = citySelector.getCity()
    console.log(selectedCityLocation)
    var lastCity=wx.getStorageSync('cityLocation')

    if(selectedCityLocation){
      this.setData({
        cityChose:true
      })
    }
    //如果新选择的城市有且与原来的不同
   var flag=true
   if(selectedCityLocation && lastCity){
    try {
      if(selectedCityLocation.location.longitude==lastCity.location.longitude &&selectedCityLocation.location.latitude==lastCity.location.latitude){
        flag=false
       }
    } catch (error) {
      
    }     
   }


    if(flag){
    wx.setStorageSync('cityLocation', selectedCityLocation)
    
    this.setData({
      longitude:selectedCityLocation?selectedCityLocation.location.longitude:104.066128,
      latitude:selectedCityLocation?selectedCityLocation.location.latitude:30.572924,
    })
    
    this.getmap()
    this.moveToLocation()
  }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (e) {
    
  },


 /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const that=this
    
    wx.getSetting({
      success (res) {
        
        const author="scope.userLocation"
        if(res.authSetting[author]){
          that.setData({
            authorized:true
          })
        }
      }
    })

    const myCity=wx.getStorageSync('cityLocation')
    // console.log(myCity)
    if(myCity){
      this.setData({
        cityChose:true
      })
    }

    if(this.data.authorized){
    this.getCity()
    }
    if(this.data.maypublish){
      this.setData({
        maypublish:false
      })
      this.getmap()
    }
    this.getmap()
  },


  
  //点击search图片
  tapSearchBtn(e){
    if(this.data.viewshow){
      this.closeshow()
    }
    this.setData({
      searchshow:!this.data.searchshow,
      search:[]
    })
    
  },

//中心点重定位
  moveToLocation: function () {
    const that=this
    this.mapCtx.moveToLocation({
      longitude:that.data.longitude,
      latitude:that.data.latitude
    })
    
  },

  // getLocation() {
  //   var that=this
    
  //   wx.getLocation({
  //     success(res) {
  //       console.log(res)
  //       that.setData({
  //         latitude: res.latitude,
  //         longitude: res.longitude
  //       }),//重置中心点，下面是移动中心点
  //         that.mapCtx.moveToLocation({
  //           latitude: res.latitude,
  //           longitude: res.longitude
  //         })
  //     },
  //     fail: function () {
  //       //失败报错
  //       wx.showToast({
  //         title: '获取定位失败，请检查是否开启位置信息权限',
  //         icon: 'none',
  //         duration: 4000
  //       })
  //     }
  //   });

  // },
  
  //防止炎上而关闭

  



  //地图标点的点击事件
  markertaper(e) {
    
    // console.log(e)
    this.setData({
      searchshow:false
    })
   
    if (this.data.marker.id == e.detail.markerId) {
      this.setData({
        viewshow: !this.data.viewshow,
        
      })
    }//有了就把他隐藏
    else {//没有则指定一个marker去存数据库的数据
      let marker = this.data.markers.find(item => { return item.id == e.detail.markerId })

      this.designateMarker(marker)
    }
    this.markerChangeColour()
    //给他转个色
  },


  markerChangeColour() {//更改图标颜色
    
   
    if (this.data.viewshow) {
      
      if (this.data.marker) {
   
        let str = 'markers[' + this.data.marker.id + '].iconPath';
        this.setData({
          [str]: '/static/marker-active.png'
        })
      }
      if (this.data.lastMarker && this.data.lastMarker.id != this.data.marker.id) {
       
        let str = 'markers[' + this.data.lastMarker.id + '].iconPath';
        try{
          this.setData({
            [str]: '/static/marker.png'
          })
        }catch(error){
          console.log(error)
        }
      }
    } else {
      try {
        if (this.data.marker) {
          //刚开始marker没值，
    
          let str = 'markers[' +  this.data.marker.id  + '].iconPath';
          this.setData({
            [str]: '/static/marker.png'
          })
        }
      } catch (error) {
        console.log(error)
      }
    }
  },

  designateMarker(marker){
    // console.log(marker,"marker是否存在")
    if (!marker) {
      this.setData({
        viewshow: false,
      })//没有就隐藏并报错
      wx.showToast({
        title: '数据加载失败',
        icon: 'none',
        duration: 3000
      });
    } else {//有就把他显示出来
      this.setData({
        lastMarker: this.data.marker,
        marker: marker,
        viewshow: true,
      })
    }
  },//指定一个新的marker








  closeshow() {
    console.log("closeview")
    this.setData({
      viewshow: false
    })
    this.markerChangeColour()
  },//关掉弹出的描述

  
  goToMeet(e){

    wx.navigateTo({
      url: '/pages/meetDetail/meetDetail?id='+e.currentTarget.dataset.marker.content._id,
    })
  },


  closesearch() {
    console.log("closesearch")
    this.setData({
      searchshow: !this.data.searchshow
    })
    
  },//关掉弹出的搜索


  //i!!! 获取地图数据
  getmap() {
    
    
   
    var mapresult
    var self=this
    var remarkers=[]
    
    this.closeshow()
    //得到地图数据的index
    const myCity=wx.getStorageSync('cityLocation')
    // console.log(myCity)
    wx.cloud.callFunction({
      
      name: 'getMapData',
      data:{
       city:myCity?myCity.fullname:'成都市'
      },
      success: function (res) {
        // console.log(res)
       mapresult=res.result.data
     var sourse=[]
       //笨蛋遍历
       
       
        var cnt=0
       for(let e in mapresult){
         if(!timeUtil.wxjudgeTime(mapresult[e].DateTime)){
          continue
         }
        self.createmarkers(mapresult[e],cnt++,remarkers)
        let searchKey={}
        searchKey.shopname=mapresult[e].shopname
        searchKey.title=mapresult[e].title
        sourse.push(searchKey)
       } 
       self.setData({
         markers:remarkers,
         searchSourse:sourse
       })
       
      },
    })
    
    
  },
  //给getmap用的，用于创建新的marker点集合
  createmarkers(ori,e,remarkers){
    let remarker={
      iconPath: "/static/marker.png",
      width: 20,
      height: 20,
      id:+e,
      joinCluster:true,
      callout:{
        content:"",
        borderWidth:0
      },
      content:{}
    }
    let orikeys = Object.keys(ori);
    let orivalues=Object.values(ori);
    for(let i in orikeys){
      let n=orikeys[i]
      let v=orivalues[i]
      if(n== "longitude" || n== "latitude"){
        remarker[n]=v
      }
      else {
        
        remarker.content[n]=v
        
      }
    }
    remarkers.push(remarker)
  },
  
//点击发布约饭发生的事情
addmeet(){
  this.setData({
    maypublish:true
  })
  wx.navigateTo({
    url: '/pages/addmeet/addmeet',
  })
},



  //搜索框事件们
  onSearch(e){
    clearTimeout(this.data.timer)
    // 启动新的定时器
    this.data.timer = setTimeout(()=>{
      // 取出搜索的值
      let search = e.detail.value
      // 取出数据源
      let searchSourse=this.data.searchSourse
      // 判断搜索值是否为空
      if(search==""){
        // 为空返回一个空数组
        return this.setData({search:[]})
      }
      // 创建正则对象
      let reg =new RegExp(search,'i');
      // 定义一个容器接收数据源
      let res =[]
      // 循环
     
      res=searchSourse.filter((item,key)=>{
        // 返回通过正则的数据
        
        return reg.test(item.shopname)
      })
    //  console.log("搜索结果",res)
      // 将结果刷新至视图层
      this.setData({search:res})

      
      },800)
      
  },

  //点击搜索结果时候发生的事情
  tapRes(e){
    console.log(e)
    let target=e.currentTarget.dataset.item.title
    // console.log("searchRestap")
    this.setData({
      searchshow:false
    })
    if (this.data.marker.title == target) {
      this.setData({
        viewshow: !this.data.viewshow,
      })
    }//有了就把他隐藏
    else {//没有则指定一个marker去存数据库的数据
      let marker = this.data.markers.find(item => { return item.content.title == target })

      this.designateMarker(marker)
    }
    this.markerChangeColour()
    //给他转个色
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