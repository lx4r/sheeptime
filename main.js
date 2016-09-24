const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

var ipcMain = require('electron').ipcMain
var configuration = require('./app/configuration')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let projectsWindow
let settingsWindow

//DEV
var activitiesStorage = require('./app/activitiesStorage')
var mapHandling = require('./app/mapHandling')
var loggedActivities = activitiesStorage.readActivities()

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 500,
    height: 600
  })

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/app/index.html`)

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
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

ipcMain.on('open-savedProjects-window', function () {
  if (projectsWindow) {
    return
  }

  projectsWindow = new BrowserWindow({
    height: 600,
    width: 400
  })

  projectsWindow.loadURL(`file://${__dirname}/app/editProjects.html`)

  projectsWindow.webContents.openDevTools()

  projectsWindow.on('closed', function () {
    projectsWindow = null
  })
})

ipcMain.on('open-settings-window', function () {
  if (settingsWindow) {
    return
  }

  settingsWindow = new BrowserWindow({
    height: 600,
    width: 400
  })

  settingsWindow.loadURL(`file://${__dirname}/app/settings.html`)

  settingsWindow.webContents.openDevTools()

  settingsWindow.on('closed', function () {
    settingsWindow = null
  })
})

// Pass notifications on
// "project added": savedProjects window -> main window
ipcMain.on('project-added', function (event, arg) {
  if (mainWindow) {
    mainWindow.webContents.send('project-added', arg)
  }
})
// "activity tracked": main window -> savedProjects window
ipcMain.on('activity-tracked', function (event, arg) {
  if (projectsWindow) {
    projectsWindow.webContents.send('activity-tracked', arg)
  }
})
// "activity deleted": main window -> savedProjects window
ipcMain.on('activity-deleted', function (event, arg) {
  if (projectsWindow) {
    projectsWindow.webContents.send('activity-deleted', arg)
  }
})
// "project deleted": savedProjects window -> main window
ipcMain.on('project-deleted', function (event, arg) {
  if (mainWindow) {
    mainWindow.webContents.send('project-deleted', arg)
  }
})

// "activity deleted": main window -> savedProjects window
ipcMain.on('sheeptime:delete-activity', function (event, arg) {
  console.log("Deleted: " + arg)
  console.log(app.test)
})

//DEV

ipcMain.on('sheeptime:loggedActivities:send', function (event, arg) {
  mainWindow.webContents.send('sheeptime:loggedActivities:get', loggedActivities)
})

ipcMain.on('sheeptime:activity:delete', function (event, arg) {
  console.log("Delete " + arg)
  loggedActivities.activitiesArray = mapHandling.deleteElement(loggedActivities.activitiesArray, arg)
  if (mainWindow) {
    mainWindow.webContents.send('sheeptime:activity:deleted', loggedActivities.activitiesArray)
  }
  activitiesStorage.saveActivities(loggedActivities)
})

ipcMain.on('test', function (event, arg) {
  test = {array: [[61,{"projectID":5,"name":"asdfYAY","duration":2,"startTime":1472929376284,"endTime":1472929378533}]]}
})