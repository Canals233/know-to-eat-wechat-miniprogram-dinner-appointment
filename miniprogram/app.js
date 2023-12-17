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

		
	},
	globalData: {
		userInfo: null,
	},
});
