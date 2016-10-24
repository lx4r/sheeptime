/**
 * Created by lx4r on 19.10.16.
 */
'use strict'

// Returns a new project object
function createProject (name) {
  return {
    name: name,
    totalSeconds: 0
  }
}

module.exports = {
  createProject: createProject
}
