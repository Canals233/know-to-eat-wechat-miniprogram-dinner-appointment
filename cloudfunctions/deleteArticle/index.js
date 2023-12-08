// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({env:'know-to-eat-1guke3lkd453d421'})
const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  var myarticleid = event.articleid
  await db.collection('articles').where({
    _id: myarticleid
  }).remove()
  await db.collection('collect').where({
    articleid: myarticleid
  }).remove()
  return {
    msg: 'ok'
  }
}