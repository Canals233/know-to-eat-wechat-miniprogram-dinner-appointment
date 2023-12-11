// pages/publish/publish.js
var timeUtil = require('../../utils/timeUtils');
const chooseLocation = requirePlugin('chooseLocation');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        index: null,
        imgList: [],
        textInput: '',
        textareaInput: '',
        friendInput: '',
        mylocation: null,
        showadd: false,
        labelInput: '',
        partyType: [],
        needNumInput: null,
        costInput: null,
        promisedDate: "未选择",
        promisedTime: "未选择",
        today: null,
        nextMonthDay: null
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
        const myAuthorization = wx.getStorageSync('Authorization')
        if (!myAuthorization) {
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
        const location = chooseLocation.getLocation();
        if (location) {
            // console.log(location)
            this.setData({
                mylocation: location
            })
        }
        const dateList = timeUtil.getTodayAndNextMonth(new Date())
        console.log(dateList)
        this.setData({
            today: dateList[0],
            nextMonthDay: dateList[1]
        })
        wx.stopPullDownRefresh()
    },

    addLabel() {
        if (this.data.partyType.length >= 5) {
            return
        }
        this.setData({
            showadd: true
        })
    },

    DelLabel(e) {
        this.data.partyType.splice(e.currentTarget.dataset.index, 1);
        this.setData({
            partyType: this.data.partyType
        })
    },


    chooseLocation() {
        const key = 'UQPBZ-HQDWW-U5FRD-RW6N7-P7DDJ-DCBH7'; //使用在腾讯位置服务申请的key
        const referer = '识食小程序'; //调用插件的app的名称
        var myCity = wx.getStorageSync('cityLocation')
        if (!myCity) {
            return
        }
        const location = JSON.stringify({
            latitude: myCity.location.latitude,
            longitude: myCity.location.longitude
        });
        const category = '美食';

        wx.navigateTo({
            url: 'plugin://chooseLocation/index?key=' + key + '&referer=' + referer + '&location=' + location + '&category=' + category
        });
    },

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
        if (this.data.textInput == e.detail.value) {
            return
        }
        this.setData({
            textInput: e.detail.value
        })
    },

    needNumInput(e) {
        if (this.data.needNumInput == e.detail.value) {
            return
        }
        this.setData({
            needNumInput: e.detail.value
        })
    },

    costInput(e) {
        if (this.data.costInput == e.detail.value) {
            return
        }
        this.setData({
            costInput: e.detail.value
        })
    },

    dateChange(e) {
        this.setData({
            promisedDate: e.detail.value
        })
    },
    timeChange(e) {
        this.setData({
            promisedTime: e.detail.value
        })
    },


    labelInput(e) {
        if (this.data.labelInput == e.detail.value) {
            return
        }
        this.setData({
            labelInput: e.detail.value
        })
    },

    leaveAdd() {
        const newlabel = this.data.labelInput
        console.log(newlabel)
        if (newlabel) {
            this.setData({
                partyType: this.data.partyType.concat(newlabel),
            })
        }
        this.setData({
            showadd: false,
            labelInput: ''
        })
    },

    justLeave() {
        this.setData({
            showadd: false,
            labelInput: ''
        })
    },

    // 内容输入
    textareaInput(e) {
        if (this.data.textareaInput == e.detail.value) {
            return
        }
        this.setData({
            textareaInput: e.detail.value
        })
    },
    //点击发布按钮事件
    publishBt: function () {

        const myAuthorization = wx.getStorageSync("Authorization");
        const self = this
        const mytitle = this.data.textInput
        const mycontent = this.data.textareaInput
        const mypartyType = this.data.partyType
        const mydatetime = timeUtil.formatTime(new Date());
        const theDate = this.data.promisedDate
        const theTime = this.data.promisedTime
        const promisedDateTime = theDate + ' ' + theTime
        const mylocation = this.data.mylocation
        const mycost = this.data.costInput
        const myneedNum = this.data.needNumInput
        const myImgList = self.data.imgList
        if (mytitle == '') {
            wx.showToast({
                icon: 'none',
                title: '请输入标题',
            })
            return
        }
        if (theDate == '未选择') {
            wx.showToast({
                icon: 'none',
                title: '请选择日期',
            })
            return
        }
        if (theTime == '未选择') {
            wx.showToast({
                icon: 'none',
                title: '请选择时间',
            })
            return
        }
        if (!mylocation) {
            wx.showToast({
                icon: 'none',
                title: '请选择地址',
            })
            return
        }
        if (myImgList.length == 0) {
            wx.showToast({
                icon: 'none',
                title: '请至少上传一张图片',
            })
            return
        }
        if (!myneedNum || myneedNum <= 1) {
            wx.showToast({
                icon: 'none',
                title: '请输入至少大于1的人数',
            })
            return
        }
        if (!mycost) {
            wx.showToast({
                icon: 'none',
                title: '请输入预计人均',
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
        if (mydatetime >= promisedDateTime) {
            wx.showToast({
                icon: 'none',
                title: '时间过期，请重新选择',
            })
            return
        }
        wx.showLoading({
            title: '发布中',
        })


        // 上传图片

        var resImgList = [];


        const addCloud = async function () {
            const db = wx.cloud.database()
            for (let i = 0; i < myImgList.length; i++) {
                const filePath = myImgList[i]
                const cloudPath = (Math.random() * 1000000) + "" + filePath.match(/\.[^.]+?$/)[0]
                await wx.cloud.uploadFile({
                    cloudPath,
                    filePath,
                }).then(res => {
                    console.log("似乎成功上传了图片")
                    resImgList.push(res.fileID)

                }).catch(res => {
                    console.log("异步失败！")
                    console.error
                    wx.showLoading({
                        title: '发布失败',
                    })
                })
            }

            if (resImgList.length != myImgList.length) {
                wx.showToast({
                    icon: "error",
                    title: '发布失败',
                    duration: 2000
                })
                return
            }
            db.collection('eatmeet').add({
                data: {
                    collectNum: 0,
                    commentNum: 0,
                    datetime: mydatetime,
                    content: mycontent,
                    Authorization: myAuthorization,
                    picture: resImgList,
                    title: mytitle,
                    partyType: mypartyType,
                    partyShopName: mylocation.name,
                    partyMaxUserNum: myneedNum,
                    partyCost: mycost,
                    userNum: 1,
                    DateTime: promisedDateTime,
                    partyLongitude: mylocation.longitude,
                    partyLatitude: mylocation.latitude,
                    partyAddress: mylocation.address,
                    partyProvince: mylocation.province,
                    partyCity: mylocation.city,
                    partyDistrict: mylocation.district,
                    costomerList: []
                }
            }).then(res => {
                console.log("成功添加数据")
                wx.showToast({
                    title: '发布成功',
                    icon: 'success',
                    success: function () {
                        setTimeout(function () {
                            wx.navigateBack({
                                delta: 1
                            })
                        }, 2000);
                    }
                })
            }).catch(res => {
                wx.showToast({
                    icon: "error",
                    title: '发布失败',
                    duration: 2000
                })
            })

        }
        addCloud()
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
        chooseLocation.setLocation(null);
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        this.setData({
            index: null,
            imgList: [],
            textInput: '',
            textareaInput: '',
            friendInput: '',
            mylocation: null,
            showadd: false,
            labelInput: '',
            partyType: []
        })
        this.onUnload()
        this.onShow()
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

    },

    //点选图片




})