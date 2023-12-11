// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({ env: "know-to-eat-1guke3lkd453d421" });
const db = cloud.database();
const _ = db.command;
// 云函数入口函数
exports.main = async (event, context) => {
	const state = event.state;
	var meetID = event.id;
	var costomerid = event.costomeropenid;
	var masterid = event.masteropenid;
	if (state == "add") {
		let reslist = [];
		await db
			.collection("eatmeet")
			.where({
				_id: meetID,
			})
			.update({
				data: {
					costomerList: _.addToSet(costomerid),
					userNum: _.inc(1),
				},
			})
			.then((res) => {
				reslist.push(res);
			});
		await db
			.collection("talklist")
			.add({
				data: {
					meetid: meetID,
					masterid: masterid,
					costomerid: costomerid,
					talklist: [],
				},
			})
			.then((res) => {
				reslist.push(res);
			});
		return reslist;
	} else if (state == "leave") {
		let reslist = [];
		await db
			.collection("eatmeet")
			.where({
				_id: meetID,
			})
			.update({
				data: {
					costomerList: _.pull(costomerid),
					userNum: _.inc(-1),
				},
			})
			.then((res) => {
				reslist.push(res);
			});
		await db
			.collection("talklist")
			.where({
				meetid: meetID,
				costomerid: costomerid,
			})
			.remove()
			.then((res) => {
				reslist.push(res);
			});
		return reslist;
	} else if (state == "delete") {
		let reslist = [];
		await db
			.collection("eatmeet")
			.where({
				_id: meetID,
			})
			.remove()
			.then((res) => {
				reslist.push(res);
			});
		await db
			.collection("talklist")
			.where({
				meetid: meetID,
			})
			.remove()
			.then((res) => {
				reslist.push(res);
			});
		return reslist;
	}
};
