/**
 * Created by lx4r on 22.08.16.
 */

var strftime = require('./js/strftime.min')
var config = require('./configuration')

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
      return strftime('%d.%m.%y', timestampToDateObject(timestamp))
    case 'american':
      return strftime('%m/%d/%y', timestampToDateObject(timestamp))
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
