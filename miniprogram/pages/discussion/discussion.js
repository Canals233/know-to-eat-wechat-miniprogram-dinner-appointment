// pages/discussion/discussion.js
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		noteList: [],
		userList: [],
		fade: false,
		filter: "",
		timer: null,
		inputShowed: false,
		clientHeight: 0,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function () {
		//一开始先得到文章们
		self = this;
	
		this.setData({
			filter: "",
		});
		wx.getSystemInfo({
			success: function (res) {
				self.setData({
					clientHeight: res.windowHeight,
				});
			},
		});
	},

	queryNote() {
        wx.showLoading({
            title: "加载中",
        });
		const options = this.data;

		const params = {
			noteId: 0,
			noteTitle: options?.filter ?? "",
			noteType: options?.filter ?? "",
		};

		wx.request({
			url: "https://food.texasoct.tech/note/QueryNote",
			method: "POST",
			header: {
				"Content-Type": "application/json",
				Authorization: wx.getStorageSync("Authorization"),
			},
			data: params,
			success: (res) => {
                console.log("查话题:", res);
				if (res.data.code) {
					const noteList = res.data.data;
					console.log("查话题成功:", noteList);
					this.setData({
						noteList: noteList,
					});
					this.createOriginWaterfall();
				} else {
					//没有就隐藏并报错
					wx.showToast({
						title: "数据加载失败",
						icon: "none",
						duration: 3000,
					});
				}
			},
			fail: (error) => {
				console.error("查话题 failed:", error);
			},
			complete: () => {
				wx.hideLoading();
				wx.stopPullDownRefresh();
			},
		});
	},

	createOriginWaterfall() {
		this.waterfallRef = this.selectComponent("#waterfall");
		this.waterfallRef.run(
			[this.data.noteList, this.data.userList],
			() => {}
		);
	},

	topublish() {
		wx.navigateTo({
			url: "/pages/publish/publish?from=discussion",
		});
	},

	//点击前往文章内容详情

	onSearch(e) {
		clearTimeout(this.data.timer);
		// 启动新的定时器

		this.data.timer = setTimeout(() => {
			filter = e.detail.value;
			this.setData({
                filter: filter,
            })
            this.queryNote();
		}, 800);
	},

	// 使文本框进入可编辑状态
	showInput: function () {
		this.setData({
			inputShowed: true, //设置文本框可以输入内容
		});
	},
	// 取消搜索
	hideInput: function () {
		this.setData({
			inputShowed: false,
		});
		this.queryNote();
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		this.queryNote();
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
		this.queryNote();
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {},

	// bindChange: function(e) {
	//   console.log("滑动切换会触发的事件")
	//   var that = this;
	//   that.setData({
	//     currentTab: e.detail.current
	//   });
	// },
	// swichNav: function(e) {
	//   console.log("点击上方选项卡触发的事件")
	//   var that = this;
	//   if (this.data.currentTab === e.target.dataset.current) {
	//     return false;
	//   } else {
	//     that.setData({
	//       currentTab: e.target.dataset.current
	//     })
	//   }
	// },
});
