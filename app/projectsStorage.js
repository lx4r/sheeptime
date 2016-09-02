/**
 * Created by lx4r on 20.08.16.
 */
'use strict'

var fs = require('fs')
var mapHandling = require('./mapHandling')
var config = require('./configuration')

// Saves the savedProjects into a JSON file
function saveProjects (projects) {
  var freshID = projects[0]
  var map = projects[1]
  var saveData = [freshID, mapHandling.mapToArray(map)]
  fs.writeFile(config.readSettings('savefile-directory') + '/sheeptime-projects.json', JSON.stringify(saveData), function (err) {
    if (err) {
      return console.log(err)
    }
    console.log('The file was saved!')
  })
}

// Returns an array with the ID for the next project in first position followed by the saved savedProjects as a map (if existing)
function readProjects () {
  var projects = fs.readFileSync(config.readSettings('savefile-directory') + '/sheeptime-projects.json', 'utf8')
  if (projects) {
    var parse = JSON.parse(projects)
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
  saveProjects: saveProjects,
  readProjects: readProjects
}
