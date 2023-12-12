// components/waterfall.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {},

	/**
	 * 组件的初始数据
	 */
	data: {
		leftList: [],
		rightList: [],
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		oneByOneRender(data = [], i, success) {
			// 最后时候调用这个
			if (data[0].length > i) {
				//获取元素相对于视窗的位置上下左右，这个函数是下面创建的
				this.getBoundingClientRect((res) => {
					// res是该方法的返回值

					const rects = res[0];
					// 得到瀑布
					if (rects && rects.length) {
						const leftH = rects[0].height;
						const rightH = rects[1].height;
						// 左右分别判断插入
						if (leftH <= rightH + 10) {
							this.data.leftList.push([data[0][i], data[1][i]]);
						} else {
							this.data.rightList.push([data[0][i], data[1][i]]);
						}
						this.setData(
							{
								leftList: this.data.leftList,
								rightList: this.data.rightList,
							},
							() => {
								// 下一个?
								this.oneByOneRender(data, ++i, success);
							}
						);
					}
				});
			} else {
				// 完成了就回调调用
				success && success();
			}
		},
		// 外部调用时候发生的事情
		run(data, success, isLast) {
			if (this.columnNodes) {
				// 已经选择两列就直接调用render
				this.render(data, success, isLast);
			} else {
				// 没有就创建选择两列后调用render
				this.selectDom(() => {
					this.render(data, success, isLast);
				});
			}
		},
		getBoundingClientRect(cb) {
			// 得到位置的函数
			this.columnNodes.boundingClientRect().exec(cb);
			// 在cb中返回
		},
		render(data = [], success, isLast) {
			if (isLast) {
				return this.oneByOneRender(data, 0, success);
			}
			this.setData({
				leftList: [],
				rightList: [],
			});
			// 不是最后时候调用
			this.columnNodes.boundingClientRect().exec((res) => {
				const rects = res[0];
				if (rects && rects.length) {
					let container = "";
					if (rects[0].height <= rects[1].height) {
						container = "leftList";
					} else {
						container = "rightList";
					}
					// 直接交替插入，怪

					for (let i in data[0]) {
						this.data[container].push([data[0][i], data[1][i]]);
						if (container === "leftList") {
							container = "rightList";
						} else {
							container = "leftList";
						}
					}
				}
				this.setData({
					leftList: this.data.leftList,
					rightList: this.data.rightList,
				});
			});
		},
		selectDom(cb) {
			const query = this.createSelectorQuery();
			// 创建元素选择器
			this.columnNodes = query.selectAll("#left, #right");
			// 选择到两列
			cb && cb();
			// 调用回调
		},
		goArticleDetail(e) {
			wx.navigateTo({
				url: `/pages/articles/articles?noteId=${e.currentTarget.dataset.id}&userId=${e.currentTarget.dataset.user}`,
			});
		},
	},
});
