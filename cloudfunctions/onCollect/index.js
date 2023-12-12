// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({env:'know-to-eat-1guke3lkd453d421'})
const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  var myarticleid = event.articleid
  var myopenid = event.openid
  const countResult = await db.collection('collect').where({
    articleid: myarticleid,
    openid: myopenid
  }).count()
  const num = countResult.total
  const  _ = db.command
  if (num == 0) {
    
    await db.collection('articles').doc(myarticleid).update({
      data: {
        collectionNum: _.inc(1)
      }
    })
    await db.collection('collect').add({
      data: {
        articleid: myarticleid,
        openid: myopenid
      }
    })
    return {
      isCollect: true
    }
  } else{
    
    await db.collection('collect').where({
      articleid: myarticleid,
        openid: myopenid
    }).remove()
    

    await db.collection('articles').doc(myarticleid).update({
      data: {
        collectionNum: _.inc(-1)
      }
    })
    return{
      isCollect: false
    }
  }
    
}