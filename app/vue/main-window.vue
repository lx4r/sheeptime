<template>
    <div class="container" id="app">
        <div v-if="dataReceived">
            <activity-input :pl="projects.projectsArray" :bus="bus"></activity-input>
            <activity-list :pl="projects.projectsArray" :bus="bus" v-on:continueActivity="continueActivity"></activity-list>
        </div>
        <div v-else>Loading</div>
    </div>
</template>
<script>
  const ipcRenderer = require('electron').ipcRenderer
  const Vue = require('vue')

  let data = {
    dataReceived: false,
    projects: {},
    bus: new Vue() // used for communication between the activity list and the activity input
  }

  ipcRenderer.send('sheeptime:savedProjects:send', 'main-window')

  ipcRenderer.on('sheeptime:savedProjects:get', function (event, arg) {
    console.log("Projects received")
    data.projects = arg
    data.dataReceived = true
  })

  ipcRenderer.on('sheeptime:project:deleted', function (event, newProjects) {
    data.projects = newProjects
  })

  ipcRenderer.on('sheeptime:project:added', function (event, newProjects) {
    data.projects = newProjects
  })

  export default {
    methods: {
      continueActivity: function (activity) {
        this.$emit('continueActivityInInput')
      }
    },
    data () {
      return data
    }
  }
</script>