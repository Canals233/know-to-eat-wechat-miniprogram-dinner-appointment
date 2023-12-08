// pages/myarticle/myarticle.js
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		articleinfo: [],
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
		wx.cloud.callFunction({
			name: "getMyArticleList",
			data: {
				dbname: "articles",
				openid: wx.getStorageSync("useropenid"),
			},
			success: function (res) {
				wx.stopPullDownRefresh();
				wx.hideLoading({
					success: (res) => {},
				});
				self.setData({
					articleinfo: res.result.myarticleinfo.data,
				});
				console.log(self.data.articleinfo);
			},
			fail: function (res) {
				wx.showToast({
					title: "糟糕，获取失败了",
				});
				wx.stopPullDownRefresh();
				console.log(res.errMsg);
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
		let item = event.currentTarget.dataset.item;
		let id = item._id;

		wx.navigateTo({
			url: "../articles/articles?id=" + id,
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
