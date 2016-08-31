/**
 * Created by lx4r on 21.08.16.
 */
'use strict'

var fs = require('fs')
var mapHandling = require('./mapHandling')

// Saves the activities into a JSON file
function saveActivities (activities) {
  var freshID = activities[0]
  var map = activities[1]
  var saveData = [freshID, mapHandling.mapToArray(map)]
  fs.writeFile('sheeptime_activities.json', JSON.stringify(saveData), function (err) {
    if (err) {
      return console.log(err)
    }
    console.log('The file was saved!')
  })
}

// Returns an array with the ID for the next activity in first position followed by the saved activities as a map (if existing)
function readActivities () {
  var activities = fs.readFileSync('sheeptime_activities.json', 'utf8')
  if (activities) {
    var parse = JSON.parse(activities)
    // length == 1 -> no map included yet -> initialise empty map
    if (parse.length === 1) {
      return parse.concat(new Map())
      // length > 1 -> map already included -> construct map from JSON
    } else {
      return [parse[0], mapHandling.arrayToMap(parse[1])]
    }
  } else {
    return [0, new Map()]
  }
}

module.exports = {
  saveActivities: saveActivities,
  readActivities: readActivities
}
