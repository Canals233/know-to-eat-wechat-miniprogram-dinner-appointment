const AppSecret = "b064f53d35b6f0564b8da361ba07bcdf";
const AppID = "wx09519e19cca807ee";

App({
	onLaunch() {
		// 展示本地存储能力
		const logs = wx.getStorageSync("logs") || [];
		logs.unshift(Date.now());
		wx.setStorageSync("logs", logs);

		wx.cloud.init({
			env: "know-to-eat-1guke3lkd453d421",
		});

		wx.login({
			success: (res) => {
			
				if (res.code) {
					// 如果成功获取到 code，可以将 code 发送到后端进行登录或其他操作
					// 构造请求 URL
					const url = "https://gpt.leafqycc.top:6660/login/WeChat";

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
								wx.setStorageSync(
									"Authorization",
									userInfo.JWT
								);
								wx.setStorageSync("userId", userInfo.userId);
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
	globalData: {
		userInfo: null,
	},
});
