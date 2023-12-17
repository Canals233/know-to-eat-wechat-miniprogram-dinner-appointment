// pages/meetlist/meetlist.js
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		partyList: [],
		userList: [],
		myAuthorization: wx.getStorageSync("Authorization"),
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		self = this;
		wx.showLoading({
			title: "加载中",
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
		this.getMeet();
	},

	getMeet() {
		wx.request({
			url: "https://food.texasoct.tech/party/QuerySelfParty",
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
					const partyData = res.data.data;
					partyData.forEach((element) => {
						element.partyTime = element.partyTime
							.substring(0, 20)
							.replace("T", " ");
						element.partyType = element.partyType.split(",");
						element.partyOverdue = element.partyOverdue.replace(
							"T",
							" "
						);
					});
					self.setData({
						partyList: partyData,
					});
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

	toDetail(e) {
		console.log(e);
		const id = e.currentTarget.dataset.id;
		wx.navigateTo({
			url: "../meetDetail/meetDetail?id=" + id,
		});
	},

	toTalk(e) {
        console.log('to talk');
		wx.navigateTo({
			url:
				"/pages/talkDetail/talkDetail?id=" + e.currentTarget.dataset.id,
		});
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
