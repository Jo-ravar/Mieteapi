var router = require('express').Router();
var uniquenum=0;
var arr = [];
 module.exports = {
 uniqueNumber: function() {
  var date =new Date();
  var day=date.getDate();
  var month=(date.getMonth()+1);
  var year=date.getFullYear();
  var dateStr=day*1000000000+month*10000000+year*1000;
  console.log(" datestr "+dateStr);
  while(1)
  {
      
    if(arr.indexOf(dateStr) > -1){
        dateStr++;
        continue; 
    } 
    else
    {
        arr.push(dateStr);
        uniquenum=dateStr;
        console.log(" unique number "+uniquenum);
        break;  
    }  
  }
  return uniquenum;
}
}