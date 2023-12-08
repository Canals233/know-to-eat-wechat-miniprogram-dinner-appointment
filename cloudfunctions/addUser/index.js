// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({ env: "know-to-eat-1guke3lkd453d421" });
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
	var myavatarUrl = event.avatarUrl;
	var mynickName = event.nickName;
	const myopenid = cloud.getWXContext().OPENID;
	console.log(myopenid);

	try {
		console.log("try add");
		return await db.collection("user").add({
			data: {
				_id: myopenid,
				avatarUrl: myavatarUrl,
				nickName: mynickName,
				openid: myopenid,
			},
		});
	} catch (e) {
		return e;
	}
};
