// pages/meetlist/meetlist.js
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		meetList: [],
		userList: [],
		myopenid: wx.getStorageSync("useropenid"),
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		self = this;
		wx.showLoading({
			title: "加载中",
		});

		this.getMeet();
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
		wx.cloud.callFunction({
			name: "getMyJoin",
			data: {
				openid: this.data.myopenid,
			},
			success: (res) => {
				wx.stopPullDownRefresh();
				wx.hideLoading({
					success: (res) => {},
				});
				this.setData({
					meetList: res.result.meetList.data,
					userList: res.result.meetUserList.data,
				});
			},
			fail: (res) => {
				wx.showToast({
					title: "糟糕，获取失败了",
				});
				wx.stopPullDownRefresh();
				console.log(res.errMsg);
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
		console.log(e);
		const masterid = e.currentTarget.dataset.masterid;
		const costomerList = JSON.stringify(
			e.currentTarget.dataset.costomerlist
		);
		console.log(costomerList);
		if (masterid == this.data.myopenid) {
			wx.navigateTo({
				url:
					"/pages/secondtalk/secondtalk?id=" +
					e.currentTarget.dataset.id +
					"&costomerList=" +
					costomerList +
					"&title=" +
					e.currentTarget.dataset.title,
			});
		} else {
			wx.navigateTo({
				url:
					"/pages/talkDetail/talkDetail?id=" +
					e.currentTarget.dataset.id +
					"&masterid=" +
					masterid +
					"&title=" +
					e.currentTarget.dataset.title +
					"&costomerid=" +
					this.data.myopenid,
			});
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
	onPullDownRefresh: function () {
		this.onLoad();
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
