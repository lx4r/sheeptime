/**
 * Created by lx4r on 02.09.16.
 */
'use strict'

var configuration = require('./configuration')
var getElementByID = require('./getElementByID')
var fs = require('fs')

var savedTimeFormat = configuration.readSettings('time-format')
var timeFormatRadios = document.querySelectorAll('.timeFormatRadio')
var savefileDirectory = getElementByID('savefileDirectory')
var savePathButton = getElementByID('savePathButton')

// Set the time format radio to checked that represents the saved time format and update the settings when a radio button is pressed
timeFormatRadios.forEach(function (radio) {
  radio.checked = (savedTimeFormat === radio.value)
  $(radio).on('click', function () {
    radio.checked = true
    configuration.saveSettings('time-format', radio.value)
  })
})

savefileDirectory.value = configuration.readSettings('savefile-directory')
$(savePathButton).on('click', function () {
  fs.access(savefileDirectory.value, fs.W_OK, function (err) {
    if (!err) {
      // path exists and can be written -> remove error message and save path
      getElementByID('errorMessage').innerHTML = ''
      configuration.saveSettings('savefile-directory', savefileDirectory.value)
    } else {
      // path error -> show error message and reset path input
      getElementByID('errorMessage').innerHTML = '<div class="alert alert-danger" role="alert"><strong>Error:</strong> The path you entered is invalid.</div>'
      savefileDirectory.value = configuration.readSettings('savefile-directory')
    }
  })
})
