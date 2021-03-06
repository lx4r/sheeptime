<template>
    <div class="row">
        <div class="col-md-8 col-md-offset-2">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">Activities</h3>
                </div>
                <div id="activity-list" v-if="dataReceived">
                    <ul class="list-group" v-if="activities.activitiesArray.length > 0">
                        <li class="list-group-item activity-body" v-for="activity in activities.activitiesArray">
                            <div class="row">
                                <div class="col-xs-6 col-sm-8 col-md-6">
                                    <div class="activity-title">
                                        {{activity[1].name}}
                                        <i v-show='activity[1].name === ""'>(no name)</i>
                                    </div>
                                    <span class="badge" :style='"background-color:" + getProjectColor(pl, activity[1].projectID)'>{{getProjectName(pl, activity[1].projectID)}}</span><br>
                                </div>
                                <div class="col-xs-3 col-sm-2 col-md-3 activity-button-column">
                                    <button v-on:click="deleteActivity(activity[0])" type="button" class="btn btn-xs btn-danger deleteActivityButton" aria-label="Left Align">
                                        <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                                    </button>
                                    <button type="button" class="btn btn-xs btn-info" data-toggle="modal" data-target="#edit-activity" v-on:click="setActivityToEdit(activity)">
                                        <span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>
                                    </button>
                                    <button type="button" class="btn btn-xs btn-success" data-toggle="modal" data-target="" v-on:click="continueActivity(activity, bus)">
                                        <span class="glyphicon glyphicon-play" aria-hidden="true"></span>
                                    </button>
                                </div>
                                <div class="col-xs-3 col-sm-2 col-md-3  activity-time-column">
                                    <a type="button" class="activity-time" v-bind:href="'#activity-' + activity[0]" data-toggle="collapse" v-bind:data-target="'#activity-' + activity[0]">{{secondsToTime(activity[1].duration)}}</a>
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

  // used for change detection
  let activityToEditPrevString = null;

  ipcRenderer.send('sheeptime:loggedActivities:send', 'main-window')

  ipcRenderer.on('sheeptime:loggedActivities:get', function (event, arg) {
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

  // check whether activity has been changed when the edit modal is closed
  $(document).on('hide.bs.modal','#edit-activity', function () {
    if (!(JSON.stringify(data.activityToEdit) === activityToEditPrevString)){
      // activity has been changed -> save updated activities list
      ipcRenderer.send('sheeptime:activity:edit', data.activityToEdit)
    }
  })

  export default {
    props: ['pl', 'bus'],
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
        // additional data about the activity (everything beyond the data that is saved in the JSON file)
        data.activityToEditProperties = {
          durationObjectPrev: activityDurationObject, // serves as basis point for detecting changes to the duration
          startTimeString : formatTime.timestampToTimeString(activityContent.startTime),
          endTimeString: formatTime.timestampToTimeString(activityContent.endTime),
          dateString: formatTime.timestampToDateString(activityContent.startTime),
          durationHours: activityDurationObject.hours,
          durationMinutes: activityDurationObject.minutes,
          durationSeconds: activityDurationObject.seconds,
          startTimePrev: activityContent.startTime,
          endTimePrev: activityContent.endTime,
        }
        // save a stringified version of the activity to later determine whether it has been changed
        activityToEditPrevString = JSON.stringify(newActivityToEdit)
      },
      continueActivity: function (activity, bus) {
        bus.$emit('continue-activity', activity)
      }
    },
    data(){
      return data
    }
  }
</script>