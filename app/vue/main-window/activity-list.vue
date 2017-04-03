<template>
    <div class="row">
        <div class="col-md-8 col-md-offset-2">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">Activities</h3>
                </div>
                <div v-if="dataReceived" id="activity-list-table">
                    <ul class="list-group" v-if="activities.activitiesArray.length > 0">
                        <li class="list-group-item" v-for="activity in activities.activitiesArray">
                            <div class="row">
                                <div class="col-xs-6">
                                    {{activity[1].name}}<br>
                                    <span class="badge" :style='"background-color:" + getProjectColor(pl, activity[1].projectID)'>{{getProjectName(pl, activity[1].projectID)}}</span><br>
                                </div>
                                <div class="col-xs-2">
                                    <button v-on:click="deleteActivity(activity[0])" type="button" class="btn btn-xs btn-danger deleteActivityButton" aria-label="Left Align">
                                        <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                                    </button>
                                    <button type="button" class="btn btn-xs btn-info" data-toggle="modal" data-target="#edit-activity" v-on:click="setActivityToEdit(activity)">
                                        <span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>
                                    </button>
                                </div>
                                <div class="col-xs-4">
                                    <a type="button" v-bind:href="'#activity-' + activity[0]" data-toggle="collapse" v-bind:data-target="'#activity-' + activity[0]">{{secondsToTime(activity[1].duration)}}</a>
                                    <div class="collapse" v-bind:id="'activity-' + activity[0]">
                                        {{timestampToDate(activity[1].startTime)}} - {{timestampToDate(activity[1].endTime)}}
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <div class="text-muted" v-else>
                        No activities yet.
                    </div>
                </div>
                <div v-else>
                    Loading
                </div>
            </div>
            <edit-activity :activityToEdit="activityToEdit" :activityToEditProperties="activityToEditProperties" :projectList="pl"></edit-activity>
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
    activityToEditProperties: null
  }

  let activityToEditPrevString = null;

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

  // save activity when the edit modal is closed
  $(document).on('hide.bs.modal','#edit-activity', function () {
    //ipcRenderer.send('sheeptime:activity:edit', )
    if (!(JSON.stringify(data.activityToEdit) === activityToEditPrevString)){
      // activity has been changed -> save updated activities list
      ipcRenderer.send('sheeptime:activity:edit', data.activityToEdit)
    }
  })

  export default {
    props: ['pl'],
    methods: {
      secondsToTime: function (seconds) {
        return formatTime.secondsToTimeString(seconds)
      },
      timestampToDate: function (timestamp) {
        return formatTime.timestampToDateTimeString(timestamp)
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
        data.activityToEdit = newActivityToEdit;
        let activityContent = newActivityToEdit[1];
        let activityDurationObject = formatTime.secondsToTimeObject(activityContent.duration)
        // data of the activity that needs to be computed before it is shown
        data.activityToEditProperties = {
          durationObject: activityDurationObject,
          startTimeString : formatTime.timestampToTimeString(activityContent.startTime),
          endTimeString: formatTime.timestampToTimeString(activityContent.endTime),
          dateString: formatTime.timestampToDateString(activityContent.startTime),
          durationHours: activityDurationObject.hours,
          durationMinutes: activityDurationObject.minutes,
          durationSeconds: activityDurationObject.seconds,
        }
        // save a stringified version of the activity to later determine whether it has been changed
        activityToEditPrevString = JSON.stringify(newActivityToEdit);
      }
    },
    data(){
      return data
    }
  }
</script>