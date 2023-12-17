// pages/mylike-star/mylike-star.js
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		noteList: [],
		userList: [],
		clientHeight: 0,
		state: null,
		likeflag: null,
		Authorization: wx.getStorageSync("Authorization"),
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		self = this;
		wx.showLoading({
			title: "加载中",
		});
		wx.getSystemInfo({
			success: function (res) {
				self.setData({
					clientHeight: res.windowHeight,
				});
			},
		});
		const mystate = options.state;
		this.setData({
			state: mystate,
			likeflag: mystate == "like" ? true : false,
		});
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady() {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow() {
		this.queryNote();
	},

	getRequestUrl: function (state) {
		let baseUrl = "https://food.texasoct.tech";
		if (state === "like") {
			return baseUrl + "/note/QueryLikeNote";
		} else if (state === "collect") {
			return baseUrl + "/note/QueryColNote";
		}
	},
	queryNote() {
		const mystate = this.data.state;
		const requestUrl = this.getRequestUrl(mystate);
        wx.showLoading({
            title: "加载中",
        });
		wx.request({
			url: requestUrl,
			method: "POST",
            header: {
                Authorization: wx.getStorageSync("Authorization"),
                "Content-Type": "application/json",
            },
            data: {},
			success: function (res) {
				console.log("请求:", res.data);
				// 处理请求成功的逻辑
                if (res.data.code) {
                    const noteData = res.data.data;
                    
                    self.setData({
                        noteList: noteData,
                    });
                    self.createOriginWaterfall();
                } else {
                    wx.showToast({
                        title: "获取数据失败",
                        icon: "none",
                        duration: 2000,
                    });
                }
			},
			fail: function (error) {
				console.error("请求失败:", error);
			},
            complete: function () {
                wx.hideLoading();
            },
		});
	},

	createOriginWaterfall() {
		this.waterfallRef = this.selectComponent("#waterfall");
		this.waterfallRef.run(
			[this.data.noteList, this.data.userList],
			() => {}
		);
	},
	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide() {},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload() {},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh() {},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom() {},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage() {},
});
