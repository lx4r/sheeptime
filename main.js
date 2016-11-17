'use strict'

const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

var ipcMain = require('electron').ipcMain
var configuration = require('./app/configuration')

let mainWindow
let projectsWindow
let settingsWindow

const activitiesStorage = require('./app/storage/activitiesStorage')
const projectsStorage = require('./app/storage/projectsStorage')
const pdfReport = require('./app/storage/pdfReport')
const mapHandling = require('./app/mapHandling')
const fs = require('fs')
var loggedActivities = activitiesStorage.readActivities()
var savedProjects = projectsStorage.readProjects()

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 500,
    height: 600
  })

  mainWindow.loadURL(`file://${__dirname}/app/main-window.html`)

  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', function () {
  // Save default settings to the config file if these settings haven't been set yet
  if (!configuration.readSettings('time-format')) {
    configuration.saveSettings('time-format', 'european')
  }
  if (!configuration.readSettings('savefile-directory')) {
    configuration.saveSettings('savefile-directory', configuration.getUserHome())
  }
  if (!configuration.readSettings('show-deletion-confirmation')) {
    configuration.saveSettings('show-deletion-confirmation', true)
  }
  if (!configuration.readSettings('project-colors')) {
    configuration.saveSettings('project-colors', ['#e51c23', '#ff9800', '#9c27b0', '#4caf50', '#2196f3'])
  }
  createWindow()
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('sheeptime:projects:open', function () {
  if (projectsWindow) {
    return
  }

  projectsWindow = new BrowserWindow({
    height: 680,
    width: 500
  })

  projectsWindow.loadURL(`file://${__dirname}/app/projects-window.html`)

  projectsWindow.webContents.openDevTools()

  projectsWindow.on('closed', function () {
    projectsWindow = null
  })
})

ipcMain.on('sheeptime:settings:open', function () {
  if (settingsWindow) {
    return
  }

  settingsWindow = new BrowserWindow({
    height: 600,
    width: 400
  })

  settingsWindow.loadURL(`file://${__dirname}/app/settings-window.html`)

  settingsWindow.webContents.openDevTools()

  settingsWindow.on('closed', function () {
    settingsWindow = null
  })
})

// Send the activities to the view
// Flow: controller -> main window/projects-window
ipcMain.on('sheeptime:loggedActivities:send', function (event, targetWindow) {
  event.sender.send('sheeptime:loggedActivities:get', loggedActivities)
})

ipcMain.on('sheeptime:savedProjects:send', function (event, targetWindow) {
  event.sender.send('sheeptime:savedProjects:get', savedProjects)
})

ipcMain.on('sheeptime:config:deletion-confirmation:send', function (event, arg) {
  event.sender.send('sheeptime:config:deletion-confirmation:get', configuration.readSettings('show-deletion-confirmation'))
})

ipcMain.on('sheeptime:config:colors:send', function (event, arg) {
  console.log('colors: ' + configuration.readSettings('project-colors'))
  event.sender.send('sheeptime:config:colors:get', configuration.readSettings('project-colors'))
})

ipcMain.on('sheeptime:config:deletion-confirmation:set', function (event, newStatus) {
  configuration.saveSettings('show-deletion-confirmation', newStatus)
  // Update the status in the projects window and the settings window
  if (settingsWindow) {
    settingsWindow.webContents.send('sheeptime:config:deletion-confirmation:get', newStatus)
  }
  if (projectsWindow) {
    projectsWindow.webContents.send('sheeptime:config:deletion-confirmation:get', newStatus)
  }
})

ipcMain.on('sheeptime:config:time-format:send', function (event, arg) {
  event.sender.send('sheeptime:config:time-format:get', configuration.readSettings('time-format'))
})

ipcMain.on('sheeptime:config:time-format:set', function (event, newTimeFormat) {
  configuration.saveSettings('time-format', newTimeFormat)
})

ipcMain.on('sheeptime:config:savefile-location:send', function (event, arg) {
  event.sender.send('sheeptime:config:savefile-location:get', configuration.readSettings('savefile-directory'))
})

ipcMain.on('sheeptime:config:savefile-location:set', function (event, newSaveFileDir) {
  fs.access(newSaveFileDir, fs.W_OK, function (err) {
    if (!err) {
      console.log('success in main')
      // path exists and can be written -> save path
      configuration.saveSettings('savefile-directory', newSaveFileDir)
      activitiesStorage.saveActivities(loggedActivities)
      projectsStorage.saveProjects(savedProjects)
      event.sender.send('sheeptime:config:savefile-location:set:done', true)
    } else {
      // path error
      event.sender.send('sheeptime:config:savefile-location:set:done', false)
    }
  })
})

// Event: user deleted an activity
// Flow: main window -> controller
ipcMain.on('sheeptime:activity:delete', function (event, deletedActivityID) {
  console.log('Delete ' + deletedActivityID)
  // Save a reference to the activity for finding it's project
  var activity = mapHandling.getElement(loggedActivities.activitiesArray, deletedActivityID)
  // Delete the activity from the storage object
  loggedActivities.activitiesArray = mapHandling.deleteElement(loggedActivities.activitiesArray, deletedActivityID)

  // Pass the changed activities storage object to the view
  // Flow: controller -> main window
  if (mainWindow) {
    mainWindow.webContents.send('sheeptime:activity:deleted', loggedActivities)
  }

  // Then update the new total time of the project the activity was associated with
  var activityProject = mapHandling.getElement(savedProjects.projectsArray, activity.projectID)
  console.log(activityProject)
  activityProject.totalSeconds += -(activity.duration)
  savedProjects.projectsArray = mapHandling.setElement(savedProjects.projectsArray, activity.projectID, activityProject)

  activitiesStorage.saveActivities(loggedActivities)
  projectsStorage.saveProjects(savedProjects)
})

