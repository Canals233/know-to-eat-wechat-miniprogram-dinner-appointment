// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
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