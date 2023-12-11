// components/partyCard.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		item: {
			type: Object,
			value: {},
		},
	},

	/**
	 * 组件的初始数据
	 */
	data: {},

	/**
	 * 组件的方法列表
	 */
	methods: {
		toMeetDetail: function (event) {
 
			let id = event.currentTarget.dataset.id;
			let userId = event.currentTarget.dataset.userid; //这里获取会变成小写

			wx.navigateTo({
				url: `/pages/meetDetail/meetDetail?id=${id}&userId=${userId}`,
			});
          
		},
	},
});
