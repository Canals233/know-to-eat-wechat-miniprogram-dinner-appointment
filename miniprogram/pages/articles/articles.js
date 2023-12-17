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
		myauthored: wx.getStorageSync("authored"),
		commentDatas: [],
		commentText: "",
		userId: "",
		MyuserId: wx.getStorageSync("userId"),
		showDelete: false,
		showCommentDialog: false,
        showReplyDialog: false,
        replyCommentText: "",
        replyComment:{},
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
		const url = "https://food.texasoct.tech/note/QueryOneNote";
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
		const url = "https://food.texasoct.tech/user/QueryUser";

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
		const url = "https://food.texasoct.tech/comment/QueryComment";
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
			url: "https://food.texasoct.tech/note/GetLike",
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
			url: "https://food.texasoct.tech/note/GetCollection",
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
		if (!this.data.myauthored) {
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
				return "https://food.texasoct.tech/note/UncollectNote";
			} else {
				return "https://food.texasoct.tech/note/CollectionNote";
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
		if (!this.data.myauthored) {
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
				return "https://food.texasoct.tech/note/UnlikeNote";
			} else {
				return "https://food.texasoct.tech/note/LikeNote";
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
		if (!this.data.myauthored) {
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
		const url = "https://food.texasoct.tech/comment/CommentNote";
		wx.showLoading({
			title: "评论中",
		});
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
			complete: () => {
				wx.hideLoading();
				this.setData({
					commentText: "",
				});
			},
		});
	},

	showCommentDialog(e) {
        
		let showDelete = false;
        let currentComment = e.currentTarget.dataset.comment;
		if (
			currentComment.userId == this.data.MyuserId ||
			this.userData?.userId == this.data.MyuserId
		) {
			showDelete = true;
		}

		// 创建二级弹窗
		this.setData({
			showDelete: showDelete,
			showCommentDialog: true,
            replyComment: currentComment,
		});
	},

	closeCommentDialog() {
		this.setData({
			showCommentDialog: false,
            
		});
	},

	showDeleteTip(event) {
		self = this;
		const commentId = event.currentTarget.dataset.id;
		console.log("commentId", commentId);
		// 判断是否可以删除

		wx.showModal({
			title: "提示",
			content: "确定删除该评论吗？",
			success: (res) => {
				self.setData({
					showCommentDialog: false,
				});
				if (res.confirm) {
					// 用户点击确定执行删除操作
					wx.request({
						url: "https://food.texasoct.tech/comment/DeleteComment",
						method: "DELETE",
						header: {
							"Content-Type": "application/json",
							Authorization: wx.getStorageSync("Authorization"),
						},
						data: {
							noteId: +this.data.noteId,
							fatherId: 0,
							commentId: commentId,
						},
						success: (res) => {
							console.log("删评:", res);
							if (res.data.data) {
								this.queryComment(this.data.noteId);
								wx.showToast({
									title: "删除成功",
									icon: "success",
									duration: 2000,
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
							console.error("删评 failed:", error);
						},
					});
				}
			},
		});
	},
    showReplyDialog(event) {
   
        this.setData({
            showReplyDialog: true,
           
        });
    },
    onReplyInput(e){
        this.setData({
            replyCommentText: e.detail.value,
        });
    },

    onCancelReply(){
        this.setData({
            showReplyDialog: false,
            showCommentDialog: false,
        });
    },
    onReplySubmit(){
        const replyText = this.data.replyCommentText;
        if(!replyText){
            wx.showToast({
                title: "回复内容不能为空",
                icon: "none",
                duration: 2000,
            });
            return;
        }
        console.log(this.data.replyComment);
        let fatherId = this.data.replyComment.fatherId?this.data.replyComment.fatherId:this.data.replyComment.commentId;
        self=this
        wx.showLoading({
            title: "回复中",
        });
		wx.request({
			url: "https://food.texasoct.tech/comment/CommentNote",
			method: "POST",
			header: {
				Authorization: wx.getStorageSync("Authorization"),
				"Content-Type": "application/json",
			},
			data: {
				noteId: this.data.noteId,
                fatherId: fatherId,
                commentText: replyText,
                commentTime: new Date().toISOString(),
            
			},
			success: function (res) {
				console.log("回复评论:", res.data);
				// 处理回复评论成功的逻辑
				if (res.data.code) {
					
                    
				} else {
					wx.showToast({
						title: "获取数据失败",
						icon: "none",
						duration: 2000,
					});
				}
			},
			fail: function (error) {
				console.error("回复评论失败:", error);
			},
			complete: function () {
				wx.hideLoading();
                self.setData({
                    showReplyDialog: false,
                    showCommentDialog: false,
                    replyCommentText: "",
                });
			},
		});
    
    },

	//点击图片会发生的事情
	ViewImage(e) {
		console.log(e);
		wx.previewImage({
			urls: e.currentTarget.dataset.url,
			
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
