/* eslint-env mocha */
/**
 * Created by lx4r on 01.09.16.
 */

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
  describe('secondsToTimeString', function () {
    it('should return 00:00:00 when no time has elapsed', function () {
      formatTime.secondsToTimeString(0).should.equal('00:00:00')
    })
    it('should be able to convert more than 24 h in seconds to a valid time', function () {
      formatTime.secondsToTimeString(91830).should.equal('25:30:30')
    })
    it('should not accept negative seconds', function () {
      formatTime.secondsToTimeString(-1).should.throw(Error)
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
      let expectedHour = addLeadingZero(new Date(0).getHours()) // needs to be calculated because it can vary based on the timezone
      let expected = '01.01.70, ' + expectedHour + ':00'
      formatTime.timestampToDateTimeString(0).should.equal(expected)
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
      let expectedHour = addLeadingZero(new Date(0).getHours()) // needs to be calculated because it can vary based on the timezone
      let expected = '01/01/70, ' + expectedHour + ':00'
      formatTime.timestampToDateTimeString(0).should.equal(expected)
    })
    /* it('should convert current time to European date time string', function () {
     formatTime.setMockConfig({
     readSettings: function (settingName) {
     if (settingName === 'time-format') {
     return 'european'
     } else {
     throw new Error('using wrong setting')
     }
     }
     })
     let dateForExpected = new Date()
     let expectedHour = addLeadingZero(dateForExpected.getHours()) // needs to be calculated because it can vary based on the timezone
     let expectedMinute = addLeadingZero(dateForExpected.getMinutes())
     let expectedDay = addLeadingZero(dateForExpected.getDate())
     let expectedMonth = addLeadingZero(dateForExpected.getMonth())
     let expectedYear = addLeadingZero(dateForExpected.getYear())
     let expected = expectedDay + '.' + expectedMonth + '.' + expectedYear + ', ' + expectedHour + ':' + expectedMinute
     formatTime.timestampToDateTimeString(Math.floor(Date.now() / 1000)).should.equal(expected)
     })
     })
  })*/

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
})
