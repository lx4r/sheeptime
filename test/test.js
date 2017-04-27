/* eslint-env mocha */
/**
 * Created by lx4r on 01.09.16.
 */
'use strict'

var should = require('chai').should() // eslint-disable-line
var formatTime = require('../app/formatTime')
var mapHandling = require('../app/mapHandling')

// helper functions
function addLeadingZero (number) {
  if (number < 10) {
    return '0' + number // add leading zero if needed
  } else {
    return number
  }
}

describe('formatTime', function () {
  describe('secondsToTimeObject', function () {
    it('should return a time objects that expresses 00:00:00 when no time has elapsed', function () {
      let timeObject = formatTime.secondsToTimeObject(0)
      timeObject.hours.should.equal('00')
      timeObject.minutes.should.equal('00')
      timeObject.seconds.should.equal('00')
    })
    it('should be able to convert more than 24 h in seconds to a valid time object', function () {
      let timeObject = formatTime.secondsToTimeObject(91830)
      timeObject.hours.should.equal('25')
      timeObject.minutes.should.equal('30')
      timeObject.seconds.should.equal('30')
    })
    it('should not accept negative seconds', function () {
      (function () {
        formatTime.secondsToTimeObject(-1)
      }).should.throw(Error)
    })
  })
  describe('secondsToTimeString', function () {
    // conversion itself should work correctly if secondsToTimeObject works correctly
    it('should convert a time object to a valid time string', function () {
      formatTime.secondsToTimeString(500).should.equal('00:08:20')
    })
    it('should not accept negative seconds', function () {
      (function () {
        formatTime.secondsToTimeString(-1)
      }).should.throw(Error)
    })
  })
  describe('timestampToDateTimeString', function () {
    it('should convert 0 to a valid European date time string', function () {
      formatTime.setMockConfig({
        readSettings: function (settingName) {
          if (settingName === 'time-format') {
            return 'european'
          } else {
            throw new Error('using wrong setting')
          }
        }
      })
      var expectedHour = addLeadingZero(new Date(0).getHours()) // needs to be calculated because it can vary based on the timezone
      var expected = '01.01.70, ' + expectedHour + ':00'
      formatTime.timestampToDateTimeString(0).should.equal(expected)
      formatTime.restoreRealConfig()
    })
    it('should convert 0 to a valid American date time string', function () {
      formatTime.setMockConfig({
        readSettings: function (settingName) {
          if (settingName === 'time-format') {
            return 'american'
          } else {
            throw new Error('using wrong setting')
          }
        }
      })
      var expectedHour = addLeadingZero(new Date(0).getHours()) // needs to be calculated because it can vary based on the timezone
      var expected = '01/01/70, ' + expectedHour + ':00'
      formatTime.timestampToDateTimeString(0).should.equal(expected)
      formatTime.restoreRealConfig()
    })
    it('should not accept negative timestamps', function () {
      (function () {
        formatTime.timestampToDateTimeString(-1)
      }).should.throw(Error)
    })
    it('should convert 1500000 to a valid American date time string', function () {
      formatTime.setMockConfig({
        readSettings: function (settingName) {
          if (settingName === 'time-format') {
            return 'american'
          } else {
            throw new Error('using wrong setting')
          }
        }
      })
      var expectedHour = addLeadingZero(new Date(1500000 * 1000).getHours()) // needs to be calculated because it can vary based on the timezone
      var expected = '01/18/70, ' + expectedHour + ':40'
      formatTime.timestampToDateTimeString(1500000).should.equal(expected)
      formatTime.restoreRealConfig()
    })
    it('should convert 1500000 to a valid European date time string', function () {
      formatTime.setMockConfig({
        readSettings: function (settingName) {
          if (settingName === 'time-format') {
            return 'european'
          } else {
            throw new Error('using wrong setting')
          }
        }
      })
      var expectedHour = addLeadingZero(new Date(1500000 * 1000).getHours()) // needs to be calculated because it can vary based on the timezone
      var expected = '18.01.70, ' + expectedHour + ':40'
      formatTime.timestampToDateTimeString(1500000).should.equal(expected)
      formatTime.restoreRealConfig()
    })
    it('should not accept negative timestamps', function () {
      (function () {
        formatTime.timestampToDateTimeString(-1)
      }).should.throw(Error)
    })
  })
  describe('timestampToDateObject', function () {
    it('should convert 0 to a valid Date object', function () {
      var expected = new Date(0)
      formatTime.timestampToDateObject(0).getTime().should.equal(expected.getTime())
    })
    it('should convert 5000 to a valid Date object', function () {
      var expected = new Date(5000 * 1000)
      formatTime.timestampToDateObject(5000).getTime().should.equal(expected.getTime())
    })
    it('should not accept negative timestamps', function () {
      (function () {
        formatTime.timestampToDateObject(-1)
      }).should.throw(Error)
    })
  })
  describe('timestampToTimeString', function () {
    it('should convert 0 to a valid time string', function () {
      var expected = addLeadingZero(new Date(0).getHours()) + ':00'
      formatTime.timestampToTimeString(0).should.equal(expected)
    })
    it('should convert 500000 to a valid time string', function () {
      var expected = addLeadingZero(new Date(500000 * 1000).getHours()) + ':53'
      formatTime.timestampToTimeString(500000).should.equal(expected)
    })
    it('should not accept negative timestamps', function () {
      (function () {
        formatTime.timestampToTimeString(-1)
      }).should.throw(Error)
    })
  })
  describe('JSTimstampToUNIXTimestamp', function () {
    it('should convert 1000 to 1', function () {
      formatTime.JSTimstampToUNIXTimestamp(1000).should.equal(1)
    })
  })
})

describe('mapHandling', function () {
  describe('mapToArray', function () {
    it('should convert an empty map to an empty array', function () {
      mapHandling.mapToArray(new Map()).should.eql([])
    })
    it('should convert a map to an array', function () {
      var map = new Map()
      map.set(0, 'lorem')
      map.set(42, 'ipsum')
      var result = [[0, 'lorem'], [42, 'ipsum']]
      mapHandling.mapToArray(map).should.eql(result)
    })
  })
  describe('arrayToMap', function () {
    it('should convert an empty array to an empty map', function () {
      mapHandling.arrayToMap([]).should.eql(new Map())
    })
    it('should convert an array to a map', function () {
      var array = [[0, 'lorem'], [42, 'ipsum']]
      var result = new Map()
      result.set(0, 'lorem')
      result.set(42, 'ipsum')
      mapHandling.arrayToMap(array).should.eql(result)
    })
  })
})
