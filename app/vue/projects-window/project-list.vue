<template>
    <div>
        <div class="panel panel-default">
            <div class="panel-heading">
                <h3 class="panel-title">Projects</h3>
            </div>
            <div class="panel-body">
                <div v-if="dataReceived == 2" id="projects-window-projects-table">
                    <table class="table table-striped" v-if="projects.projectsArray.length > 0">
                        <thead>
                        <tr>
                            <th>Project name</th>
                            <th>Total time</th>
                            <th v-show="!stopwatchRunning"></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="project in projects.projectsArray">
                            <td>{{project[1].name}}</td>
                            <td>
                                {{secondsToTime(project[1].totalSeconds)}}
                            </td>
                            <td v-show="!stopwatchRunning">
                                <button v-if="deletionConfirmation" type="button" class="btn btn-xs btn-danger" data-toggle="modal" data-target="#deletionConfirmation" v-on:click="setProjectToDelete(project[0])">
                                    <span class="glyphicon glyphicon-remove" aria-hidden="true"></span> Delete
                                </button>
                                <button v-else type="button" class="btn btn-xs btn-danger" v-on:click="deleteProject(project[0])">
                                    <span class="glyphicon glyphicon-remove" aria-hidden="true"></span> Delete
                                </button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <div class="text-muted" v-else>
                        No projects yet.
                    </div>
                </div>
                <div v-else>
                    Loading
                </div>
            </div>
        </div>
        <deletion-confirmation :projectToDelete="projectToDelete"></deletion-confirmation>
    </div>
</template>

<script>
    const formatTime = require('./../../formatTime')
    const ipcRenderer = require('electron').ipcRenderer

    var data = {
        projects: {},
        dataReceived: 0,
        deletionConfirmation: true,
        projectToDelete: -1,
        stopwatchRunning: false
    }

    ipcRenderer.send('sheeptime:savedProjects:send', 'projects-window')
    ipcRenderer.send('sheeptime:config:deletion-confirmation:send')

    ipcRenderer.on('sheeptime:config:deletion-confirmation:get', function (event, status) {
        data.deletionConfirmation = status
        data.dataReceived++
    })

    ipcRenderer.on('sheeptime:savedProjects:get', function (event, arg) {
        data.projects = arg
        data.dataReceived++
    })

    ipcRenderer.on('sheeptime:stopwatch:started', function () {
        data.stopwatchRunning = true
    })

    ipcRenderer.on('sheeptime:stopwatch:stopped', function () {
        data.stopwatchRunning = false
    })

    ipcRenderer.on('sheeptime:project:deleted', function (event, newProjects) {
        data.projects = newProjects
    })

    ipcRenderer.on('sheeptime:project:added', function (event, newProjects) {
        data.projects = newProjects
    })

    export default {
        methods: {
            secondsToTime: function (seconds) {
                return formatTime.secondsToTime(seconds)
            },
            deleteProject: function (projectID) {
                ipcRenderer.send('sheeptime:project:delete', projectID)
            },
            setProjectToDelete: function (projectID) {
                console.log("Next to delete: " + projectID)
                data.projectToDelete = projectID
            }
        },
        data(){
            return data
        }
    }
</script>