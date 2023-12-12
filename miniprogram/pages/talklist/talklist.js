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
		wx.request({
			url: "https://gpt.leafqycc.top:6660/party/QuerySelfParty",
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
                        element.partyTime = element.partyTime.substring(0, 20).replace(
							"T",
							" "
						);
                        element.partyType=element.partyType.split(",")
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
		console.log(e);
		const masterid = e.currentTarget.dataset.masterid;
		const costomerList = JSON.stringify(
			e.currentTarget.dataset.costomerlist
		);
		console.log(costomerList);
		if (masterid == this.data.myAuthorization) {
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
					this.data.myAuthorization,
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
