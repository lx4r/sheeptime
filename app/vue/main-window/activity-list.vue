<template>
    <div class="row">
        <div class="col-md-8 col-md-offset-2">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">Activities</h3>
                </div>
                <div class="panel-body">
                    <div v-if="dataReceived" id="activity-list-table">
                        <table class="table table-striped" v-if="activities.activitiesArray.length > 0">
                            <thead>
                            <tr>
                                <th>Activity</th>
                                <th>Project</th>
                                <th>Time</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="activity in activities.activitiesArray">
                                <td>{{activity[1].name}}</td>
                                <td>
                                    <span class="badge" :style='"background-color:" + getProjectColor(pl, activity[1].projectID)'>{{getProjectName(pl, activity[1].projectID)}}</span>
                                </td>
                                <td>
                                    <a type="button" v-bind:href="'#activity-' + activity[0]" data-toggle="collapse" v-bind:data-target="'#activity-' + activity[0]">{{secondsToTime(activity[1].duration)}}</a>
                                    <div class="collapse" v-bind:id="'activity-' + activity[0]">
                                        {{timestampToDate(activity[1].startTime)}} - {{timestampToDate(activity[1].endTime)}}
                                    </div>
                                </td>
                                <td>
                                    <button v-on:click="deleteActivity(activity[0])" type="button" class="btn btn-xs btn-danger deleteActivityButton" aria-label="Left Align">
                                        <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                                    </button>
                                    <button type="button" class="btn btn-xs btn-info" data-toggle="modal" data-target="#edit-activity" v-on:click="setActivityToEdit(activity)">
                                        <span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>
                                    </button>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <div class="text-muted" v-else>
                            No activities yet.
                        </div>
                    </div>
                    <div v-else>
                        Loading
                    </div>
                </div>
            </div>
            <edit-activity :activityToEdit="activityToEdit"></edit-activity>
        </div>
    </div>
</template>

<script>
  const formatTime = require('./../../formatTime')
  const ipcRenderer = require('electron').ipcRenderer
  const mapHandling = require('./../../mapHandling')

  var data = {
    activities: {},
    dataReceived: false,
    activityToEdit: null,
  }

  ipcRenderer.send('sheeptime:loggedActivities:send', 'main-window')

  ipcRenderer.on('sheeptime:loggedActivities:get', function (event, arg) {
    console.log("Activities received")
    data.activities = arg
    data.dataReceived = true
  })

  // Update the view after deleting an activity
  ipcRenderer.on('sheeptime:activity:deleted', function (event, arg) {
    data.activities = arg
  })

  // Update the view after adding an activity
  ipcRenderer.on('sheeptime:activity:added', function (event, arg) {
    data.activities = arg
  })

  export default {
    props: ['pl'],
    methods: {
      secondsToTime: function (seconds) {
        return formatTime.secondsToTime(seconds)
      },
      timestampToDate: function (timestamp) {
        return formatTime.timestampToDate(timestamp)
      },
      deleteActivity: function (activityID) {
        ipcRenderer.send('sheeptime:activity:delete', activityID)
      },
      getProjectName: function (projectListArray, projectID) {
        return mapHandling.getElement(projectListArray, projectID).name
      },
      getProjectColor: function (projectListArray, projectID) {
        return mapHandling.getElement(projectListArray, projectID).color
      },
      setActivityToEdit: function (newActivityToEdit) {
        console.log(newActivityToEdit);
        data.activityToEdit = newActivityToEdit;
      }
    },
    data(){
      return data
    }
  }
</script>