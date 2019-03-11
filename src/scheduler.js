const schedule = require('node-schedule');
const moment = require('moment');
const lineMessage = require('./line.message');
const lineConfig = require('./line.config');

const reminderPattern = /^!(remind|เตือน|เตือน.+|แจ้งเตือน|แจ้งเตือน.+)\s".+"\s(\d{2}:\d{2}|(tomorrow|พรุ่งนี้)\s\d{2}:\d{2}|\d{4}\/\d{2}\/\d{2}\s\d{2}:\d{2})/;
const incorrectFormatMessage = 'เหมือนจะระบุไม่ถูกรูปแบบนะ ต้องใช้ในรูปแบบประมาณนี้นะคะ\n{เตือน|แจ้งเตือน} "ประโยคที่ต้องการแจ้งเตือน" {เวลาในอนาคต}';

function setLINEReminder(date, message) {

    if(!date || !message || (!message.groupId && !message.userId) || !message.value) {
        console.log('Invalid parameter for LINE Reminder');
        return Promise.resolve(lineMessage.createTextMessage(incorrectFormatMessage));
    }

    console.log('set schedule ' + message.value + " at " + date)

    schedule.scheduleJob(date, function(){
        
        let refId = (message.groupId)? message.groupId : message.userId;

        console.log(JSON.stringify(message) + " to " + refId);

        lineConfig.client.pushMessage(refId, {
            type: 'text',
            text: message.value
        }).then(() => {
            console.log('push reminder message successful')
        }).catch(err => {
            console.log(err);
        });
    });

    return Promise.resolve(lineMessage.createTextMessage('ตั้งการแจ้งเตือน "' + message.value + '" ณ เวลา ' + moment(date).calendar()));
}

function convertReminderTimeToDate(timeText) {

    if(timeText.trim().split(' ').length == 1) {
        let time = timeText.trim().split(':');
        let m = moment();
        m.set('hour', time[0]);
        m.set('minute', time[1]);
        m.set('second', 0);

        console.log('schedule to : ' + m.toDate());

        if(!m.isAfter(moment())) {
            console.log('You should set date as future')
            return null;
        }

        return m.toDate();
    }
    
    if(/(พรุ่งนี้)\s\d{2}:\d{2}/.test(timeText)) {
        let time = /\d{2}:\d{2}/.exec(timeText)[0].split(':');
        var tomorrow = moment(new Date()).add(1,'days');
        tomorrow.set('hour', time[0]);
        tomorrow.set('minute', time[1]);
        tomorrow.set('second', 0);

        console.log('schedule to : ' + tomorrow.toDate());

        return tomorrow.toDate();
    }
    
    if(/\d{4}\/\d{2}\/\d{2}\s\d{2}:\d{2}/.test(timeText)) {
        let m = moment(timeText, 'YYYY/MM/DD HH:mm');

        console.log('schedule to : ' + m.toDate());

        return m.toDate();
    }
}

const reminderFromText = (text, userId, groupId) => {

    if(!userId && !groupId) {
        console.log("User id and group id is missing");
        return Promise.resolve(lineMessage.createTextMessage("System error ค่าาา แจ้งหรือเขกหัว dev ได้เลยยย"));
    }

    if(!reminderPattern.test(text)) {
        console.log("Incorrect text format");
        return Promise.resolve(lineMessage.createTextMessage(incorrectFormatMessage));
    }

    var remindMessage = /"(.*?)"/.exec(text)[1].replace("\"", "").trim();
    var remindTime = /[^"]+$/.exec(text)[0].trim();

    if(!remindMessage || !remindTime) {
        return Promise.resolve(lineMessage.createTextMessage(incorrectFormatMessage));
    }

    let date = convertReminderTimeToDate(remindTime);

    return setLINEReminder(date, {
        groupId,
        userId,
        value: remindMessage
    })
}

module.exports = {
    reminderFromText
}