/**
 * Created by lx4r on 20.08.16.
 */

var ipcRenderer = require('electron').ipcRenderer
var projectsStorage = require('./projectsStorage.js')
var mapHandling = require('./mapHandling')
var formatTime = require('./formatTime')
var getElementByID = require('./getElementByID')
var config = require('./configuration')

var savedProjects = projectsStorage.readProjects()
var projectToBeDeletedID
var openAreYouSure = ''

// Only show the "Are you sure" modal if the setting for showing it is true
if (config.readSettings('show-deletion-confirmation') === true) {
  openAreYouSure = 'data-toggle="modal" data-target="#areYouSure"'
}

// Initialise the view
updateProjectsTable()

$('#addProjectButton').on('click', function () {
  var projectName = getElementByID('projectName')
  // Don't create a new project if the input for the project name is empty
  if (!projectName.value) {
    return
  }
  // Add the new project to the project map with the fresh ID from the save file as ID
  savedProjects[1].set(savedProjects[0], {name: projectName.value, totalSeconds: 0})
  // Increment the fresh ID
  savedProjects[0]++
  projectName.value = ''
  updateProjectsTable()
  projectsStorage.saveProjects(savedProjects)
  console.log(savedProjects)
  ipcRenderer.send('project-added', mapHandling.mapToArray(savedProjects[1]))
})

/* Save the ID of the project that could be deleted when the delete button is clicked -> the modal is opened */
$('#projectsTable').on('click', 'button.deleteProjectButton', function () {
  projectToBeDeletedID = $(this).data('id')
  // Immediately delete the project if the setting for showing the confirmation is false
  if (config.readSettings('show-deletion-confirmation') === false){
    deleteProject()
  }
})

// click on confirm button deletes project
$('#confirmProjectDeletion').on('click', function () {
  deleteProject()
})

// Save the decison and remove the link to the modal if the user chooses to hide the deletion confirmation

// If an activity is added in the main window, update the project list in this window
ipcRenderer.on('activity-tracked', function (event, arg) {
  savedProjects[1] = mapHandling.arrayToMap(arg)
  updateProjectsTable()
})

// If an activity is deleted in the main window, update the project list in this window
ipcRenderer.on('activity-deleted', function (event, arg) {
  savedProjects[1] = mapHandling.arrayToMap(arg)
  updateProjectsTable()
})

function updateProjectsTable () {
  var projectsTable = getElementByID('projectsTable')
  // If the savedProjects file only contains the fresh id
  if (savedProjects[1].size === 0) {
    projectsTable.innerHTML = 'No projects'
    return
  }
  var output = '<table class="table"><tr><th>Project name</th><th>Total time</th><th></th></tr>'
  // Loop over the savedProjects map
  savedProjects[1].forEach(function (elem, id) {
    output +=
      '<tr>' +
        '<td>' +
          elem.name +
        '</td>' +
        '<td>' +
          formatTime.secondsToTime(elem.totalSeconds) +
        '</td>' +
        '<td>' +
          '<button type="button" class="btn btn-xs btn-danger deleteProjectButton" ' + openAreYouSure + ' data-id="' + id + '">' +
            '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span> Delete' +
          '</button>' +
        '</td>' +
      '</tr>'
  })
  output += '</table>'
  projectsTable.innerHTML = output
}

function deleteProject () {
  // Delete the activity with the ID of the before clicked delete button from the project map, update the projects table and save the new storage array to the JSON file
  savedProjects[1].delete(projectToBeDeletedID)
  updateProjectsTable()
  projectsStorage.saveProjects(savedProjects)

  var arg = ({deletedProjectID: projectToBeDeletedID, newSavedProjects: mapHandling.mapToArray(savedProjects[1])})
  ipcRenderer.send('project-deleted', arg)

  // If the modal was shown ...
  if (openAreYouSure != ''){
    // ... and the checkbox was checked ...
    if ($('#dontShowDeletionConfirmationAgain').prop('checked') === true){
      // ... save the users decision and remove the links from the deletion buttons to the modal
      config.saveSettings('show-deletion-confirmation', false)
      openAreYouSure = ''
      updateProjectsTable()
    }
  }
}
