/**
 * Created by lx4r on 21.08.16.
 *
 * Storage of activities:
 * Object that contains a fresh ID and a map of the activities represented as an array:
 * {freshID: [...], activitiesArray: [...]}
 */
'use strict'

const fs = require('fs')
const config = require('./../configuration')
const activitiesFileName = 'sheeptime-activities.json'
const activitiesFilePath = config.readSettings('savefile-directory') + '/' + activitiesFileName
const defaultFileContent = {freshID: 0, activitiesArray: []}

// Saves the loggedActivities into a JSON file
function saveActivities (activities) {
  fs.writeFile(activitiesFilePath, JSON.stringify(activities), function (err) {
    if (err) {
      return console.log(err)
    }
  })
}

// Returns an object with the saved activities and the fresh ID (see top)
function readActivities () {
  if (fs.existsSync(activitiesFilePath)) {
    // file exists
    var activities = fs.readFileSync(activitiesFilePath, 'utf8')
    if (activities) {
      return JSON.parse(activities)
    } else {
      // file exists but is empty
      return defaultFileContent
    }
  } else {
    // file doesn't exist -> create file and fill it with the default content
    fs.writeFileSync(activitiesFilePath, JSON.stringify(defaultFileContent))
    return defaultFileContent
  }
}

module.exports = {
  saveActivities: saveActivities,
  readActivities: readActivities
}
