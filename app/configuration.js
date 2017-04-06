/**
 * Created by lx4r on 01.09.16.
 *
 * Settings in the settings file:
 * savefile-directory (path)
 * time-format ('european' or 'american')
 * show-deletion-confirmation (boolean)
 */
// TODO: Update this
'use strict'

const os = require('os')
const nconf = require('nconf').file({file: getUserHome() + '/sheeptime-config.json'})

function saveSettings (settingKey, settingValue) {
  nconf.set(settingKey, settingValue)
  nconf.save()
}

function readSettings (settingKey) {
  nconf.load()
  return nconf.get(settingKey)
}

function getUserHome () {
  return os.homedir()
}

module.exports = {
  saveSettings: saveSettings,
  readSettings: readSettings,
  getUserHome: getUserHome
}
