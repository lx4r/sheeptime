/**
 * Created by lx4r on 18.08.16.
 */
'use strict'

var ipcRenderer = require('electron').ipcRenderer

var errors = []
var vm // eslint-disable-line

const Vue = require('vue')

Vue.component('main-window', require('./vue/main-window.vue'))
Vue.component('activity-list', require('./vue/main-window/activity-list.vue'))
Vue.component('activity-input', require('./vue/main-window/activity-input.vue'))
Vue.component('edit-activity', require('./vue/main-window/edit-activity.vue'))

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
