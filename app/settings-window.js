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
const shell = require('electron').shell
$('.open-in-browser').click((event) => {
  event.preventDefault()
  shell.openExternal(event.target.href)
})
