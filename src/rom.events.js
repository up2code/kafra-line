const moment = require('moment');

module.exports = {
  mapEvent: event => {
    const mmStartDate = moment(event.start.toDate());
    const mmEndDate = moment(event.end.toDate());
    const mmToday = moment();
    const isRunning = mmToday.isBetween(mmStartDate, mmEndDate);
    return {
      name: event.name,
      description: event.description,
      startTime: mmStartDate.unix(),
      start: mmStartDate.format("LL"),
      end: mmEndDate.format("LL"),
      isEnded: mmToday.isAfter(mmEndDate),
      isRunning: mmToday.isBetween(mmStartDate, mmEndDate),
      fromNow: (isRunning)? "Happening now" : moment(event.start.toDate()).fromNow(),
      detailUrl: event.detailUrl,
      thumbUrl: (event.thumbUrl) ? event.thumbUrl : 'https://via.placeholder.com/800x600?text=EVENT'
    }
  },
  mapWeeklyEvent: weeklyEvent => {

    if(!weeklyEvent.weekly) {
      throw Error('Invalid weekly event parameters');
    }

    const day = weeklyEvent.day;
    const startTime = weeklyEvent.startTime;
    const endTime = weeklyEvent.endTime;

    const resultEvent = {
      name: weeklyEvent.name,
      weekly: true,
      description: weeklyEvent.description,
      detailUrl: weeklyEvent.detailUrl,
      thumbUrl: (weeklyEvent.thumbUrl) ? weeklyEvent.thumbUrl : 'https://via.placeholder.com/800x600?text=EVENT'
    }

    const now = moment();
    const dayOfWeek = now.day();
  
    const splitedStartTime = startTime.split(':');
    const startHour = splitedStartTime[0];
    const startMinute = splitedStartTime[1];
  
    const splitedEndTime = endTime.split(':');
    const endHour = splitedEndTime[0];
    const endMinute = splitedEndTime[1];
  
  
    if(dayOfWeek === day) {
      let todayEventStart = moment();
      todayEventStart.hour(startHour);
      todayEventStart.minute(startMinute);
  
      let todayEventEnd = moment();
      todayEventEnd.hour(endHour);
      todayEventEnd.minute(endMinute);
  
      resultEvent.startTime = todayEventStart.unix();
      resultEvent.start = todayEventStart.format('LT');
      resultEvent.end = todayEventEnd.format('LT');
      resultEvent.today = true;

      if(now.isBetween(todayEventStart, todayEventEnd)) {

        resultEvent.fromNow = 'Happening now';
        resultEvent.isRunning = true;

      } else if(now.isBefore(todayEventStart)) {

        resultEvent.fromNow = todayEventStart.fromNow();

      } 

    } else {
      let nextEventStart = moment();
      nextEventStart.add(1, 'w');
      nextEventStart.day(day)
      nextEventStart.hour(startHour);
      nextEventStart.minute(startMinute);

      let nextEventEnd = moment();
      nextEventEnd.add(1, 'w');
      nextEventEnd.day(day)
      nextEventEnd.hour(endHour);
      nextEventEnd.minute(endMinute);

      resultEvent.startTime = nextEventStart.unix();
      resultEvent.start = nextEventStart.format('dddd, HH:mm');
      resultEvent.end = nextEventEnd.format('dddd, HH:mm');
      resultEvent.fromNow = nextEventStart.fromNow();
    }
  
    return resultEvent;
  }
}