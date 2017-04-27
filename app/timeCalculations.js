/**
 * Created by lx4r on 06.04.2017.
 */
'use strict'

// TODO: add tests

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

module.exports = {
  diffTimeStrings,
  subtractMinutesFromTimestamp,
  subtractHoursFromTimestamp,
  addMinutesToTimestamp,
  addHoursToTimestamp
}
