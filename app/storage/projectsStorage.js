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
const projectsFileName = 'sheeptime-projects.json'
const projectsFilePath = config.readSettings('savefile-directory') + '/' + projectsFileName
const defaultFileContent = {freshID: 0, projectsArray: []}

// Saves the projects into a JSON file
function saveProjects (projects) {
  fs.writeFile(projectsFilePath, JSON.stringify(projects), function (err) {
    if (err) {
      return console.log(err)
    }
    console.log('The projects file was saved!')
  })
}

// Returns an object with the saved projects and the fresh ID (see top)
function readProjects () {
  if (fs.existsSync(projectsFilePath)) {
    // file exists
    var projects = fs.readFileSync(projectsFilePath, 'utf8')
    if (projects) {
      return JSON.parse(projects)
    } else {
      // file exists but is empty
      return defaultFileContent
    }
  } else {
    // file doesn't exist -> create file and fill it with the default content
    fs.writeFileSync(projectsFilePath, JSON.stringify(defaultFileContent))
    return defaultFileContent
  }
}

module.exports = {
  saveProjects: saveProjects,
  readProjects: readProjects
}
