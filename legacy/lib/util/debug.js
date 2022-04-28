import strftime from "./strftime.js"

function pausecomp(millis)
{
  var date = new Date();
  var curDate = null;
  do { curDate = new Date(); }
  while(curDate-date < millis);
}

export function timer(name) {
  var start = new Date();
  return {
      stop: function() {
          var end  = new Date();
          var time = end.getTime() - start.getTime();
          console.log('Timer:', name, 'finished in', time, 'ms');
      }
  }
};

Date.prototype.toString = function() {
  return strftime("%F %H:%M", this);
}
