// pages/meetDetail/meetDetail.js
var timeUtil = require("../../utils/timeUtils");
const db = wx.cloud.database();
const _ = db.command;
const str = "partyDetailData.userNum";
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		partyDetailData: {},
		userData: {},
		partyId: "",
		myAuthorization: wx.getStorageSync("Authorization"),
		party: {},
		checked: false,
		alreadyIn: false,
		master: false,
		outdate: true,
		full: false,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		const partyId = options.id;
		const userId = options.userId;

		this.setData({
			partyId: partyId,
			userId,
		});
		this.queryParty(partyId);
		this.queryUser(userId);
		this.checkUserCreatedParty(partyId);
	},

	queryParty(partyId) {
		const url = "https://gpt.leafqycc.top:6660/party/QueryOneParty";

		wx.request({
			url: url,
			method: "POST",
			header: {
				"Content-Type": "application/json",
				Authorization: wx.getStorageSync("Authorization"),
			},
			data: {
				partyId: partyId,
			},
			success: (res) => {
				if (res.data.code) {
					const partyDetailData = res.data.data;
					console.log("查询成功:", partyDetailData);

					// 修改 partyType 字符串
					if (partyDetailData.partyType) {
						partyDetailData.partyType =
							partyDetailData.partyType.split(",");
					}
					if (partyDetailData.partyOverdue) {
						partyDetailData.partyOverdue =
							partyDetailData.partyOverdue.replace("T", " "); // 将 'T' 替换为空格
					}
					// 获取当前时间
					const currentDate = new Date();

					// 将 partyOverdue 转换为 Date 对象
					const partyOverdueDate = new Date(
						partyDetailData.partyOverdue
					);

					// 比较时间
					const outdate = partyOverdueDate < currentDate;

					// 如果 outdate 为 true，表示已过期
					if (outdate) {
						console.log("已过期");
						// 在这里进行相关操作
					}

					// 将修改后的数据设置到 data 中
					this.setData({
						partyDetailData: partyDetailData,
						alreadyIn: partyDetailData.userInParty,
						outdate: outdate,
					});

					this.setData({
						partyDetailData: partyDetailData,
						alreadyIn: partyDetailData.userInParty,
					});
				} else {
					wx.showToast({
						title: "请求失败",
						icon: "none",
						duration: 2000,
					});
				}
			},
			fail: (error) => {
				console.error("Request failed:", error);
			},
		});
	},

	queryUser(userId) {
		const url = "https://gpt.leafqycc.top:6660/user/QueryUser";

		wx.request({
			url: url,
			method: "POST",
			data: {
				userId: userId,
			},
			// 可根据需要添加 Authorization 头部信息
			header: {
				Authorization: wx.getStorageSync("Authorization"),
			},
			success: (res) => {
				if (res.data.code) {
					const userData = res.data.data;
					console.log("查询user成功:", userData);
					this.setData({
						userData: userData,
					});
				} else {
					wx.showToast({
						title: "请求失败",
						icon: "none",
						duration: 2000,
					});
				}
			},
			fail: (error) => {
				console.error("Request user failed:", error);
			},
		});
	},

	checkUserCreatedParty(targetPartyId) {
		wx.request({
			url: "https://gpt.leafqycc.top:6660/party/QuerySelfCreateParty",
			method: "POST",
			header: {
				"Content-Type": "application/json",
				Authorization: wx.getStorageSync("Authorization"),
			},
			data: {},
			success: (res) => {
				if (res.data && res.data.code === 1) {
					// 查询成功，检查是否包含目标 partyId
					const hasTargetParty = res.data.data.some(
						(party) => party.partyId === targetPartyId
					);
					this.setData({
						master: hasTargetParty,
					});
				} else {
					console.error("查询失败或网络请求失败");
				}
			},
			fail: (error) => {
				console.error("网络请求失败:", error);
			},
		});
	},

	joinMeet() {
		if (!this.data.myAuthorization) {
			wx.showModal({
				cancelColor: "cancelColor",
				title: "您还未登录",
				content: "是否前往个人页面登录",
				success: function (res) {
					if (res.confirm) {
						wx.reLaunch({
							url: "/pages/my/my",
						});
					} else {
						wx.showToast({
							icon: "none",
							title: "您可以前往“我识”界面自行登录",
						});
					}
				},
			});
			return;
		}
		if (!this.data.checked) {
			wx.showToast({
				icon: "none",
				title: "请先阅读并同意《约饭须知》",
			});
			return;
		}
		wx.showModal({
			cancelColor: "cancelColor",
			title: "确定加入吗",

			success: (res) => {
				if (res.confirm) {
					wx.showLoading({
						title: "正在加入约饭",
					});

					wx.request({
						url: "https://gpt.leafqycc.top:6660/party/JoinParty",
						method: "POST",
						header: {
							"Content-Type": "application/json",
							Authorization: this.data.myAuthorization,
						},
						data: {
							partyId: this.data.partyId,
						},
						success: (res) => {
							if (res.data && res.data.code === 1) {
								wx.hideLoading();
								wx.showToast({
									title: "加入成功",
								});
								this.setData({
									alreadyIn: true,
								});
							} else {
								console.error(
									"加入饭局失败:",
									res.data ? res.data.msg : "未知错误"
								);
                                wx.showToast({
                                    icon: "error",
                                    title: "加入失败"+res.data.msg,
                                });
							}
						},
						fail: (error) => {
							console.error("网络请求失败:", error);
						},
					});
				}
			},
		});
	},

	leaveMeet() {
		wx.showModal({
			cancelColor: "cancelColor",
			title: "确定离开吗,如果您是发起者将解散该约饭",

			success: (res) => {
				if (res.confirm) {
					wx.showLoading({
						title: "正在退出约饭",
					});
					wx.cloud.callFunction({
						name: "costomerAndTalk",
						data: {
							id: this.data.partyId,
							costomerAuthorization: this.data.myAuthorization,
							state: "leave",
							masterAuthorization:
								this.data.partyDetailData.Authorization,
						},
						success: (res) => {
							console.log("调用", res);
							wx.hideLoading();
							wx.showToast({
								title: "退出成功",
							});

							this.setData({
								alreadyIn: false,
								[str]: this.data.partyDetailData.userNum - 1,
								full: false,
							});
						},
						fail: (error) => {
							console.log("调用错", error);
							wx.showToast({
								icon: "error",
								title: "退出失败",
							});
						},
					});
				}
			},
		});
	},
	deleteMeet() {
		wx.showModal({
			cancelColor: "cancelColor",
			title: "确定解散吗",

			success: (res) => {
				if (res.confirm) {
					wx.showLoading({
						title: "正在解散约饭",
					});
					wx.cloud.callFunction({
						name: "costomerAndTalk",
						data: {
							id: this.data.partyId,
							costomerAuthorization: this.data.myAuthorization,
							state: "delete",
							masterAuthorization:
								this.data.partyDetailData.Authorization,
						},
						success: (res) => {
							console.log("调用", res);
							wx.hideLoading();
							wx.showToast({
								title: "解散成功",
							});
							wx.navigateBack({
								delta: 1,
							});
						},
						fail: (error) => {
							console.log("调用错", error);
							wx.showToast({
								icon: "error",
								title: "解散失败",
							});
						},
					});
				}
			},
		});
	},

	gotoShouldKnow() {
		wx.navigateTo({
			url: "/pages/shouldknow/shouldknow",
		});
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {},

	ViewImage(e) {
		console.log(e);
		wx.previewImage({
			urls: this.data.partyDetailData.picture,
			current: e.currentTarget.dataset.url,
		});
	},

	checkChange(e) {
		this.setData({
			checked: !this.data.checked,
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
