/**
 * Created by lx4r on 18.08.16.
 */
'use strict'

var projectsStorage = require('./projectsStorage')
var activitiesStorage = require('./activitiesStorage')
var ipcRenderer = require('electron').ipcRenderer
var formatTime = require('./formatTime')
var mapHandling = require('./mapHandling')
var getElementByID = require('./getElementByID')

var currentSeconds = 0
var startTime
var intervalID
var loggedActivities = activitiesStorage.readActivities()
var savedProjects = projectsStorage.readProjects()
var errors = []
var stopwatchRunning = false

// ---- DEV ----
const Vue = require('vue')

ipcRenderer.send('sheeptime:loggedActivities:send')
ipcRenderer.on('sheeptime:loggedActivities:get', function (event, arg) {
  loggedActivities = arg
  Vue.component('activity-list', require('./vue/activity-list.vue'))
  var vm = new Vue({
    el: '#main',
    data: loggedActivities
  })
})

/*
var testObject = {array: mapHandling.mapToArray(loggedActivities[1])}
const Vue = require('vue')
Vue.component('activity-list', require('./vue/activity-list.vue'))
var vm = new Vue({
  el: '#main',
  data: testObject
}) */
// -------------

// Initialise the view after getting the loggedActivities and savedProjects from the save file
updateProjectsDropdown()

errors.forEach(function (err) {
  console.error(err)
})

$('#startStopButton').on('click', function () {
  var startStopButton = getElementByID('startStopButton')

  // Stopwatch is running -> buttons acts as stop button
  if (stopwatchRunning) {
    let endTime = Date.now()

    let activityName = getElementByID('activityName')

    // Stop the stopwatch
    clearInterval(intervalID)

    let activityProjectID = parseInt(getElementByID('projectsDropdown').value)

    // Add the new activitiy to the loggedActivities map
    var newActivity = {projectID: activityProjectID, name: activityName.value, duration: currentSeconds, startTime: startTime, endTime: endTime}
    loggedActivities.activitiesArray = mapHandling.addElement(loggedActivities.activitiesArray, loggedActivities.freshID, newActivity)

    // Increment the fresh ID
    loggedActivities.freshID++

    // Update the total time of the activity's project in the project map by adding the number of elapsed seconds
    let activityProject = savedProjects[1].get(activityProjectID)
    activityProject.totalSeconds += currentSeconds
    savedProjects[1].set(activityProjectID, activityProject)

    // Reset the stopwatch
    currentSeconds = 0
    // Update the view
    getElementByID('timer').innerHTML = '00:00:00'
    activityName.value = ''

    // Update the button's color and change it's text -> start button
    startStopButton.className = 'btn btn-success'
    startStopButton.innerHTML = 'Start'
    // Update the stopwatch's status
    stopwatchRunning = false

    // Save the new activity to the JSON file
    activitiesStorage.saveActivities(loggedActivities)
    // Save the updated project to the JSON file
    projectsStorage.saveProjects(savedProjects)

    // Inform the project window of the new total time of one of the savedProjects
    ipcRenderer.send('activity-tracked', mapHandling.mapToArray(savedProjects[1]))

    // Stopwatch is not running -> buttons acts as start button
  } else {
    // Save the time the activity was started
    startTime = Date.now()

    // Update the stopwatch every second with the human-readable representation of the current number of seconds on the "stopwatch"
    intervalID = setInterval(function () {
      currentSeconds++
      getElementByID('timer').innerHTML = formatTime.secondsToTime(currentSeconds)
    }, 1000)

    // Update the button's color and change it's text -> stop button
    startStopButton.className = 'btn btn-danger'
    startStopButton.innerHTML = 'Stop'

    // Update the stopwatch's status
    stopwatchRunning = true
  }
})

$('#projectsButton').on('click', function () {
  ipcRenderer.send('open-savedProjects-window')
})

$('#settingsButton').on('click', function () {
  //ipcRenderer.send('open-settings-window')
  //DEV
  console.log(test.activitiesArray)
  test.activitiesArray = [[61,{"projectID":5,"name":"asdfYAY","duration":2,"startTime":1472929376284,"endTime":1472929378533}]]

  //ipcRenderer.send('test')
})

$('#activityTable').on('click', 'button.deleteActivityButton', function () {
  // Delete the activity with the ID stored in the clicked button from the activity map, update the loggedActivities table and save the new storage array to the JSON file
  var id = $(this).data('id')
  var activity = loggedActivities[1].get(id)
  loggedActivities[1].delete(id)
  //updateActivitiesTable()
  activitiesStorage.saveActivities(loggedActivities)

  // Then update the new total time of the project the activity was associated with and save the updated project map to the JSON file
  var activityProject = savedProjects[1].get(activity.projectID)
  activityProject.totalSeconds += -(activity.duration)
  savedProjects[1].set(activity.projectID, activityProject)
  projectsStorage.saveProjects(savedProjects)

  // Inform the project window of the new total time of one of the savedProjects
  ipcRenderer.send('activity-deleted', mapHandling.mapToArray(savedProjects[1]))
})

// If a project is added in the project window, update the project dropdown in this window
ipcRenderer.on('project-added', function (event, arg) {
  savedProjects[1] = mapHandling.arrayToMap(arg)
  updateProjectsDropdown()
})

// If a project is deleted in the project window, delete all loggedActivities associated with that project
ipcRenderer.on('project-deleted', function (event, arg) {
  loggedActivities[1].forEach(function (elem, id) {
    if (elem.projectID === arg.deletedProjectID) {
      loggedActivities[1].delete(id)
    }
  })
  //updateActivitiesTable()
  activitiesStorage.saveActivities(loggedActivities)

  // Update the saved projects and then the view
  savedProjects[1] = mapHandling.arrayToMap(arg.newSavedProjects)
  updateProjectsDropdown()
})

ipcRenderer.on('sheeptime:activity:deleted', function (event, arg) {
  loggedActivities.activitiesArray = arg
})

function updateProjectsDropdown () {
  console.log('updateprojects')
  var output = '<select name="savedProjects">'
  // If the savedProjects map is empty add an error to the error list
  if (savedProjects[1].size === 0) {
    errors.push('Please add a project before tracking loggedActivities')
    return
  }
  // Otherwise generate the savedProjects dropdown
  savedProjects[1].forEach(function (elem, id) {
    console.log(elem.name)
    output +=
      // Each option hild the project's ID in his "value" attribute
      '<option value="' + id + '">' +
      (elem.name) +
      '</option>'
  })
  output += '</select>'
  getElementByID('projectsDropdown').innerHTML = output
}

