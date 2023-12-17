// pages/updateInfo/updateInfo.js
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		avatar: "",
		username: "",
		signature: "",
        avatarChanged: false,
        contentChanged: false,
	},

	

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
        let userInfo =  wx.getStorageSync("userInfo");
        console.log(userInfo)
        this.setData({
            avatar:userInfo.userImg,
            username:userInfo.userName,
            signature:userInfo.userSignature
        })
    },

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady() {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow() {},

    usernameInput: function (e) {
		this.setData({
			username: e.detail.value,
            contentChanged:true
		});
	},

	signatureInput: function (e) {
		this.setData({
			signature: e.detail.value,
            contentChanged:true,
            avatarChanged:true
		});
	},
    ChooseImage: function () {
        wx.chooseMedia({
			count: 1,
			sizeType: ["compressed"],
			sourceType: ["album"],
			success: (res) => {
				console.log(res, "choice res");
				this.setData({
					avatar:res.tempFiles[0].tempFilePath,
                    contentChanged:true,
				});
			},
		});
    },

	submit: function () {
		// 将输入框的内容存储到数据中
		const params = {
			avatar: this.data.avatar,
			userName: this.data.username,
			userTxt: this.data.signature,
		};

        wx.showLoading({
            title: "正在修改信息",
            mask: true,
        });
        
        const url = "https://food.texasoct.tech/user/Update";
    
		wx.uploadFile({
			url: url,
			filePath: this.data.avatar, //现在情况就是一个图片的url
			name: "name",
			header: {
				Authorization: wx.getStorageSync("Authorization"),
			},
			formData: {
				formData: JSON.stringify(params),
			},
			success: (res) => {
				const JSONres = JSON.parse(res.data);
				console.log(JSONres, "jsonres");
				if (JSONres.code) {
					wx.showToast({
						title: "修改信息成功",
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
						title: "修改信息失败",
						icon: "none",
						duration: 2000,
					});
				}
			},
			fail: (res) => {
				wx.showToast({
					title: "完全修改信息失败",
					icon: "none",
					duration: 2000,
				});
			},
			complete: () => {
				wx.hideLoading();
			},
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
	onPullDownRefresh() {},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom() {},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage() {},
});
