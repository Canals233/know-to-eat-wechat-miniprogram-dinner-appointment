/**
 * 得到所有博客信息
 */
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({env:'know-to-eat-1guke3lkd453d421'})
const db = cloud.database()
const MAX_LIMIT = 100
// 云函数入口函数
exports.main = async(event, context) => {
  // 先取出集合记录总数
  const dbname=event.dbname
  const countResult = await db.collection(dbname).count()
  const total = countResult.total
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    let promise
    let filter=event.filter
    if(!filter){
     promise = db.collection(dbname).orderBy('DateTime', 'asc').skip(i * MAX_LIMIT).limit(MAX_LIMIT)
      .get()
    }
    else {
      let _=db.command
      promise = db.collection(dbname).orderBy('DateTime', 'asc').skip(i * MAX_LIMIT).limit(MAX_LIMIT).where(
        _.or([
          {//标题
            title: db.RegExp({ //使用正则查询，实现对搜索的模糊查询
              regexp: filter,
              options: 'i', //大小写不区分
            }),
          },
          {//描述
            noteShopName: db.RegExp({
              regexp: filter,
              options: 'i',
            }),
          }
        ])
      )
      .get()
    }
    tasks.push(promise)
  }
  const noteList = (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })
  const tasks2 = []
  for (let i = 0; i < noteList.data.length; i++) {
    const promise2 = await db.collection('user').where({
      openid: noteList.data[i]._openid
    }).get()
    tasks2.push(promise2)
  }
  const userList = (await Promise.all(tasks2)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })

  // 等待所有
  return {
    noteList,
    userList
  }
}