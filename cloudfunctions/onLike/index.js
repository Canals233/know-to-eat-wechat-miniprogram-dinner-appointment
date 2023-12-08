// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({env:'know-to-eat-1guke3lkd453d421'})
const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  var myarticleid = event.articleid
  var myopenid = event.openid
  const countResult = await db.collection('like').where({
    articleid: myarticleid,
    openid: myopenid
  }).count()
  const num = countResult.total
  const  _ = db.command
  if (num == 0) {
    
    await db.collection('articles').doc(myarticleid).update({
      data: {
        likeNum: _.inc(1)
      }
    })
    await db.collection('like').add({
      data: {
        articleid: myarticleid,
        openid: myopenid
      }
    })
    return {
      isLike:true
    }
  } else{
    
    await db.collection('like').where({
      articleid: myarticleid,
        openid: myopenid
    }).remove()
    

    await db.collection('articles').doc(myarticleid).update({
      data: {
        likeNum: _.inc(-1)
      }
    })
    return{
     isLike:false
    }
  }
    
}