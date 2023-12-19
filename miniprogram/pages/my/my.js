Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		userInfo: {
			userImg: null,
			userName: "",
		},
		userEmail: "",
		userCode: "",
		authored: true,
		time: 0,
	},
	//事件处理函数

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function () {},
	

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		console.log("on my  Show");
		this.foodLogin();
	},

	userEmailInput: function (e) {
		this.setData({
			userEmail: e.detail.value,
		});
	},
	userCodeInput: function (e) {
		this.setData({
			userCode: e.detail.value,
		});
	},

	submitEmail: function (e) {
		const url =
			"https://food.texasoct.tech/login/bindPwEmail?code=" +
			this.data.userCode;
		wx.showLoading({
			title: "绑定中",
		});
		wx.request({
			url: url,
			method: "POST",
			data: {
				userId: wx.getStorageSync("userId"),
				userEmail: this.data.userEmail,
				userPasswd: "",
			},

			header: {
				Authorization: wx.getStorageSync("Authorization"),
			},
			success: (res) => {
				if (res.data.code) {
					wx.showToast({
						title: "绑定成功",
						icon: "none",
						duration: 2000,
					});
					this.setData({
						authored: true,
					});
					wx.setStorageSync("authored", true);
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
			complete: () => {
				wx.hideLoading();
			},
		});
	},

	getVerificationCode() {
		// 发送wx.request请求
		if (!isEmail(this.data.userEmail)) {
			wx.showToast({
				title: "必须为邮箱格式",
				icon: "none",
				duration: 2000,
			});
			return;
		}
		wx.showLoading({
			title: "发送中",
		});
		wx.request({
			url:
				"https://food.texasoct.tech/login/getCheckCode?email=" +
				this.data.userEmail,
			method: "POST",
			success: (res) => {
				// 请求成功，开始倒计时
				console.log(res);
				if (res.data.code) {
					wx.showToast({
						title: "发送成功",
						icon: "none",
						duration: 2000,
					});
				} else {
					wx.showToast({
						title: "发送失败",
						icon: "none",
						duration: 2000,
					});
				}
				this.startCountdown();
			},
			complete: () => {
				wx.hideLoading();
			},
		});
	},

	startCountdown() {
		// 初始化计时器
		this.time = 60;
		this.timer = setInterval(() => {
			// 倒计时
			this.time--;

			// 更新倒计时文本
			this.setData({
				time: this.time,
			});

			// 倒计时结束，按钮可用
			if (this.time <= 0) {
				clearInterval(this.timer);
				this.setData({
					time: 0,
				});
			}
		}, 1000);
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

	foodLogin() {
		var that = this;
        if(wx.getStorageSync("authored") && !wx.getStorageSync("userChanged")){
            this.setData({
                authored: wx.getStorageSync("authored"),
                userInfo: wx.getStorageSync("userInfo"),
            });
            return;
        }
		wx.login({
			success: (res) => {
				if (res.code) {
					// 如果成功获取到 code，可以将 code 发送到后端进行登录或其他操作
					// 构造请求 URL
					const url = "https://food.texasoct.tech/login/WeChat";
					wx.showLoading({
						title: "登录中",
					});
					// 发送 POST 请求到后端
					wx.request({
						url: url,
						method: "POST",
						header: {
							"Content-Type": "application/json",
						},
						data: {
							code: res.code, // 直接使用 res.code 作为 userWechat 发送到后端
						},
						success: (res) => {
							console.log("登录:", res.data);
							if (res.data.code) {
								let userInfo = res.data.data;

								// 将 JWT 和 userId 保存到 Storage 中
								wx.setStorageSync(
									"Authorization",
									userInfo.JWT
								);
								wx.setStorageSync("userId", userInfo.userId);
								wx.request({
									url: "https://food.texasoct.tech/user/QueryUser",
									method: "POST",
									data: {
										userId: wx.getStorageSync("userId"),
									},
									// 可根据需要添加 Authorization 头部信息
									header: {
										Authorization:
											wx.getStorageSync("Authorization"),
									},
									success: (res) => {
										if (res.data.code) {
											const userInfo = res.data.data;
											console.log(
												"查询自己user成功:",
												userInfo
											);
											const authored = userInfo?.userEmail
												? true
												: false;
											that.setData({
												authored: authored,
                                                userInfo: userInfo,
											});
											wx.setStorageSync(
												"userInfo",
												userInfo
											);
											wx.setStorageSync(
												"authored",
												authored
											);
                                            wx.setStorageSync(
                                                "userChanged",
                                                false
                                            )
											if (!authored) {
												wx.showModal({
													title: "请先在 '我识' 界面绑定邮箱",
												});
											}
											// wx.showToast({
											// 	title: "登录成功",
											// 	icon: "success",
											// 	duration: 2000,
											// });
										} else {
											wx.showToast({
												title: "请求失败",
												icon: "none",
												duration: 2000,
											});
										}
									},
									fail: (error) => {
										console.error(
											"Request user failed:",
											error
										);
									},
								});
							} else {
								wx.showToast({
									title: res.data.msg,
									icon: "none",
									duration: 2000,
								});
							}
						},
						fail: (error) => {
							console.error("登录失败:", error);
						},
						complete: () => {
							wx.hideLoading();
						},
					});
				} else {
					console.error("wx.login 失败:", res.errMsg);
				}
			},
			fail: (error) => {
				console.error("wx.login 失败:", error);
			},
		});
	},
});

function isEmail(email) {
	// 正则表达式用于匹配邮箱地址
	const regex = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,4})+$/;
	return regex.test(email);
}
