<template>
    <div class="container" id="app">
        <div v-if="dataReceived">
            <activity-input :pl="projects.projectsArray"></activity-input>
            <activity-list :pl="projects.projectsArray"></activity-list>
        </div>
        <div v-else>Loading</div>
    </div>
</template>
<script>
    const ipcRenderer = require('electron').ipcRenderer
    var data = {
        dataReceived: false,
        projects: {},
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
        data () {
            return data
        }
    }
</script>