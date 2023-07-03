// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  var myavatarUrl = event.avatarUrl
  var mynickName = event.nickName
  const myopenid = cloud.getWXContext().OPENID
  console.log(myopenid)
  
  try {
    console.log("try add")
    return await db.collection('user').add({
      data: {
        _id:myopenid,
        avatarUrl: myavatarUrl,
        nickName: mynickName,
        openid: myopenid
      }
    })
  } catch (e) {
    return e
  }
  
}