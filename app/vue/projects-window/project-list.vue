<template>
    <div class="row">
        <div class="col-md-6 col-md-offset-3">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">Projects</h3>
                </div>
                <div v-if="dataReceived > 1" id="project-list">
                    <ul class="list-group" v-if="projects.projectsArray.length > 0">
                        <li class="list-group-item project-body" v-for="project in projects.projectsArray">
                            <div class="row">
                                <div class="col-xs-6 col-sm-8 col-md-6 project-name-column">
                                        <span class="badge project-title" :style='"background-color:" + project[1].color'>
                                            {{project[1].name}}
                                            <i v-show='project[1].name === ""'>(no name)</i>
                                        </span>
                                </div>
                                <div class="col-xs-3 col-sm-2 col-md-3 project-button-column">
                                    <span v-show="!stopwatchRunning">
                                        <button v-show="deletionConfirmation" type="button" class="btn btn-xs btn-danger" data-toggle="modal" data-target="#deletionConfirmation" v-on:click="setProjectToDelete(project[0])">
                                            <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                                        </button>
                                        <button v-show="!deletionConfirmation" type="button" class="btn btn-xs btn-danger" v-on:click="deleteProject(project[0])">
                                            <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                                        </button>
                                    </span>
                                    <button type="button" class="btn btn-xs btn-info" data-toggle="modal" data-target="#edit-project" v-on:click="setProjectToEdit(project)">
                                        <span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>
                                    </button>
                                    <button type="button" class="btn btn-xs btn-success" data-toggle="modal" data-target="#report" v-on:click="getReportForProject(project[0], project[1])">
                                        <span class="glyphicon glyphicon-list-alt" aria-hidden="true"></span>
                                    </button>
                                </div>
                                <div class="col-xs-3 col-sm-2 col-md-3 project-time-column">
                                    {{secondsToTime(project[1].totalSeconds)}}
                                </div>
                            </div>
                        </li>
                    </ul>
                    <div v-else>
                        Loading
                    </div>
                </div>
            </div>
            <deletion-confirmation :projectToDelete="projectToDelete"></deletion-confirmation>
            <report :activitiesForReport="activitiesForReport" :reportProject="reportProject"></report>
            <edit-project :projectToEdit="projectToEdit" :colors="colors"></edit-project>
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
    reportProject: null,
    projectToEdit: null
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
  })

  export default {
    props: ['colors'],
    methods: {
      secondsToTime: function (seconds) {
        return formatTime.secondsToTimeString(seconds)
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
      },
      setProjectToEdit: function (newProjectToEdit) {
        data.projectToEdit = newProjectToEdit
        console.log(data)
      }
    },
    data(){
      return data
    }
  }
</script>