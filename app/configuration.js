/**
 * Created by lx4r on 01.09.16.
 *
 * Settings in the settings file:
 * savefile-directory
 * time-format ('european'|'american')
 */
'use strict'

var nconf = require('nconf').file({file: getUserHome() + '/sheeptime-config.json'})

function saveSettings (settingKey, settingValue) {
  nconf.set(settingKey, settingValue)
  nconf.save()
}

function readSettings (settingKey) {
  nconf.load()
  return nconf.get(settingKey)
}

function getUserHome () {
  return process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME']
}

module.exports = {
  saveSettings: saveSettings,
  readSettings: readSettings,
  getUserHome: getUserHome
}
