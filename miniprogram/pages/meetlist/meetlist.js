// pages/meetlist/meetlist.js
var timeUtil = require('../../utils/timeUtils');
const citySelector = requirePlugin("citySelector");

const mockList = [
    {
        partyId: 15,
        userId: 2,
        userNum: 1,
        partyTitle: "吃火锅4",
        partyText: "冬天到了,正适合吃火锅",
        partyImg: "Fw7YDyFZRNXVVtlYQotd6N4PrOqrn1Fu",
        partyNum: 2,
        partyTime: "2023-08-15T18:00:00",
        partyOverdue: "2023-08-26T23:00:00",
        partyType: "火锅,冬季",
        partyLongitude: 39.7306,
        partyLatitude: 38.9352,
        partyPermissions: 1,
    },
    {
        partyId: 11,
        userId: 2,
        userNum: 1,
        partyTitle: "吃火锅1",
        partyText: "冬天到了,正适合吃火锅",
        partyImg: "xnlM5XpKMJUEQbP0l9t55Ipwbxv6QyHP",
        partyNum: 1,
        partyTime: "2023-08-15T18:00:00",
        partyOverdue: "2023-08-26T23:00:00",
        partyType: "火锅,冬季",
        partyLongitude: 39.7306,
        partyLatitude: 38.9352,
        partyPermissions: 1,
    },
];
Page({
    /**
     * 页面的初始数据
     */
    data: {
        meetList: [],
        city: "",
        filter: "",
        timer: null,
        inputShowed: false,
        clientHeight: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        self = this;
        this.getCity();
        wx.showLoading({
            title: "加载中",
        });
        this.setData({
            filter: "",
        });
        wx.getSystemInfo({
            success: function (res) {
                self.setData({
                    clientHeight: res.windowHeight,
                });
            },
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () { },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.queryParty();
        // this.getCity();
    },

    queryParty(options) {

        wx.cloud.callFunction({
            name: "getArticle",
            data: {
                dbname: "eatmeet",
                filter: options && options.filter ? options.filter : "",
            },
            success: function (res) {
                wx.stopPullDownRefresh();
                wx.hideLoading();
                console.log(res);
                let oriMeetList = res.result.articleList.data;
                let oriUserList = res.result.userList.data;
                let resMeetList = [],
                    resUserList = [];
                let filter = self.data.city;
                for (let i = 0; i < oriMeetList.length; i++) {
                    if (timeUtil.wxjudgeTime(oriMeetList[i].DateTime)) {
                        if (oriMeetList[i].city != filter && filter) {
                            continue;
                        }
                        resMeetList.push(oriMeetList[i]);
                        resUserList.push(oriUserList[i]);
                    }
                }
                self.setData({
                    meetList: resMeetList,
                    userList: resUserList,
                });
            },
            fail: function (res) {
                wx.stopPullDownRefresh();
                wx.showToast({
                    icon: "none",
                    title: "暂无相关",
                    duration: 3000,
                });
                console.log(res.errMsg);
                if (options.filter) {
                    self.getArticle();
                }
            },
        });
    },

    // queryParty(params) {
    // 	// 构造请求 URL
    // 	const url = "https://gpt.leafqycc.top:6660/party/QueryParty";

    // 	// console.log(wx.getStorageSync("Authorization"))
    // 	// 发送 GET 请求
    // 	wx.request({
    // 		url: url,
    // 		method: "GET",
    // 		header: {
    // 			"Content-Type": "application/json",
    // 			Authorization: wx.getStorageSync("Authorization"),
    // 		},
    // 		data: JSON.stringify({
    // 			partyId: params?.partyId ?? 0,
    // 		}),
    // 		success: (res) => {
    //             console.log("Request res:", res.data);

    // 			if (true || res.data.code) {
    // 				this.setData({
    // 					meetList: mockList,
    // 				});
    //                 wx.hideLoading()
    //                 wx.stopPullDownRefresh()

    // 				// this.setData({
    // 				// 	meetList: res.data,
    // 				// });
    // 			}
    //             else{
    //                 wx.showToast({
    //                     title: "请求失败",
    //                     icon: "none",
    //                     duration: 2000,
    //                 });
    //             }
    // 		},
    // 		fail: (error) => {
    // 			console.error("Request failed:", error);
    // 		},
    // 	});
    // },

    chooseCity() {
        const key = "UQPBZ-HQDWW-U5FRD-RW6N7-P7DDJ-DCBH7"; //使用在腾讯位置服务申请的key
        const referer = "识食小程序"; // 调用插件的app的名称
        const hotCitys = "北京,上海,天津,重庆,广州,深圳,成都,杭州"; // 用户自定义的的热门城市

        wx.navigateTo({
            url: `plugin://citySelector/index?key=${key}&referer=${referer}&hotCitys=${hotCitys}`,
        });
    },

    ViewImage(e) {
        console.log(e);
        wx.previewImage({
            urls: e.currentTarget.dataset.urls,
        });
    },

    toMeetDetail(e) {
        console.log(e);
        wx.navigateTo({
            url:
                "/pages/meetDetail/meetDetail?id=" + e.currentTarget.dataset.id,
        });
    },

    onSearch(e) {
        clearTimeout(this.data.timer);
        // 启动新的定时器

        this.data.timer = setTimeout(() => {
            // 取出搜索的值
            let options = {
                filter: "",
            };
            options.filter = e.detail.value;
            // 取出数据源
            this.onLoad(options);
        }, 800);
    },

    getCity() {
        const selectedCityLocation = citySelector.getCity();

        const city =
            (selectedCityLocation && selectedCityLocation.fullname) ||
            (wx.getStorageSync("cityLocation") && wx.getStorageSync("cityLocation").fullname) ||
            "";


        this.setData({
            city: city,
        });
        //如果选择了城市，就会显示当前城市
    },

    // 使文本框进入可编辑状态
    showInput: function () {
        this.setData({
            inputShowed: true, //设置文本框可以输入内容
        });
    },
    // 取消搜索
    hideInput: function () {
        this.setData({
            inputShowed: false,
        });
        this.queryParty();
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () { },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () { },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        this.queryParty();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () { },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () { },
});
