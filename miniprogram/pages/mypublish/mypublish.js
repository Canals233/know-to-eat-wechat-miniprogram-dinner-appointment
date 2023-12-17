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
			url: "https://food.texasoct.tech/note/QuerySelfNote",
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
						element.noteTime = element.noteTime
							.substring(0, 20)
							.replace("T", " ");
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
		let noteId = event.currentTarget.dataset.id;
		let noteindex = event.currentTarget.dataset.index;
		let userId = event.currentTarget.dataset.user;
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
					wx.request({
						url: "https://food.texasoct.tech/note/DeleteNote",
						method: "DELETE",
						header: {
							"Content-Type": "application/json",
							Authorization: wx.getStorageSync("Authorization"),
						},
						data: {
							noteId: noteId,
							userId: userId,
						},
						success: (res) => {
							console.log("删note:", res);
							if (res.data.data) {
								wx.showToast({
									title: "删除成功",
									icon: "success",
									duration: 2000,
								});
								let noteList = self.data.noteList;
								noteList.splice(noteindex, 1);
								self.setData({
									noteList: noteList,
								});
							} else {
								wx.showToast({
									title: "删除失败",
									icon: "none",
									duration: 2000,
								});
							}
						},
						fail: (error) => {
							console.error("删note failed:", error);
						},
					});
				} else if (res.cancel) {
					console.log("用户点击取消");
				}
			},
		});
	},
});
