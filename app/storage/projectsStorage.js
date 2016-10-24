/**
 * Created by lx4r on 20.08.16.
 *
 * Storage of projects:
 * Object that contains a fresh ID and a map of the projects represented as an array:
 * {freshID: [...], projectsArray: [...]}
 */

'use strict'

const fs = require('fs')
const config = require('./../configuration')

// Saves the projects into a JSON file
function saveProjects (projects) {
  fs.writeFile(config.readSettings('savefile-directory') + '/sheeptime-projects.json', JSON.stringify(projects), function (err) {
    if (err) {
      return console.log(err)
    }
    console.log('The projects file was saved!')
  })
}

// Returns an object with the saved projects and the fresh ID (see top)
function readProjects () {
  var projects = fs.readFileSync(config.readSettings('savefile-directory') + '/sheeptime-projects.json', 'utf8')
  if (projects) {
    return JSON.parse(projects)
  } else {
    return {freshID: 0, projectsArray: []}
  }
}

module.exports = {
  saveProjects: saveProjects,
  readProjects: readProjects
}
