// pages/mymeet/mymeet.js
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		partys: [],
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		wx.showLoading({
			title: "加载中",
		});
		wx.getSystemInfo({
			success: (res) => {
				this.setData({
					clientHeight: res.windowHeight,
				});
			},
		});
		this.getMylist();
	},

	getMylist() {
		self = this;
		wx.request({
			url: "https://gpt.leafqycc.top:6660/party/QuerySelfCreateParty",
			method: "POST",
			header: {
				Authorization: wx.getStorageSync("Authorization"),
				"Content-Type": "application/json",
			},
			data: {},
			success: (res) => {
				// 请求成功，处理后端返回的数据，根据实际需求进行操作
				if (res.data.code) {
					const partyData = res.data.data;
				
					const modifiedPartyData = partyData.map((item) => {
						// 使用解构赋值创建一个新对象，确保不修改原始数据
						const newItem = { ...item };

						// 修改 partyType 字符串
						if (newItem.partyType) {
							newItem.partyType = newItem.partyType.split(",");
						}
						if (newItem.partyOverdue) {
							newItem.partyOverdue = newItem.partyOverdue.replace(
								"T",
								" "
							); // 将 'T' 替换为空格
						}

						// 返回修改后的对象
						return newItem;
					});
					self.setData({
						partys: modifiedPartyData,
					});
				} else {
					wx.showToast({
						title: "获取失败",
						icon: "none",
						duration: 2000,
					});
				}
			},
			fail: (error) => {
				console.error("查询失败:", error);
			},
			complete: () => {
				wx.hideLoading();
				wx.stopPullDownRefresh();
			},
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
	onPullDownRefresh: function () {
		this.onShow();
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {},
});
