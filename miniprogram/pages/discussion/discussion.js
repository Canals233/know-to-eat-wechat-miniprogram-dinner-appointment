// pages/discussion/discussion.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        articleList: [],
        userList: [],
        fade: false,
        filter: "",
        timer: null,
        inputShowed: false,
        clientHeight: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //一开始先得到文章们
        self = this;
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

    queryNote(options) {
        this.setData({
            fade: true,
        });
        wx.cloud.callFunction({
            name: "getArticle",
            data: {
                dbname: "articles",
                filter: options && options.filter ? options.filter : "",
            },
            success: function (res) {
                console.log(res);
                self.setData({
                    articleList: res.result.articleList.data,
                    userList: res.result.userList.data,
                });
                self.createOriginWaterfall();
            },
            fail: function (res) {
                wx.stopPullDownRefresh();
                wx.showToast({
                    icon: "none",
                    title: "暂无相关，您可以点击右下角向大家分享故事或想法",
                    duration: 3000,
                });
                console.log(res.errMsg);
                if (options.filter) {
                    self.queryNote();
                }
            },
            complete: function () {
                wx.stopPullDownRefresh();
                wx.hideLoading();
                self.setData({
                    fade: false,
                });
            },
        });
    },

    //后端版
    // queryNote(params) {
    // 	wx.request({
    // 		url: url,
    // 		method: "GET",
    // 		header: {
    // 			"Content-Type": "application/json",
    // 			Authorization: wx.getStorageSync("Authorization"),
    // 		},
    // 		data: JSON.stringify({
    // 			noteId: params?.noteId ?? 0,
    // 		}),
    // 		success: (res) => {
    // 			console.log("Request success:", res);
    // 			// 请求成功，将结果保存到 meetList 中
    // 			this.setData({
    // 				meetList: res.data,
    // 			});
    // 		},
    // 		fail: (error) => {
    // 			console.error("Request failed:", error);
    // 		},
    // 	});
    // },

    createOriginWaterfall() {
        this.waterfallRef = this.selectComponent("#waterfall");
        this.waterfallRef.run(
            [this.data.articleList, this.data.userList],
            () => { }
        );
    },

    topublish() {
        wx.navigateTo({
            url: "/pages/publish/publish?from=discussion",
        });
    },

    //点击前往文章内容详情

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
        this.queryNote();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () { },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.queryNote();
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
        this.queryNote();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () { },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () { },

    // bindChange: function(e) {
    //   console.log("滑动切换会触发的事件")
    //   var that = this;
    //   that.setData({
    //     currentTab: e.detail.current
    //   });
    // },
    // swichNav: function(e) {
    //   console.log("点击上方选项卡触发的事件")
    //   var that = this;
    //   if (this.data.currentTab === e.target.dataset.current) {
    //     return false;
    //   } else {
    //     that.setData({
    //       currentTab: e.target.dataset.current
    //     })
    //   }
    // },
});
