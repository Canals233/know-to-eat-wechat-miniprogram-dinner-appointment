// pages/meetlist/meetlist.js
var timeUtil = require("../../utils/timeUtils");
const citySelector = requirePlugin("citySelector");

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		partys: [],
		city: "",
		filter: "",
		timer: null,
		inputShowed: false,
		clientHeight: 0,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function () {
		self = this;
		this.getCity();
		wx.showLoading({
			title: "加载中",
		});
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

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		this.queryParty();
		this.getCity();
	},

	queryParty() {
		const url = "https://food.texasoct.tech/party/QueryParty";

		const options = this.data;

		const params = {
			partyId: 0,
			partyTitle: options?.filter ?? "",
			partyType: options?.filter ?? "",
			partyCity: options?.city ?? "",
		};

		wx.request({
			url: url,
			method: "POST",
			header: {
				"Content-Type": "application/json",
				Authorization: wx.getStorageSync("Authorization"),
			},
			data: params,
			success: (res) => {
				if (res.data.code) {
					const partyData = res.data.data;
					console.log("查询成功:", partyData);
					const modifiedPartyData = partyData.map((item) => {
						// 使用解构赋值创建一个新对象，确保不修改原始数据
						const newItem = { ...item };

						// 修改 partyType 字符串
						if (newItem.partyType) {
							newItem.partyType = newItem.partyType.split(",");
						}
						if (newItem.partyOverdue) {
							newItem.partyOverdue = newItem.partyOverdue.replace(
								"T",
								" "
							); // 将 'T' 替换为空格
						}

						// 返回修改后的对象
						return newItem;
					});
					self.setData({
						partys: modifiedPartyData,
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
			complete: () => {
				wx.hideLoading();
				wx.stopPullDownRefresh();
			},
		});
	},

	chooseCity() {
		const key = "UQPBZ-HQDWW-U5FRD-RW6N7-P7DDJ-DCBH7"; //使用在腾讯位置服务申请的key
		const referer = "识食小程序"; // 调用插件的app的名称
		const hotCitys = "北京,上海,天津,重庆,广州,深圳,成都,杭州"; // 用户自定义的的热门城市

		wx.navigateTo({
			url: `plugin://citySelector/index?key=${key}&referer=${referer}&hotCitys=${hotCitys}`,
		});
	},

	onSearch(e) {
		console.log("search", e.detail.value);
		// 取出数据源
		this.setData({
			filter: e.detail.value,
		});
		wx.showLoading({
			title: "加载中",
		});
		this.queryParty();
	},

	getCity() {
		const selectedCityLocation = citySelector.getCity();

		const city =
			(selectedCityLocation && selectedCityLocation.fullname) ||
			(wx.getStorageSync("cityLocation") &&
				wx.getStorageSync("cityLocation").fullname) ||
			"";

		this.setData({
			city: city,
		});
		//如果选择了城市，就会显示当前城市
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
		this.queryParty();
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
