/**
 * Created by lx4r on 19.10.16.
 */
'use strict'

// Returns a new activity object
function createActivity (name, duration, projectID, startTime, endTime) {
  return {
    name: name,
    duration: duration,
    projectID: projectID,
    startTime: startTime,
    endTime: endTime
  }
}

module.exports = {
  createActivity: createActivity
}
