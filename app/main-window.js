/**
 * Created by lx4r on 18.08.16.
 */
'use strict'

var projectsStorage = require('./storage/projectsStorage')
var activitiesStorage = require('./storage/activitiesStorage')
var ipcRenderer = require('electron').ipcRenderer
var mapHandling = require('./mapHandling')

//var currentSeconds = 0

var errors = []
var vm

// ---- DEV ----

const Vue = require('vue')

Vue.component('main-window', require('./vue/main-window.vue'))
Vue.component('activity-list', require('./vue/main-window/activity-list.vue'))
Vue.component('projects-dropdown', require('./vue/main-window/projects-dropdown.vue'))
Vue.component('activity-input', require('./vue/main-window/activity-input.vue'))

vm = new Vue({
  el: '#main',
  render: h => h('main-window')
})

errors.forEach(function (err) {
  console.error(err)
})

$('#settings-link').on('click', function () {
  ipcRenderer.send('open-settings-window')
})

/*
 // If a project is added in the project window, update the project dropdown in this window
 ipcRenderer.on('project-added', function (event, arg) {
 savedProjects[1] = mapHandling.arrayToMap(arg)
 //updateProjectsDropdown()
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
 //updateProjectsDropdown()
 }) */