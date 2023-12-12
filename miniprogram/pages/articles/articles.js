// pages/comments.js

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		CollectImgUrl: "/static/star.png",
		likeImgUrl: "/static/like.png",
		//自定义变量，存储详情信息
		noteDetailData: {},
		userData: {},
		noteId: "",
		isCollect: false,
		isLike: false,
		myAuthorization: wx.getStorageSync("Authorization"),
		commentDatas: [],
        commentText: "",
	},

	//页面加载
	onLoad(options) {
		var self = this;
		let noteId = options.noteId;
		let userId = options.userId;
		self.setData({
			noteId,
			userId,
		});

		this.queryNote(noteId);
		this.queryUser(userId);
		this.queryComment(noteId);
		this.isCollectAndLike(noteId);
	},

	queryNote(noteId) {
		const url = "https://gpt.leafqycc.top:6660/note/QueryOneNote";
		wx.request({
			url: url,
			method: "POST",
			header: {
				"Content-Type": "application/json",
				Authorization: wx.getStorageSync("Authorization"),
			},
			data: {
				noteId: noteId,
			},
			success: (res) => {
				if (res.data.code) {
					const noteDetailData = res.data.data;
					console.log("查询成功:", noteDetailData);

					// 修改 noteType 字符串
					if (noteDetailData.noteType) {
						noteDetailData.noteType =
							noteDetailData.noteType.split(",");
					}
					if (noteDetailData.noteTime) {
						noteDetailData.noteTime = noteDetailData.noteTime
							.slice(0, 19)
							.replace("T", " "); // 将 'T' 替换为空格
					}

					// 将修改后的数据设置到 data 中
					this.setData({
						noteDetailData: noteDetailData,
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

	queryComment(noteId) {
		const url = "https://gpt.leafqycc.top:6660/comment/QueryComment";
		wx.request({
			url: url,
			method: "POST",
			header: {
				"Content-Type": "application/json",
				Authorization: wx.getStorageSync("Authorization"),
			},
			data: {
				noteId: noteId,
				commentId: 0,
			},
			success: (res) => {
				if (res.data.code) {
					const commentDatas = res.data.data;
					console.log("查询评论成功:", commentDatas);

					commentDatas.forEach((commentData) => {
						if (commentData.commentTime) {
							commentData.commentTime =
								commentData.commentTime.replace("T", " "); // 将 'T' 替换为空格
						}
						if (commentData.fatherId === 0) {
							commentData.children = [];
						}
					});
					const fatherComments = [];
					commentDatas.forEach((commentData) => {
						if (commentData.fatherId !== 0) {
							// 如果有父评论，则找到父评论对象，将当前评论添加到父评论的 children 数组中
							const fatherComment = commentDatas.find(
								(item) =>
									item.commentId === commentData.fatherId
							);
							if (fatherComment) {
								fatherComment.children.push(commentData);
							}
						} else {
							// 如果没有父评论，则将当前评论添加到 fatherComments 数组中
							fatherComments.push(commentData);
						}
					});

					console.log("commentDatas", fatherComments);

					// 将修改后的数据设置到 data 中
					this.setData({
						commentDatas: fatherComments,
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
	//获取收藏状态
	isCollectAndLike(noteId) {
		wx.request({
			url: "https://gpt.leafqycc.top:6660/note/GetLike",
			method: "POST",
			header: {
				"Content-Type": "application/json",
				Authorization: wx.getStorageSync("Authorization"),
			},
			data: {
				noteId: noteId,
			},
			success: (res) => {
				console.log("查点赞:", res);
				if (res.data.data) {
					this.setData({
						isLike: true,
					});
				}
			},
			fail: (error) => {
				console.error("查点赞 failed:", error);
			},
		});
		wx.request({
			url: "https://gpt.leafqycc.top:6660/note/GetCollection",
			method: "POST",
			header: {
				"Content-Type": "application/json",
				Authorization: wx.getStorageSync("Authorization"),
			},
			data: {
				noteId: noteId,
			},
			success: (res) => {
				console.log("查收藏:", res);
				if (res.data.data) {
					this.setData({
						isCollect: true,
					});
				}
			},
			fail: (error) => {
				console.error("查收藏 failed:", error);
			},
		});
	},

	//点击收藏功能
	onCollect: function () {
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
		let collectState = this.data.isCollect;
		let collectionNum = this.data.noteDetailData.collectionNum;

		console.log("original state", collectState);
		this.setData({
			isCollect: !collectState,
			"noteDetailData.collectionNum": collectState
				? collectionNum - 1
				: collectionNum + 1,
		});
		//取消收藏
		function getColURL() {
			if (collectState) {
				return "https://gpt.leafqycc.top:6660/note/UncollectNote";
			} else {
				return "https://gpt.leafqycc.top:6660/note/CollectionNote";
			}
		}
		wx.request({
			url: getColURL(),
			method: collectState ? "DELETE" : "POST",
			header: {
				"Content-Type": "application/json",
				Authorization: wx.getStorageSync("Authorization"),
			},
			data: {
				noteId: this.data.noteId,
			},
			success: (res) => {
				console.log("收藏:", res.data.data);
			},
			fail: (error) => {
				console.error("收藏 failed:", error);
			},
		});
	},

	//点赞功能
	onLike: function () {
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
		let likeState = this.data.isLike;
		let likeNum = this.data.noteDetailData.likeNum;
		console.log("original state", this.data.isLike);
		this.setData({
			isLike: !this.data.isLike,
			"noteDetailData.likeNum": likeState ? likeNum - 1 : likeNum + 1,
		});
		function getColURL() {
			if (likeState) {
				return "https://gpt.leafqycc.top:6660/note/UnlikeNote";
			} else {
				return "https://gpt.leafqycc.top:6660/note/LikeNote";
			}
		}
		wx.request({
			url: getColURL(),
			method: likeState ? "DELETE" : "POST",
			header: {
				"Content-Type": "application/json",
				Authorization: wx.getStorageSync("Authorization"),
			},
			data: {
				noteId: this.data.noteId,
			},
			success: (res) => {
				console.log("点赞:", res.data.data);
			},
			fail: (error) => {
				console.error("点赞 failed:", error);
			},
		});
	},

    onInputComment: function (e) {
      
        this.setData({
            commentText: e.detail.value,
        });
    },

    onPublishComment: function (e) {
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
        const comment = this.data.commentText;
        console.log("comment", comment);
        if (!comment) {
            wx.showToast({
                title: "评论内容不能为空",
                icon: "none",
                duration: 2000,
            });
            return;
        }
        const url = "https://gpt.leafqycc.top:6660/comment/CommentNote";
        wx.request({
            url: url,
            method: "POST",
            header: {
                "Content-Type": "application/json",
                Authorization: wx.getStorageSync("Authorization"),
            },
            data: {
                noteId: this.data.noteId,
                fatherId: 0,
                commentText: comment,
                commentTime: new Date().toISOString(),
            },
            success: (res) => {
                console.log("评论成功:", res);
                if (res.data.code) {
                    wx.showToast({
                        title: "评论成功",
                        icon: "success",
                        duration: 2000,
                    });
                    this.queryComment(this.data.noteId);
                } else {
                    wx.showToast({
                        title: "评论失败",
                        icon: "none",
                        duration: 2000,
                    });
                }
            },
            fail: (error) => {
                console.error("评论 failed:", error);
            },
        });
    },
    


	//点击图片会发生的事情
	ViewImage(e) {
		console.log(e);
		wx.previewImage({
			urls: this.data.noteDetailData.picture,
			current: e.currentTarget.dataset.url,
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
