// pages/chatDetail/chatDetail.js

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		myAuthorization: wx.getStorageSync("Authorization"),

		
	
		title: null,
		chatlist: [],
        userId:wx.getStorageSync("userId"),
		clientHeight: null,
		
		textInput: "",
		
		partyId: null,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
	
		this.setData({
			partyId: options.id,
		});
		wx.getSystemInfo({
			success: (res) => {
				this.setData({
					clientHeight: res.windowHeight,
				});
			},
		});

		this.getNewChat();
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady() {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow() {},

	getNewChat() {
        self=this
		wx.request({
			url: "https://food.texasoct.tech/chat/QueryChat",
			method: "POST",
			header: {
				Authorization: wx.getStorageSync("Authorization"),
				"Content-Type": "application/json",
			},
			data: {
				partyId: this.data.partyId,
				chatId: 0,
			},
			success: function (res) {
				console.log("请求:", res.data);
				// 处理请求成功的逻辑
				if (res.data.code) {
					
                    self.setData({
                        chatlist:res.data.data
                    })
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

	onInput(e) {
		if (this.data.textInput == e.detail.value) {
			return;
		}
		this.setData({
			textInput: e.detail.value,
		});
	},

	sendChat() {
		const msg = this.data.textInput;
        self=this
		if (msg == "") {
			wx.showToast({
				icon: "none",
				title: "请输入内容",
			});
			return;
		}

		wx.request({
			url: "https://food.texasoct.tech/chat/PublicChat",
			method: "POST",
			header: {
				Authorization: wx.getStorageSync("Authorization"),
				"Content-Type": "application/json",
			},
			data: {
				partyId: this.data.partyId,
				chatText: msg,
				chatTime: new Date().toISOString()
			},
			success: function (res) {
				console.log("发布:", res.data);
				// 处理发布成功的逻辑
				if (res.data.code) {
					console.log("发布成功", res.data.data);
                    self.setData({
                        textInput:''
                    })
				} else {
					wx.showToast({
						title: "获取数据失败",
						icon: "none",
						duration: 2000,
					});
				}
			},
			fail: function (error) {
				console.error("发布失败:", error);
			},
			complete: function () {
				wx.hideLoading();
                self.getNewChat();
			},
		});
	},

	gotoShouldKnow() {
		wx.navigateTo({
			url: "/pages/shouldknow/shouldknow",
		});
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide() {},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload() {},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh() {
		this.getNewChat();
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom() {},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage() {},
});
