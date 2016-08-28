const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
// Module for communication between the processes
var ipcMain = require('electron').ipcMain;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let projectsWindow;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 500,
    height: 600
  });

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/app/index.html`);

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

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
});

ipcMain.on('open-savedProjects-window', function () {
  if (projectsWindow) {
    return;
  }

  projectsWindow = new BrowserWindow({
    height: 600,
    width: 400
  });

  projectsWindow.loadURL(`file://${__dirname}/app/editProjects.html`);

  projectsWindow.webContents.openDevTools();

  projectsWindow.on('closed', function () {
    projectsWindow = null;
  });
});

// Pass notifications on
// "project added": savedProjects window -> main window
ipcMain.on('project-added', function (event, arg) {
  if (mainWindow){
    mainWindow.webContents.send('project-added', arg);
  }
});
// "activity tracked": main window -> savedProjects window
ipcMain.on('activity-tracked', function (event, arg) {
  if (projectsWindow){
    projectsWindow.webContents.send('activity-tracked', arg);
  }
});