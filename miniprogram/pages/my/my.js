Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		isLogin: true, // 默认显示登录表单
		userInfo: {
			avatarUrl: null,
			nickName: "登录失败",
		},
		hasUserInfo: false,
		authored: false,
		meetNum: 0,
		articleNum: 0,
		useropenid: null,
	},
	//事件处理函数

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function () {
		self = this;
		// 已授权则在本地缓存获取数据
		wx.getSetting({
			success: (res) => {
				if (res.authSetting["scope.userInfo"]) {
					wx.getStorage({
						key: "lcuserInfo",
						success: (res) => {
							self.setData({
								hasUserInfo: true,
								authored: true,
								userInfo: res.data,
							});
						},
					});
				}
			},
		});

		this.getUserProfile();
	},
	getUserProfile(e) {
		if (this.data.hasUserInfo) {
			return;
		}

		// 没有就发起请求并设置本地缓存
		wx.getUserProfile({
			desc: "仅获取您的微信头像和昵称",
			success: (res) => {
				this.setData({
					userInfo: res.userInfo,
					hasUserInfo: true,
					authored: true,
				});
				console.log(res);
				wx.setStorage({
					key: "lcuserInfo",
					data: res.userInfo,
				});
				//在本地添加useropenid存储
				wx.cloud.callFunction({
					name: "login",
					success: (res) => {
						wx.setStorage({
							key: "useropenid",
							data: res.result.openid,
						});
						this.setData(
							{
								useropenid: res.result.openid,
							},
							() => {
								this.getNum();
							}
						);
					},
				});
				//云端添加数据库user中记录
				wx.cloud.callFunction({
					name: "addUser",
					data: {
						avatarUrl: res.userInfo.avatarUrl,
						nickName: res.userInfo.nickName,
					},
					success: function (res) {
						console.log(res);
					},
				});
			},
		});
	},

	toggleForm() {
		this.setData({
			isLogin: !this.data.isLogin,
		});
	},

	getNum() {
		wx.cloud.callFunction({
			name: "getUserInfoNum",
			data: {
				openid: this.data.useropenid,
			},
			success: (res) => {
				console.log(res);
				this.setData({
					meetNum: res.result.articleNum,
					articleNum: res.result.meetNum,
				});
			},
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

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		if (this.data.hasUserInfo) {
			this.getNum();
		}
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {},

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
