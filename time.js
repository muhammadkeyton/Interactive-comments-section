//This module calculates the duration when a user first commented and now.
//it generates a string ie(3 mins ago) seen on every users comment

const dayjs = require('dayjs')
//import dayjs from 'dayjs' // ES 2015
dayjs().format()

const duration = require('dayjs/plugin/duration')
dayjs.extend(duration)


//gets the current date and exports it
module.exports.getCurrentTime = ()=>{
  const now = dayjs()
  return now;
};


//compares the current date against the old date and returns a string ie(2 secs ago)
module.exports.compareTime = (pastTime,currentTime)=>{
  var duration = dayjs.duration(currentTime.diff(pastTime))
  if(duration.$d.years > 0){

    if(duration.$d.years === 1){
      return `${duration.$d.years} yr ago`;
    }else{
      return `${duration.$d.years} yrs ago`;
    }



  }else if(duration.$d.months > 0){

    if(duration.$d.months === 1){
      return `${duration.$d.months} month ago`;
    }else{
      return `${duration.$d.months} months ago`;
    }

  }else if(duration.$d.days > 0){

    if(duration.$d.days === 1){
      return `${duration.$d.days} day ago`;
    }else{
      return `${duration.$d.days} days ago`;
    }

  }else if(duration.$d.hours > 0){

    if(duration.$d.hours === 1){
      return `${duration.$d.hours} hour ago`;
    }else{
      return `${duration.$d.hours} hours ago`;
    }

  }else if(duration.$d.minutes > 0){

    if(duration.$d.minutes === 1){
      return `${duration.$d.minutes} min ago`;
    }else{
      return `${duration.$d.minutes} mins ago`;
    }


  }else{

    if(duration.$d.seconds === 1){
      return `${duration.$d.seconds} sec ago`;
    }else{
      return `${duration.$d.seconds} secs ago`;
    }


  }

}
