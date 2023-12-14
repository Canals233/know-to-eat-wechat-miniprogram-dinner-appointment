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
		const data = {
			avatar: this.data.avatar,
			username: this.data.username,
			signature: this.data.signature,
		};
        console.log(data)
        
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
