/**
 * Created by lx4r on 02.09.16.
 */
'use strict'

const Vue = require('vue')
var vm // eslint-disable-line

Vue.component('settings-window', require('./vue/settings-window.vue'))
Vue.component('savefile-location', require('./vue/settings-window/savefile-location.vue'))
Vue.component('show-deletion-confirmation', require('./vue/settings-window/show-deletion-confirmation.vue'))
Vue.component('time-format', require('./vue/settings-window/time-format.vue'))

vm = new Vue({
  el: '#settings-window-wrapper',
  render: h => h('settings-window')
})

// open links with the "open-in-browser"-class in the default OS browser
const shell = require('electron').shell;
$('.open-in-browser').click((event) => {
    event.preventDefault();
    shell.openExternal(event.target.href);
})

/* var config = require('./configuration')
var getElementByID = require('./getElementByID')
var fs = require('fs')

var savedTimeFormat = config.readSettings('time-format')
var timeFormatRadios = document.querySelectorAll('.timeFormatRadio')
var savefileDirectory = getElementByID('savefileDirectory')
var savePathButton = getElementByID('savePathButton')

timeFormatRadios.forEach(function (radio) {
  // Set the time format radio to checked that represents the saved time format
  radio.checked = (savedTimeFormat === radio.value)
  $(radio).on('click', function () {
    radio.checked = true
    config.saveSettings('time-format', radio.value)
  })
})

savefileDirectory.value = config.readSettings('savefile-directory')

$('#showDeletionConfirmation').prop('checked', !(config.readSettings('show-deletion-confirmation')))

$(savePathButton).on('click', function () {
  fs.access(savefileDirectory.value, fs.W_OK, function (err) {
    if (!err) {
      // path exists and can be written -> remove error message and save path
      getElementByID('errorMessage').innerHTML = ''
      config.saveSettings('savefile-directory', savefileDirectory.value)
    } else {
      // path error -> show error message and reset path input
      getElementByID('errorMessage').innerHTML = '<div class="alert alert-danger" role="alert"><strong>Error:</strong> The path you entered is invalid.</div>'
      savefileDirectory.value = config.readSettings('savefile-directory')
    }
  })
})

$('#showDeletionConfirmation').on('click', function () {
  // upate the settings to reflect the user's choice
  if ($('#showDeletionConfirmation').prop('checked')) {
    // don't show modal again
    config.saveSettings('show-deletion-confirmation', false)
  } else {
    // show modal again
    config.saveSettings('show-deletion-confirmation', true)
  }
}) */
