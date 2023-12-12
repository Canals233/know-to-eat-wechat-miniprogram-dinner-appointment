// pages/myarticle/myarticle.js
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		noteList: [],
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
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
	},

	getMylist() {
		self = this;
		wx.request({
			url: "https://gpt.leafqycc.top:6660/note/QuerySelfNote",
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
                    noteData.forEach((element) => {
                        element.noteTime = element.noteTime.substring(0, 20).replace(
							"T",
							" "
						);
                    });
					self.setData({
						noteList: noteData,
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
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		this.getMylist();
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
	viewItem: function (event) {
		let id = event.currentTarget.dataset.id;
		

		wx.navigateTo({
			url: "../articles/articles?noteId=" + id,
		});
	},
	publish: function (event) {
		wx.navigateTo({
			url: "../publish/publish?from=mypublish",
		});
	},
	onDeleteArticle: function (event) {
		var articledata = event.currentTarget.dataset.item;
		var articleindex = event.currentTarget.dataset.index;
		console.log(event.currentTarget.dataset);
		self = this;

		wx.showModal({
			title: "提示",
			content: "确认删除?",
			success(res) {
				if (res.confirm) {
					wx.showLoading({
						title: "加载中",
					});
					wx.cloud.callFunction({
						name: "deleteArticle",
						data: {
							articleid: articledata._id,
						},
						success: function (res) {
							console.log(res);
							if (res.result.msg == "ok") {
								wx.cloud.deleteFile({
									fileList: articledata.picture,
									success: (res) => {
										wx.showToast({
											icon: "none",
											title: "删除成功",
										}).then(self.onShow());
									},
									fail: (res) => {
										console.error;
									},
									complete: (res) => {
										wx.hideLoading({
											success: (res) => {},
										});
									},
								});
							} else {
								wx.showToast({
									icon: "none",
									title: "删除失败",
								});
							}
						},
						fail: function (res) {
							console.log(res);
						},
					});
				} else if (res.cancel) {
					console.log("用户点击取消");
				}
			},
		});
	},
});
