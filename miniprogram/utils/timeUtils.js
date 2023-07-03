const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('-')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

const getToday=function(date){
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  
  return `${[year,month,day].map(formatNumber).join('-')}`
}

const getMonthLater=function(date){
  const year = date.getFullYear()
  const month = date.getMonth() + 2
  const day = date.getDate()
  if(month>12){
    year+=1;
    month=1;
  }
  return `${[year,month,day].map(formatNumber).join('-')}`
}

const getTodayAndNextMonth=date=>{
 return [getToday(date),getMonthLater(date)]
}

const wxTimeSqiltDate=function(datetime){
  
  let date=datetime.toString()
  
  var mydate=date.split(" ")[0]
  var mytime=date.split(" ")[1]
 
  return [mydate.split("-"),mytime.split(":")]
}

const wxjudgeTime=function(datetime){
  const now=new Date()
  const nowstr=formatTime(now)
  
  try {
 
  if(nowstr<datetime){
    return true
  }
  return false
  
  
  
  } catch (error) {
    return false
  }
  
  
}

module.exports = {
  formatTime,
  getTodayAndNextMonth,
  wxTimeSqiltDate,
  wxjudgeTime
}
