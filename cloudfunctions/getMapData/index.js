// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database()
const MAX_LIMIT = 100
// 云函数入口函数

exports.main = async (event, context) => {
  console.log("try-to-get-map")
  const countResult = await db.collection('eatmeet').where({
    city:event.city
  }).count()
  const total = countResult.total
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('eatmeet').where({
      city:event.city
    }).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get({
      success: function(res) {
        // res.data 是一个包含集合中有权限访问的所有记录的数据，
      }
    })
    tasks.push(promise)
  }
  return (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
      total
    }
  })

  
}