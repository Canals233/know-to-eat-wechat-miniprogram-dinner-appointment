// pages/publish/publish.js
var timeUtil = require("../../utils/timeUtils");
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		index: null,
		imgList: [],
		textInput: "",
		textareaInput: "",
		shopInput: "",
		noteType: [],
		from: "",
		Authorization: wx.getStorageSync("Authorization"),
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.setData({
			shopInput: "",
			from: options ? options.from : "",
			//from只会来自自己的评论和整个讨论
		});
		console.log(options);
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		const Authorization = this.data.Authorization;
		if (!Authorization) {
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
						wx.navigateBack({
							delta: 1,
						});
						wx.showToast({
							icon: "none",
							title: "您可以前往“我识”界面自行登录",
						});
					}
				},
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
	onPullDownRefresh: function () {},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {},

	//点选图片
	ChooseImage() {
		wx.chooseMedia({
			count: 1,
			sizeType: ["compressed"],
			sourceType: ["album"],
			success: (res) => {
				console.log(res, "choice res");
				this.setData({
					imgList: [res.tempFiles[0].tempFilePath],
				});
			},
		});
	},

	//点击显示选择的图片
	ViewImage(e) {
		wx.previewImage({
			urls: this.data.imgList,
			current: e.currentTarget.dataset.url,
		});
	},

	// 删除图片
	DelImg(e) {
		wx.showModal({
			title: "提示",
			content: "确定要删除这张图片吗？",
			cancelText: "再看看",
			confirmText: "删除",
			success: (res) => {
				if (res.confirm) {
					this.data.imgList.splice(e.currentTarget.dataset.index, 1);
					this.setData({
						imgList: this.data.imgList,
					});
				}
			},
		});
	},
	// 标题输入
	textInput(e) {
		if (this.data.textInput == e.detail.value) {
			return;
		}

		this.setData({
			textInput: e.detail.value,
		});
	},
	shopInput(e) {
		if (this.data.shopInput == e.detail.value) {
			return;
		}
		this.setData({
			shopInput: e.detail.value,
		});
	},
	// 内容输入
	textareaInput(e) {
		if (this.data.textareaInput == e.detail.value) {
			return;
		}
		this.setData({
			textareaInput: e.detail.value,
		});
	},

	addLabel() {
		if (this.data.noteType.length >= 5) {
			return;
		}
		this.setData({
			showadd: true,
		});
	},

	DelLabel(e) {
		this.data.noteType.splice(e.currentTarget.dataset.index, 1);
		this.setData({
			noteType: this.data.noteType,
		});
	},

	labelInput(e) {
		if (this.data.labelInput == e.detail.value) {
			return;
		}
		this.setData({
			labelInput: e.detail.value,
		});
	},

	leaveAdd() {
		const newlabel = this.data.labelInput;
		console.log(newlabel);
		if (newlabel) {
			this.setData({
				noteType: this.data.noteType.concat(newlabel),
			});
		}
		this.setData({
			showadd: false,
			labelInput: "",
		});
	},

	justLeave() {
		this.setData({
			showadd: false,
			labelInput: "",
		});
	},

	//点击发布按钮事件
	publishBt: function () {
		const self = this;
		const title = this.data.textInput;
		const content = this.data.textareaInput;
		const shop = this.data.shopInput;
		const datetime = timeUtil.formatTime(new Date());
		const ImgList = this.data.imgList.join(",");
		const NoteType = this.data.noteType.join(",");
		if (title == "") {
			wx.showToast({
				icon: "none",
				title: "请输入标题",
			});
			return;
		}
		if (ImgList.length == 0) {
			wx.showToast({
				icon: "none",
				title: "请上传一张图片",
			});
			return;
		}
		if (content == "") {
			wx.showToast({
				icon: "none",
				title: "请输入内容",
			});
			return;
		}

		const params = {
			noteTitle: title,
			noteText: content,
			noteTime: datetime,
			noteType: NoteType,
			noteShopName: shop,
		};
		console.log(params, "params");

		wx.showLoading({
			title: "发布中",
		});
		const url = "https://gpt.leafqycc.top:6660/note/PublishNote";
		wx.uploadFile({
			url: url,
			filePath: ImgList, //现在情况就是一个图片的url
			name: "name",
			header: {
				Authorization: this.data.Authorization,
			},
			formData: {
				formData: JSON.stringify(params),
			},
			success: (res) => {
				const JSONres = JSON.parse(res.data);
				console.log(JSONres, "jsonres");
				if (JSONres.code) {
					wx.showToast({
						title: "发布成功",
						icon: "success",
						duration: 2000,
					});
					setTimeout(() => {
						wx.navigateBack({
							delta: 1,
						});
					}, 2000);
				} else {
					wx.showToast({
						title: "发布失败",
						icon: "none",
						duration: 2000,
					});
				}
			},
			fail: (res) => {
				wx.showToast({
					title: "发布失败",
					icon: "none",
					duration: 2000,
				});
			},
			complete: () => {
				wx.hideLoading();
			},
		});
	},
});
