// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({env:'know-to-eat-1guke3lkd453d421'})
const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  const countResultc = await db.collection('collect').where({
    articleid: event.articleid,
    openid: event.openid
  }).count()
  const countResultl = await db.collection('like').where({
    articleid: event.articleid,
    openid: event.openid
  }).count()
  const cnum = countResultc.total
  const lnum=countResultl.total
  console.log(cnum,lnum)
  var isCollect,isLike
  if(cnum==0){
    isCollect=false
  }
  else isCollect=true;

  if(lnum==0){
    isLike=false
  }
  else isLike=true;
  
  return{
    isCollect,
    isLike

  }
}