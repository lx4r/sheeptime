/**
 * Created by lx4r on 06.04.2017.
 */
'use strict'

// TODO: add tests
// TODO: try to use moment.js for these functions

const moment = require('moment')

function diffTimeStrings (timeStringA, timeStringB) {
  // time strings should have a ":" in the middle
  if (timeStringA.indexOf(':') !== 2 || timeStringB.indexOf(':') !== 2) {
    throw Error('wrong time string format')
  }
  const timeStringASplit = timeStringA.split(':')
  const timeStringBSplit = timeStringB.split(':')
  const hoursDiff = Math.abs(timeStringASplit[0] - timeStringBSplit[0])
  const minutesDiff = Math.abs(timeStringASplit[1] - timeStringBSplit[1])

  return {
    hoursDiff,
    minutesDiff
  }
}

function subtractMinutesFromTimestamp (minutes, timestamp) {
  return (timestamp - minutes * 60)
}

function subtractHoursFromTimestamp (hours, timestamp) {
  return (timestamp - hours * 3600)
}

function addMinutesToTimestamp (minutes, timestamp) {
  return (timestamp + minutes * 60)
}

function addHoursToTimestamp (hours, timestamp) {
  return (timestamp + hours * 3600)
}

function changeDatesOfActivityTimes (activityStartTime, activityEndTime, newDateMoment) {
  if (!activityStartTime || !activityEndTime || !newDateMoment || (typeof newDateMoment !== 'object')) {
    throw Error('empty parameter(s) or newDateMoment of wrong type')
  }
  const startMoment = moment.unix(activityStartTime)
  const endMoment = moment.unix(activityEndTime)
  let daysDifference = 0
  if (startMoment.date() !== endMoment.date()) {
    daysDifference = Math.ceil(endMoment.diff(startMoment, 'days', true)) // ceil needed here to move the end time even if the difference between start and end time isn't a whole day
    // note that this solution fails if an activity spans more than a month (-> the start and end time have the same date)
  }
  // set the start and end moment's date to the new date
  startMoment.year(newDateMoment.year()).month(newDateMoment.month()).date(newDateMoment.date())
  endMoment.year(newDateMoment.year()).month(newDateMoment.month()).date(newDateMoment.date())
  if (daysDifference > 0) {
    // add the difference between the start and the end date to the end moment
    endMoment.add(daysDifference, 'days')
  }
  // convert the moments back to UNIX timestamps and return those
  return {
    startTime: startMoment.unix(),
    endTime: endMoment.unix()
  }
}

module.exports = {
  diffTimeStrings,
  subtractMinutesFromTimestamp,
  subtractHoursFromTimestamp,
  addMinutesToTimestamp,
  addHoursToTimestamp,
  changeDatesOfActivityTimes
}