// Event: user added an activity
// Flow: main window -> controller
ipcMain.on('sheeptime:activity:add', function (event, addedActivity) {
  // Add the new activity to the loggedActivities map
  loggedActivities.activitiesArray = mapHandling.setElement(loggedActivities.activitiesArray, loggedActivities.freshID, addedActivity)

  // Increment the fresh ID
  loggedActivities.freshID++

  // Pass the changed activities storage object to the view
  // Flow: controller -> main window
  event.sender.send('sheeptime:activity:added', loggedActivities)

  // Update the total time of the activity's project in the project map by adding the number of elapsed seconds
  let activityProject = mapHandling.getElement(savedProjects.projectsArray, addedActivity.projectID)
  activityProject.totalSeconds += addedActivity.duration
  savedProjects.projectsArray = mapHandling.setElement(savedProjects.projectsArray, addedActivity.projectID, activityProject)

  // Pass the changed projects storage object to the view
  // Flow: controller -> projects window
  if (projectsWindow) {
    projectsWindow.webContents.send('sheeptime:activity:added', savedProjects)
  }

  activitiesStorage.saveActivities(loggedActivities)
  projectsStorage.saveProjects(savedProjects)
})

// Event: user deleted a project
// Flow: projects window -> controller
ipcMain.on('sheeptime:project:delete', function (event, deletedProjectsID) {
  // Delete the project from the storage object
  savedProjects.projectsArray = mapHandling.deleteElement(savedProjects.projectsArray, deletedProjectsID)

  // Pass the changed storage object to the view
  // Flow: controller -> projects window, main window
  if (projectsWindow) {
    projectsWindow.webContents.send('sheeptime:project:deleted', savedProjects)
  }
  if (mainWindow) {
    mainWindow.webContents.send('sheeptime:project:deleted', savedProjects)
  }

  // Delete all the activities that were associated with that project
  var activitiesMap = mapHandling.arrayToMap(loggedActivities.activitiesArray)
  activitiesMap.forEach(function (elem, id) {
    if (elem.projectID === deletedProjectsID) {
      activitiesMap.delete(id)
    }
  })
  loggedActivities.activitiesArray = mapHandling.mapToArray(activitiesMap)

  // Pass the changed activities storage object to the view
  // Flow: controller -> main window
  if (mainWindow) {
    mainWindow.webContents.send('sheeptime:activity:deleted', loggedActivities)
  }

  activitiesStorage.saveActivities(loggedActivities)
  projectsStorage.saveProjects(savedProjects)
})

// Event: user added a project
// Flow: projects window -> controller
ipcMain.on('sheeptime:project:add', function (event, newProjectObject) {
  // Construct new project, add it to the projects storage and increase the fresh ID
  var newProject = {name: newProjectObject.name, color: newProjectObject.selectedColor, totalSeconds: 0}
  savedProjects.projectsArray = mapHandling.setElement(savedProjects.projectsArray, savedProjects.freshID, newProject)
  savedProjects.freshID++

  // Pass the changed storage object to the view
  // Flow: controller -> projects window, main window
  if (projectsWindow) {
    projectsWindow.webContents.send('sheeptime:project:added', savedProjects)
  }
  if (mainWindow) {
    mainWindow.webContents.send('sheeptime:project:added', savedProjects)
  }

  projectsStorage.saveProjects(savedProjects)
})

// Event: user started a stopwatch
// Flow: activities window -> controller
ipcMain.on('sheeptime:stopwatch:started', function (event, arg) {
  // Tell the projects window to prevent the user from deleting projects
  // Flow: controller -> projects window
  if (projectsWindow) {
    projectsWindow.webContents.send('sheeptime:stopwatch:started')
  }
})

// Event: user stopped a stopwatch
// Flow: activities window -> controller
ipcMain.on('sheeptime:stopwatch:stopped', function (event, arg) {
  // Tell the projects window to allow the user to delete projects
  // Flow: controller -> projects window
  if (projectsWindow) {
    projectsWindow.webContents.send('sheeptime:stopwatch:stopped')
  }
})

// Event: user wants a report
// Flow: projects window -> controller
ipcMain.on('sheeptime:report:send', function (event, projectID) {
  var result = []
  var activitiesMap = mapHandling.arrayToMap(loggedActivities.activitiesArray)
  activitiesMap.forEach(function (elem) {
    if (elem.projectID === projectID) {
      result.push(elem)
    }
  })
  // Flow: controller -> projects window
  projectsWindow.webContents.send('sheeptime:report:get', result)
})

// Event: user wants a PDF report
// Flow: projects window -> controller
ipcMain.on('sheeptime:report:PDF', function (event, reportProject) {
  if (!pdfReport.savePDFReport(event, reportProject)) {
    event.sender.send('sheeptime:report:PDF:error')
  }
})
