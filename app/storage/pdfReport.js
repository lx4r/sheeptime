/**
 * Created by lx4r on 23.10.16.
 */
'use strict'

const fs = require('fs')
const config = require('./../configuration')
const electron = require('electron')
const BrowserWindow = electron.BrowserWindow
const shell = electron.shell

// ensure that the directory for the report exists, then write it to disk
function savePDFReport (event, reportProject) {
  var reportDir = config.readSettings('savefile-directory') + '/SheepTime_reports/'
  // Check whether the directory already exists and create it if not
  fs.access(reportDir, fs.constants.F_OK, function (err) {
    // Dir doesn't exist -> create dir
    if (err) {
      fs.mkdir(reportDir, function (err) {
        // Couldn't create dir
        if (err) {
          return false
        } else {
          console.log("Dir created")
          return writePDFReportFile(event, reportProject, reportDir)
        }
      })
      // Dir exists
    } else {
      console.log("Dir exists")
      return writePDFReportFile(event, reportProject, reportDir)
    }
  })
}

// write the PDF file
function writePDFReportFile(event, reportProject, reportDir) {
  console.log('RP:' + reportProject.name)
  var projectName = reportProject.name.toLowerCase().replace(" ", "_")
  var pdfPath =  reportDir + projectName + '.pdf'
  const win = BrowserWindow.fromWebContents(event.sender)
  win.webContents.printToPDF({}, function (error, data) {
    if (error) throw error
    fs.writeFile(pdfPath, data, function (error) {
      if (error) {
        throw error
      } else {
        // PDF successfully written
        return true
      }
      shell.openExternal('file://' + pdfPath)
    })
  })
}

module.exports = {
  savePDFReport: savePDFReport
}