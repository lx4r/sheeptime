/**
 * Created by lx4r on 22.08.16.
 */
'use strict'

const strftime = require('./js/strftime.min')
let config = require('./configuration') // not using "const" to be able to override with mock config
let realConfig = null // only used when config is overridden with mock config

function secondsToTimeString (secondsIn) {
  if (secondsIn < 0) {
    throw Error('negative seconds')
  }
  let hours = Math.floor(secondsIn / 3600)
  let minutes = Math.floor((secondsIn - (hours * 3600)) / 60)
  let seconds = secondsIn - (hours * 3600) - (minutes * 60)

  if (hours < 10) { hours = '0' + hours }
  if (minutes < 10) { minutes = '0' + minutes }
  if (seconds < 10) { seconds = '0' + seconds }
  return hours + ':' + minutes + ':' + seconds
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
  secondsToTimeString: secondsToTimeString,
  timestampToDateTimeString: timestampToDateTimeString,
  timestampToDateString: timestampToDateString,
  timestampToDateObject: timestampToDateObject,
  timestampToTimeString: timestampToTimeString,
  setMockConfig: setMockConfig,
  restoreRealConfig: restoreRealConfig,
  JSTimstampToUNIXTimestamp: JSTimstampToUNIXTimestamp
}
