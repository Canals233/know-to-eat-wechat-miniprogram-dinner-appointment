// 云函数入口文件
/**
 * 根据openid得到收藏列表(我的收藏)
 */
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async(event, context) => {
  var costomerids = event.costomerids
  var meetid=event.meetid
  const tasks = []
  for (let i = 0; i < costomerids.length; i++) {
    const promise = await db.collection('talklist').where({
      meetid: meetid,
      costomerid:costomerids[i]
    }).get()
    tasks.push(promise)
  }
  const talkList = (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })


  const tasks2 = []
  for (let i = 0; i < talkList.data.length; i++) {
    const promise2 = await db.collection('user').where({
      openid: talkList.data[i].costomerid
    }).get()
    tasks2.push(promise2)
  }
  const costomers = (await Promise.all(tasks2)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })

  return {
    talkList,
    costomers
  }
}