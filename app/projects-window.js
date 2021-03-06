/**
 * Created by lx4r on 20.08.16.
 */
'use strict'

const Vue = require('vue')
var vm // eslint-disable-line

Vue.component('projects-window', require('./vue/projects-window.vue'))
Vue.component('project-input', require('./vue/projects-window/project-input.vue'))
Vue.component('project-list', require('./vue/projects-window/project-list.vue'))
Vue.component('deletion-confirmation', require('./vue/projects-window/deletion-confirmation.vue'))
Vue.component('report', require('./vue/projects-window/report.vue'))
Vue.component('edit-project', require('./vue/projects-window/edit-project.vue'))

vm = new Vue({
  el: '#projects-window-wrapper',
  render: h => h('projects-window')
})
