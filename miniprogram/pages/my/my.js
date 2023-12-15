Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		isLogin: true, // 默认显示登录表单
		userInfo: {
			userImg: null,
			userName: "",
		},

		authored: true,
	},
	//事件处理函数

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function () {},
	getUserProfile(e) {
		
		

		// if (userInfo) {
		// 	this.setData({
		// 		userInfo: userInfo,
		// 		// authored: userInfo.userEmail ? true : false,
		// 	});
		// 	// wx.setStorageSync("authored", userInfo.userEmail ? true : false);
		//     wx.setStorageSync("authored", true);
		// 	return;
		// }

		const url = "https://gpt.leafqycc.top:6660/user/QueryUser";

		wx.request({
			url: url,
			method: "POST",
			data: {
				userId: wx.getStorageSync("userId"),
			},
			// 可根据需要添加 Authorization 头部信息
			header: {
				Authorization: wx.getStorageSync("Authorization"),
			},
			success: (res) => {
				if (res.data.code) {
					const userInfo = res.data.data;
					console.log("查询自己user成功:", userInfo);
					const authored = true;
					this.setData({
						userInfo: userInfo,
						authored: authored,
					});
					wx.setStorageSync("userInfo", userInfo);
					wx.setStorageSync("authored", authored);
				} else {
					wx.showToast({
						title: "请求失败",
						icon: "none",
						duration: 2000,
					});
				}
			},
			fail: (error) => {
				console.error("Request user failed:", error);
			},
		});
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		console.log("on my  Show");
		this.getUserProfile();
	},

	toggleForm() {
		this.setData({
			isLogin: !this.data.isLogin,
		});
	},

	jumpUpdate() {
		console.log("try jump");
		wx.navigateTo({
			url: "/pages/updateInfo/updateInfo",
		});
	},

	mycollect: function (event) {
		wx.navigateTo({
			url: "/pages/mylike-star/mylike-star?state=" + "collect",
		});
	},
	mylike: function () {
		wx.navigateTo({
			url: "/pages/mylike-star/mylike-star?state=" + "like",
		});
	},
	mypublish: function (event) {
		wx.navigateTo({
			url: "/pages/mypublish/mypublish",
		});
	},
	mymeet() {
		wx.navigateTo({
			url: "/pages/mymeet/mymeet",
		});
	},
	mytalk() {
		wx.navigateTo({
			url: "/pages/talklist/talklist",
		});
	},
	mySetting() {
		wx.navigateTo({
			url: "/pages/updateInfo/updateInfo",
		});
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {
        console.log("on my  Hide");
    },

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {},
});
