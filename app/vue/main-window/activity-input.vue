<template>
    <div>
        <div class="row">
            <h1 id="timer">{{secondsToTime(currentSeconds)}}</h1>
        </div>
        <div class="row" v-if="pl.length > 0">
            <form>
                <div class="col-md-4 col-sm-12 col-xs-12 col-md-offset-2">
                    <input type="text" class="form-control" id="activityName" placeholder="activity" v-model="activityName">
                </div>
                <div class="col-md-4 col-sm-12 col-xs-12">
                    <projects-dropdown :pl="pl"></projects-dropdown>
                </div>
            </form>
        </div>

        <div class="row" v-else>
            <div class="col-md-8 col-md-offset-2">
                <div class="alert alert-danger" role="alert">Please add a project before tracking activities</div>
            </div>
        </div>

        <div class="row" id="buttonRow">
            <div class="col-md-6 col-sm-12 col-xs-12 col-md-offset-3">
            <span v-if="pl.length > 0">
                <button class="btn btn-success" v-if="stopwatchRunning == false" v-on:click="startstop()">Start</button>
                <button class="btn btn-danger" v-else v-on:click="startstop()">Stop</button>
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
    }
    let intervalID
    let startTime


    export default {
        props: ['pl'],
        methods: {
            startstop: function () {
                // stopwatch is running -> button acts as stop button
                if (data.stopwatchRunning === true){
                    clearInterval(intervalID)
                    data.stopwatchRunning = false
                    ipcRenderer.send('sheeptime:stopwatch:stopped')

                    // Create the new activity
                    // TODO: Use Vue for this
                    let activityProjectID = parseInt(getElementByID('projectsDropdown').value)
                    let endTime = formatTime.JSTimstampToUNIXTimestamp(Date.now())

                    let addedActivity = activityModel.createActivity(data.activityName, data.currentSeconds, activityProjectID, startTime, endTime)
                    ipcRenderer.send('sheeptime:activity:add', addedActivity)

                    data.activityName = ""
                    data.currentSeconds = 0
                    // stopwatch is not running -> button acts as start button
                } else {
                    startTime = formatTime.JSTimstampToUNIXTimestamp(Date.now())
                    data.stopwatchRunning = true
                    intervalID = setInterval(function () {
                        data.currentSeconds++
                    }, 1000)
                    ipcRenderer.send('sheeptime:stopwatch:started')
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
        },
        data () {
            return data
        }
    }
</script>