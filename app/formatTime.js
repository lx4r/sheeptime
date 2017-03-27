/**
 * Created by lx4r on 22.08.16.
 */

const strftime = require('./js/strftime.min')
const config = require('./configuration')

function secondsToTimeString (secondsIn) {
  var hours = Math.floor(secondsIn / 3600)
  var minutes = Math.floor((secondsIn - (hours * 3600)) / 60)
  var seconds = secondsIn - (hours * 3600) - (minutes * 60)

  if (hours < 10) { hours = '0' + hours }
  if (minutes < 10) { minutes = '0' + minutes }
  if (seconds < 10) { seconds = '0' + seconds }
  return hours + ':' + minutes + ':' + seconds
}

function timestampToDateTimeString (timestamp) {
  switch (config.readSettings('time-format')) {
    case 'european':
      return strftime('%d.%m.%y, %H:%M', timestampToDateObject(timestamp))
    case 'american':
      return strftime('%m/%d/%y, %H:%M', timestampToDateObject(timestamp))
  }
}

function timestampToDateString (timestamp) {
  switch (config.readSettings('time-format')) {
    case 'european':
      return strftime('%d.%m.%Y', timestampToDateObject(timestamp))
    case 'american':
      return strftime('%m/%d/%Y', timestampToDateObject(timestamp))
  }
}

function timestampToDateObject (timestamp) {
  return new Date(timestamp)
}

function timestampToTimeString (timestamp) {
  return strftime('%H:%M', timestampToDateObject(timestamp))
}

module.exports = {
  secondsToTimeString: secondsToTimeString,
  timestampToDateTimeString: timestampToDateTimeString,
  timestampToDateString: timestampToDateString,
  timestampToDateObject: timestampToDateObject,
  timestampToTimeString: timestampToTimeString
}
