<template>
    <div class="row" id="project-list">
        <div class="col-md-6 col-md-offset-3">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">Projects</h3>
                </div>
                <div class="panel-body">
                    <div v-if="dataReceived > 1" id="project-list-table">
                        <table class="table table-striped" v-if="projects.projectsArray.length > 0">
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Total time</th>
                                <th></th>
                                <th v-show="!stopwatchRunning"></th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="project in projects.projectsArray">
                                <td>{{project[1].name}}</td>
                                <td>
                                    {{secondsToTime(project[1].totalSeconds)}}
                                </td>
                                <td>
                                    <button type="button" class="btn btn-xs btn-info" data-toggle="modal" data-target="#report" v-on:click="getReportForProject(project[0], project[1])">
                                        <span class="glyphicon glyphicon-list-alt" aria-hidden="true"></span> Report
                                    </button>
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
            <report :activitiesForReport="activitiesForReport" :reportProject="reportProject"></report>
        </div>
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
        stopwatchRunning: false,
        activitiesForReport: [],
        reportProject: {}
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

    ipcRenderer.on('sheeptime:activity:added', function (event, newProjects) {
        data.projects = newProjects
    })

    ipcRenderer.on('sheeptime:report:get', function (event, projectActivities) {
        data.activitiesForReport = projectActivities
        console.log(projectActivities)
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
                data.projectToDelete = projectID
            },
            getReportForProject: function (projectID, project) {
                ipcRenderer.send('sheeptime:report:send', projectID)
                data.reportProject = project
            }
        },
        data(){
            return data
        }
    }
</script>