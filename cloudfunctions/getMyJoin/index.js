// 云函数入口文件
/**
 * 根据openid得到收藏列表(我的收藏)
 */
// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({ env: "know-to-eat-1guke3lkd453d421" });
const db = cloud.database();
const _ = db.command;
const MAX_LIMIT = 100;
// 云函数入口函数
exports.main = async (event, context) => {
	var openid = event.openid;
	const countResult = await db.collection("eatmeet").count();
	const total = countResult.total;
	// 计算需分几次取
	const batchTimes = Math.ceil(total / 100);
	// 承载所有读操作的 promise 的数组
	const tasks = [];
	for (let i = 0; i < batchTimes; i++) {
		const promise = db
			.collection("talklist")
			.where(
				_.or([
					{
						masterid: openid,
					},
					{
						costomerid: openid,
					},
				])
			)
			.skip(i * MAX_LIMIT)
			.limit(MAX_LIMIT)
			.get();
		tasks.push(promise);
	}
	const talkListByOpenIdList = (await Promise.all(tasks)).reduce(
		(acc, cur) => {
			return {
				data: acc.data.concat(cur.data),
				errMsg: acc.errMsg,
			};
		}
	);

	const tasks2 = [];
	for (let i = 0; i < talkListByOpenIdList.data.length; i++) {
		const promise2 = await db
			.collection("eatmeet")
			.orderBy("datetime", "desc")
			.where({
				_id: talkListByOpenIdList.data[i].meetid,
			})
			.get();
		tasks2.push(promise2);
	}
	const meetList = (await Promise.all(tasks2)).reduce((acc, cur) => {
		return {
			data: acc.data.concat(cur.data),
			errMsg: acc.errMsg,
		};
	});

	const tasks3 = [];
	for (let i = 0; i < meetList.data.length; i++) {
		const promise3 = await db
			.collection("user")
			.where({
				openid: meetList.data[i].openid,
			})
			.get();
		tasks3.push(promise3);
	}
	const meetUserList = (await Promise.all(tasks3)).reduce((acc, cur) => {
		return {
			data: acc.data.concat(cur.data),
			errMsg: acc.errMsg,
		};
	});

	return {
		meetList,
		meetUserList,
	};
};
