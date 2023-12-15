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
        fobbidenTap:{
            type:Boolean,
            value:false
        }
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
            if(this.data.fobbidenTap){
                return;
            }
			let id = event.currentTarget.dataset.id;
			let userId = event.currentTarget.dataset.userid; //这里获取会变成小写
            let alreadyIn = event.currentTarget.dataset.already;
            
            if(alreadyIn==null){
                alreadyIn=1;
            }
        

			wx.navigateTo({
				url: `/pages/meetDetail/meetDetail?id=${id}&userId=${userId}&alreadyIn=${alreadyIn}`,
			});
          
		},
	},
});
