<template>
    <div>
        <div class="row">
            <h1 id="timer">{{secondsToTime(currentSeconds)}}</h1>
        </div>
        <div class="row">
            <form>
                <div class="col-md-4 col-sm-12 col-xs-12 col-md-offset-2">
                    <input type="text" class="form-control" id="activityName" placeholder="activity" v-model="activityName">
                </div>
                <div class="col-md-4 col-sm-12 col-xs-12">
                    <select class="form-control" id="projectsDropdownActivityInput" v-model="activityProjectID" @change="updateProjectWarning()">
                        <option disabled value="-1">Please select a project</option>
                        <option v-for="project in pl" :value="project[0]">
                            {{project[1].name}}
                        </option>
                    </select>
                </div>
            </form>
        </div>

        <div class="row" v-show="showProjectWarning">
            <div class="col-md-8 col-md-offset-2">
                <div class="alert alert-danger" role="alert">Please create and select a project before tracking activities</div>
            </div>
        </div>

        <div class="row" id="buttonRow">
            <div class="col-md-6 col-sm-12 col-xs-12 col-md-offset-3">
            <span>
                <button class="btn btn-success" v-show="stopwatchRunning == false" v-on:click="startstop()">Start</button>
                <button class="btn btn-danger" v-show="stopwatchRunning" v-on:click="startstop()">Stop</button>
            </span>
                <button class="btn btn-primary" id="projectsButton" v-on:click="openProjects()">Projects</button>
                <button type="button" class="btn btn-default" v-on:click="openSettings()">
                    <span class="glyphicon glyphicon-cog"></span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
  const ipcRenderer = require('electron').ipcRenderer
  const formatTime = require('./../../formatTime')
  const getElementByID = require('./../../getElementByID')
  const activityModel = require('./../../storage/activityModel')

  let data = {
    stopwatchRunning: false,
    currentSeconds: 0,
    activityName: "",
    activityProjectID: -1,
    showProjectWarning: false
  }
  let intervalID
  let startTime


  export default {
    props: ['pl', 'bus'],
    methods: {
      startstop: function () {
        // stopwatch is running -> button acts as stop button
        if (data.stopwatchRunning === true){
          clearInterval(intervalID)
          data.stopwatchRunning = false
          ipcRenderer.send('sheeptime:stopwatch:stopped')

          // Create the new activity
          let endTime = formatTime.JSTimstampToUNIXTimestamp(Date.now())

          let addedActivity = activityModel.createActivity(data.activityName, data.currentSeconds, data.activityProjectID, startTime, endTime)
          ipcRenderer.send('sheeptime:activity:add', addedActivity)

          data.activityName = ""
          data.currentSeconds = 0
          // stopwatch is not running -> button acts as start button
        } else {
          if (this.activityProjectID === -1){
            // show the warning and don't start the stopwatch if no project has been selected
            this.showProjectWarning = true
          } else {
            this.showProjectWarning = false
            startTime = formatTime.JSTimstampToUNIXTimestamp(Date.now())
            data.stopwatchRunning = true
            intervalID = setInterval(function () {
              data.currentSeconds++
            }, 1000)
            ipcRenderer.send('sheeptime:stopwatch:started')
          }
        }
      },
      openProjects: function () {
        ipcRenderer.send('sheeptime:projects:open')
      },
      openSettings: function () {
        ipcRenderer.send('sheeptime:settings:open')
      },
      secondsToTime: function (seconds) {
        return formatTime.secondsToTimeString(seconds)
      },
      updateProjectWarning: function () {
        // remove project warning if a project is selected
        if (this.showProjectWarning === true && this.activityProjectID !== -1){
          this.showProjectWarning = false
        }
      }
    },
    data () {
      return data
    },
    mounted() {
      (function (that){
        that.bus.$on('continue-activity', function (activity) {
          if (!that.stopwatchRunning) {
            that.activityName = activity[1].name
            that.activityProjectID = activity[1].projectID
            that.startstop()
          }
        })
      })(this)
    },
  }
</script>