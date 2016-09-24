/**
 * Created by lx4r on 21.08.16.
 *
 * Storage of activities:
 * Object that contains a fresh ID and a map of the activities represented as an array:
 * {freshID: [...], activitiesArray: [...]}
 */
'use strict'

var fs = require('fs')
var mapHandling = require('./mapHandling')
var config = require('./configuration')

// Saves the loggedActivities into a JSON file
function saveActivities (activities) {
  fs.writeFile(config.readSettings('savefile-directory') + '/sheeptime-activities.json', JSON.stringify(activities), function (err) {
    if (err) {
      return console.log(err)
    }
    console.log('The file was saved!')
  })
}

// Returns an array with the ID for the next activity in first position followed by the saved loggedActivities as a map (if existing)
function readActivities () {
  var activities = fs.readFileSync(config.readSettings('savefile-directory') + '/sheeptime-activities.json', 'utf8')
  if (activities) {
    return JSON.parse(activities)
  } else {
    return {freshID: 0, activitiesArray: []}
  }
}

module.exports = {
  saveActivities: saveActivities,
  readActivities: readActivities
}
