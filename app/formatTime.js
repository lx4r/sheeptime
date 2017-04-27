/**
 * Created by lx4r on 22.08.16.
 */
'use strict'

const strftime = require('./js/strftime.min')
const moment = require('moment')
let config = require('./configuration') // not using "const" to be able to override with mock config
let realConfig = null // only used when config is overridden with mock config

// date formats
const AMERICAN_DATE_FORMAT = 'MM/DD/YYYY'
const EUROPEAN_DATE_FORMAT = 'DD.MM.YYYY'

function secondsToTimeObject (secondsIn) {
  // converts seconds to time object with two digit hours, minutes, seconds (-> adds leading zeroes)
  // properties of the time object are strings
  if (secondsIn < 0 || isNaN(secondsIn)) {
    throw Error('invalid seconds')
  }
  let hours = Math.floor(secondsIn / 3600)
  let minutes = Math.floor((secondsIn - (hours * 3600)) / 60)
  let seconds = secondsIn - (hours * 3600) - (minutes * 60)

  if (hours < 10) { hours = '0' + hours }
  if (minutes < 10) { minutes = '0' + minutes }
  if (seconds < 10) { seconds = '0' + seconds }

  return {
    hours: hours.toString(),
    minutes: minutes.toString(),
    seconds: seconds.toString()
  }
}

function secondsToTimeString (secondsIn) {
  if (secondsIn < 0) {
    throw Error('negative seconds')
  }
  let timeObject = secondsToTimeObject(secondsIn)
  return timeObject.hours + ':' + timeObject.minutes + ':' + timeObject.seconds
}

function timestampToDateTimeString (timestamp) {
  if (timestamp < 0) {
    throw Error('negative timestamp')
  }
  switch (config.readSettings('time-format')) {
    case 'european':
      return strftime('%d.%m.%y, %H:%M', timestampToDateObject(timestamp))
    case 'american':
      return strftime('%m/%d/%y, %H:%M', timestampToDateObject(timestamp))
  }
}

function timestampToDateString (timestamp) {
  if (timestamp < 0) {
    throw Error('negative timestamp')
  }
  switch (config.readSettings('time-format')) {
    case 'european':
      return strftime('%d.%m.%Y', timestampToDateObject(timestamp))
    case 'american':
      return strftime('%m/%d/%Y', timestampToDateObject(timestamp))
  }
}

function timestampToDateObject (timestamp) {
  if (timestamp < 0) {
    throw Error('negative timestamp')
  }
  // timestamps are saved as UNIX timestamp (seconds) but JS uses milliseconds
  return new Date(timestamp * 1000)
}

function JSTimstampToUNIXTimestamp (JSTimestamp) {
  return Math.floor(JSTimestamp / 1000)
}

function timestampToTimeString (timestamp) {
  if (timestamp < 0) {
    throw Error('negative timestamp')
  }
  return strftime('%H:%M', timestampToDateObject(timestamp))
}

function addLeadingZero (inputNumber) {
  const inputString = inputNumber + ''
  if (inputString.length === 1) {
    return '0' + inputString
  } else {
    return inputString
  }
}

// return false if the date string is invalid
function parseDateString (dateString) {
  let resultDate
  let dateStringParts
  if (config.readSettings('time-format') === config.TIMESTAMP_AMERICAN) {
    if (!moment(dateString, AMERICAN_DATE_FORMAT, true).isValid()) {
      return false
    }
    dateStringParts = dateString.split('/')
    resultDate = new Date(dateStringParts[2], dateStringParts[0], dateStringParts[1])
  } else {
    if (!moment(dateString, EUROPEAN_DATE_FORMAT, true).isValid()) {
      return false
    }
    dateStringParts = dateString.split('.')
    resultDate = new Date(dateStringParts[2], dateStringParts[1], dateStringParts[0])
  }
  // date is valid -> return parts of the date
  return resultDate
}

function setMockConfig (mockConfigObject) {
  // mock config object must provide function readSettings
  // restoreRealConfig must be called after every test
  realConfig = config
  config = mockConfigObject
}

function restoreRealConfig () {
  config = realConfig
}

module.exports = {
  secondsToTimeObject,
  secondsToTimeString,
  timestampToDateTimeString,
  timestampToDateString,
  timestampToDateObject,
  timestampToTimeString,
  setMockConfig,
  restoreRealConfig,
  JSTimstampToUNIXTimestamp,
  addLeadingZero,
  parseDateString
}
