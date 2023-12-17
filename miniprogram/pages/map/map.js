// pages/map/map.js
var timeUtil = require("../../utils/timeUtils");
const { isEmptyObject } = require("../../utils/utils");
const citySelector = requirePlugin("citySelector");
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		scale: 9,
		wh: "",
		ww: "",
		authored: wx.getStorageSync("authored"),
		markers: [],
		searchSourse: [],
		search: [],
		marker: {},
		lastMarker: {},
		longitude: 104.066128,
		latitude: 30.572924,
		viewshow: false,
		// listshow: false,
		searchshow: false,
		timer: null,
		cityChose: false,
		authorized: false,
		maypublish: false,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		const res = wx.getSystemInfoSync();

		this.setData({
			wh: res.windowHeight + "px",
			ww: res.windowWidth + "px",
		});
		this.mapCtx = wx.createMapContext("map");

		//记得改成按城市来获取地图，默认加载成都
	},

	AuthorizeLocate: function () {
		var that = this;
		wx.authorize({
			scope: "scope.userLocation", //发起定位授权
			success: function () {
				console.log("有定位授权");
				that.setData({
					authorized: true,
				});
				that.chooseCity();
			},
			fail() {
				//如果用户拒绝授权，则要告诉用户不授权就不能使用，引导用户前往设置页面。
				console.log("没有定位授权");
				wx.showModal({
					cancelColor: "cancelColor",
					title: "没有授权无法完整使用本小程序",
					content: "是否前往设置页面手动开启",
					success: function (res) {
						if (res.confirm) {
							wx.openSetting({
								withSubscriptions: true,
							});
						} else {
							wx.showToast({
								icon: "none",
								title: "您取消了定位授权",
							});
						}
					},
					fail: function (e) {
						console.log(e);
					},
				});
			},
		});
	},

	AuthorizeLogin: function () {
		var that = this;
		wx.authorize({
			scope: "scope.userInfo", //发起登录授权
			success: function () {
				console.log("有登录授权");
				that.foodLogin();
			},
			fail() {
				//如果用户拒绝授权，则要告诉用户不授权就不能使用，引导用户前往设置页面。
				console.log("没有登录授权");
				wx.showModal({
					cancelColor: "cancelColor",
					title: "没有授权无法完整使用本小程序",
					content: "是否前往设置页面手动开启",
					success: function (res) {
						if (res.confirm) {
							wx.openSetting({
								withSubscriptions: true,
							});
						} else {
							wx.showToast({
								icon: "none",
								title: "您取消了登录授权",
							});
						}
					},
					fail: function (e) {
						console.log(e);
					},
				});
			},
		});
	},

	foodLogin() {
		wx.login({
			success: (res) => {
				if (res.code) {
					// 如果成功获取到 code，可以将 code 发送到后端进行登录或其他操作
					// 构造请求 URL
					const url = "https://food.texasoct.tech/login/WeChat";

					// 发送 POST 请求到后端
					wx.request({
						url: url,
						method: "POST",
						header: {
							"Content-Type": "application/json",
						},
						data: {
							code: res.code, // 直接使用 res.code 作为 userWechat 发送到后端
						},
						success: (res) => {
							console.log("登录:", res.data);
							if (res.data.code) {
								let userInfo = res.data.data;

								const authored = userInfo.userEmail
									? true
									: false;
								this.setData({
									authored: authored,
								});
								wx.setStorageSync(
									"Authorization",
									userInfo.JWT
								);
								wx.setStorageSync("userId", userInfo.userId);
								wx.setStorageSync("userInfo", userInfo);
								wx.setStorageSync("authored", authored);
								if (!authored) {
									wx.showModal({
										title: "您需要绑定邮箱才能完整使用本小程序",
										content: "请前往我识绑定邮箱",
										success: function (res) {
											// if (res.confirm) {
											// 	wx.navigateTo({
											// 		url: "/pages/my/my",
											// 	});
											// } else {
											// 	wx.showToast({
											// 		icon: "none",
											// 		title: "您取消了登录授权",
											// 	});
											// }
										},
										fail: function (e) {
											console.log(e);
										},
									});
								}
							} else {
								wx.showToast({
									title: res.data.msg,
									icon: "none",
									duration: 2000,
								});
							}
						},
						fail: (error) => {
							console.error("登录失败:", error);
						},
					});
				} else {
					console.error("wx.login 失败:", res.errMsg);
				}
			},
			fail: (error) => {
				console.error("wx.login 失败:", error);
			},
		});
	},

	chooseCity() {
		const key = "UQPBZ-HQDWW-U5FRD-RW6N7-P7DDJ-DCBH7"; //使用在腾讯位置服务申请的key
		const referer = "know-to-eat"; // 调用插件的app的名称
		const hotCitys = "北京,上海,天津,重庆,广州,深圳,成都,杭州"; // 用户自定义的的热门城市

		wx.navigateTo({
			url: `plugin://citySelector/index?key=${key}&referer=${referer}&hotCitys=${hotCitys}`,
		});
	},

	getCity() {
		const selectedCityLocation = citySelector.getCity();

		var lastCity = wx.getStorageSync("cityLocation");

		if (selectedCityLocation) {
			this.setData({
				cityChose: true,
			});
		}
		//如果新选择的城市有且与原来的不同
		var flag = true;
		if (selectedCityLocation && lastCity) {
			if (
				selectedCityLocation.location.longitude ==
					lastCity.location.longitude &&
				selectedCityLocation.location.latitude ==
					lastCity.location.latitude
			) {
				flag = false;
			}
		}
		console.log(selectedCityLocation, lastCity);
		if (flag) {
			wx.setStorageSync("cityLocation", selectedCityLocation);

			this.setData({
				longitude: selectedCityLocation
					? selectedCityLocation.location.longitude
					: 104.066128,
				latitude: selectedCityLocation
					? selectedCityLocation.location.latitude
					: 30.572924,
			});

			this.getmap();
			this.moveToLocation();
		}
	},
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function (e) {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		const that = this;

		wx.getSetting({
			success(res) {
				const author = "scope.userLocation";
				if (res.authSetting[author]) {
					that.setData({
						authorized: true,
					});
				}
			},
		});

		const myCity = wx.getStorageSync("cityLocation");
		// console.log(myCity)
		if (myCity) {
			this.setData({
				cityChose: true,
			});
		}

		if (this.data.authorized) {
			this.getCity();
		}
		if (this.data.maypublish) {
			this.setData({
				maypublish: false,
			});
			this.getmap();
		}
		this.getmap();
	},

	//点击search图片
	tapSearchBtn(e) {
		if (this.data.viewshow) {
			this.closeshow();
		}
		this.setData({
			searchshow: !this.data.searchshow,
			search: [],
		});
	},

	//中心点重定位
	moveToLocation: function () {
		const that = this;
		console.log("moveToLocation", this.data);
		this.mapCtx.moveToLocation({
			longitude: that.data.longitude,
			latitude: that.data.latitude,
		});
	},

	//地图标点的点击事件
	markertaper(e) {
		// console.log(e)
		this.setData({
			searchshow: false,
		});

		if (this.data.marker.id == e.detail.markerId) {
			this.setData({
				viewshow: !this.data.viewshow,
			});
		} //有了就把他隐藏
		else {
			//没有则指定一个marker去存数据库的数据
			let marker = this.data.markers.find((item) => {
				return item.id == e.detail.markerId;
			});

			this.designateMarker(marker);
		}
		this.markerChangeColour();
		//给他转个色
	},

	markerChangeColour() {
		//更改图标颜色
		if (this.data.viewshow) {
			if (this.data.marker) {
				let str = "markers[" + this.data.marker.id + "].iconPath";
				this.setData({
					[str]: "/static/marker-active.png",
				});
			}
			if (
				this.data.lastMarker &&
				this.data.lastMarker.id != this.data.marker.id
			) {
				let str = "markers[" + this.data.lastMarker.id + "].iconPath";
				try {
					this.setData({
						[str]: "/static/marker.png",
					});
				} catch (error) {
					console.log(error);
				}
			}
		} else {
			if (!isEmptyObject(this.data.marker)) {
				let str = "markers[" + this.data.marker.id + "].iconPath";
				this.setData({
					[str]: "/static/marker.png",
				});
			}
		}
	},

	designateMarker(marker) {
		// console.log(marker,"marker是否存在")
		if (!marker) {
			this.setData({
				viewshow: false,
			}); //没有就隐藏并报错
			wx.showToast({
				title: "数据加载失败",
				icon: "none",
				duration: 3000,
			});
		} else {
			//有就把他显示出来
			this.setData({
				lastMarker: this.data.marker,
				marker: marker,
				viewshow: true,
			});
		}
	}, //指定一个新的marker

	closeshow() {
		console.log("closeview");
		this.setData({
			viewshow: false,
		});
		this.markerChangeColour();
	}, //关掉弹出的描述

	goToMeet(e) {
		wx.navigateTo({
			url:
				"/pages/meetDetail/meetDetail?id=" +
				e.currentTarget.dataset.marker.content.partyId,
		});
	},

	closesearch() {
		console.log("closesearch");
		this.setData({
			searchshow: !this.data.searchshow,
		});
	}, //关掉弹出的搜索

	//i!!! 获取地图数据
	getmap() {
		var mapresult;
		var self = this;
		var remarkers = [];
		const url = "https://food.texasoct.tech/party/QueryParty";
		this.closeshow();
		//得到地图数据的index
		const myCity = wx.getStorageSync("cityLocation");
		// console.log(myCity)
		wx.request({
			url: url,
			method: "POST",
			header: {
				"Content-Type": "application/json",
				Authorization: wx.getStorageSync("Authorization"),
			},
			data: {
				partyId: 0,
			},
			success: (res) => {
				console.log("饭局查询res:", res.data);
				if (res.data.code) {
					const partyData = res.data.data;
					console.log("查询成功:", partyData);
					// 处理第一个逻辑
					const modifiedPartyData = partyData.map((item) => {
						const newItem = { ...item };

						newItem.partyType = newItem.partyType.split(",");

						newItem.partyOverdue = newItem.partyOverdue.replace(
							"T",
							" "
						);

						newItem.longitude = newItem.partyLongitude;
						delete newItem.partyLongitude;

						newItem.latitude = newItem.partyLatitude;
						delete newItem.partyLatitude;

						return newItem;
					});

					// 处理第二个逻辑
					var sourse = [];
					var cnt = 0;
					for (let e in modifiedPartyData) {
						if (
							!timeUtil.wxjudgeTime(
								modifiedPartyData[e].partyOverdue
							)
						) {
							continue;
						}
						self.createmarkers(
							modifiedPartyData[e],
							cnt++,
							remarkers
						);
						let searchKey = {};
						searchKey.partyShopName =
							modifiedPartyData[e].partyShopName;
						searchKey.partyTitle = modifiedPartyData[e].partyTitle;
						sourse.push(searchKey);
					}

					console.log("remarkers", remarkers);

					self.setData({
						markers: remarkers,
						searchSourse: sourse,
					});
				} else {
					console.log("查询失败:", res.data.msg);
				}
			},
			fail: (error) => {
				console.error("Request failed:", error);
			},
		});
	},
	//给getmap用的，用于创建新的marker点集合
	createmarkers(party, e, remarkers) {
		let remarker = {
			iconPath: "/static/marker.png",
			width: 20,
			height: 20,
			id: +e,
			joinCluster: true,
			callout: {
				content: "",
				borderWidth: 0,
			},
			content: {},
		};
		let partyKeys = Object.keys(party);
		let partyValues = Object.values(party);
		for (let i in partyKeys) {
			let k = partyKeys[i];
			let v = partyValues[i];
			if (k == "longitude" || k == "latitude") {
				remarker[k] = v;
			} else {
				remarker.content[k] = v;
			}
		}
		remarkers.push(remarker);
	},

	//点击发布约饭发生的事情
	addmeet() {
		this.setData({
			maypublish: true,
		});
		wx.navigateTo({
			url: "/pages/addmeet/addmeet",
		});
	},

	//搜索框事件们
	onSearch(e) {
		clearTimeout(this.data.timer);
		// 启动新的定时器
		this.data.timer = setTimeout(() => {
			// 取出搜索的值
			let search = e.detail.value;
			// 取出数据源
			let searchSourse = this.data.searchSourse;
			// 判断搜索值是否为空
			if (search == "") {
				// 为空返回一个空数组
				return this.setData({ search: [] });
			}
			// 创建正则对象
			let reg = new RegExp(search, "i");
			// 定义一个容器接收数据源
			let res = [];
			// 循环

			res = searchSourse.filter((item, key) => {
				// 返回通过正则的数据

				return reg.test(item.partyShopName);
			});
			//  console.log("搜索结果",res)
			// 将结果刷新至视图层
			this.setData({ search: res });
		}, 800);
	},

	//点击搜索结果时候发生的事情
	tapRes(e) {
		console.log(e);
		let target = e.currentTarget.dataset.item.title;
		// console.log("searchRestap")
		this.setData({
			searchshow: false,
		});
		if (this.data.marker.title == target) {
			this.setData({
				viewshow: !this.data.viewshow,
			});
		} //有了就把他隐藏
		else {
			//没有则指定一个marker去存数据库的数据
			let marker = this.data.markers.find((item) => {
				return item.content.title == target;
			});

			this.designateMarker(marker);
		}
		this.markerChangeColour();
		//给他转个色
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
