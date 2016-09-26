<template>
    <div class="panel panel-default">
        <div class="panel-heading">
            <h3 class="panel-title">Activities</h3>
        </div>
        <div class="panel-body">
            <table class="table">
                <tr>
                    <th>Activity</th>
                    <th>Project</th>
                    <th>Time</th>
                    <th></th>
                </tr>
                <tr v-for="activity in al">
                    <td>{{activity[1].name}}</td>
                    <td>
                        <span class="badge">Project name</span>
                    </td>
                    <td>
                        <a type="button" href="#activity-{{activity[0]}}" data-toggle="collapse" data-target="#activity-{{activity[0]}}">{{secondsToTime(activity[1].duration)}}</a>
                        <div class="collapse" id="activity-{{activity[0]}}">
                            {{timestampToDate(activity[1].startTime)}} - {{timestampToDate(activity[1].endTime)}}
                        </div>
                    </td>
                    <td>
                    <td>
                        <button v-on:click="deleteActivity(activity[0])" type="button" class="btn btn-xs btn-danger deleteActivityButton" aria-label="Left Align">
                            <span class="glyphicon glyphicon-remove" aria-hidden="true"></span> Delete
                        </button>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
    const formatTime = require('./../formatTime')
    const ipcRenderer = require('electron').ipcRenderer
    export default {
        props: ['al'],
        methods: {
            secondsToTime: function (seconds) {
                return formatTime.secondsToTime(seconds)
            },
            timestampToDate: function (timestamp) {
                return formatTime.timestampToDate(timestamp)
            },
            deleteActivity: function (activityID) {
                ipcRenderer.send('sheeptime:activity:delete', activityID)
            }
        }
    }
</script>