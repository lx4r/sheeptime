<template>
    <div class="modal fade" id="report" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div v-if="reportProject" class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close report-button" data-dismiss="modal"><span>&times;</span></button>
                    <h4 class="modal-title" id="myModalLabel">Report for <i>{{reportProject.name}}</i></h4>
                </div>
                <div class="modal-body" id="report-table">
                    Total time: {{secondsToTime(reportProject.totalSeconds)}}
                    <table v-if="activitiesForReport.length > 0" class="table table-striped">
                        <thead>
                        <tr>
                            <th>Activity</th>
                            <th>Duration</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="activity in activitiesForReport">
                            <td>{{activity.name}}</td>
                            <td>
                                {{secondsToTime(activity.duration)}}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <div v-else>
                        No activities tracked yet.
                    </div>
                </div>
                <div class="modal-footer">
                    <button v-if="activitiesForReport.length > 0" type="button" class="btn btn-default report-button" v-on:click="generatePDFReport(reportProject)">Export to PDF</button>
                    <button type="button" class="btn btn-default report-button" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    const formatTime = require('./../../formatTime')
    const ipcRenderer = require('electron').ipcRenderer

    export default {
        props: ['activitiesForReport', 'reportProject'],
        methods: {
            secondsToTime: function (seconds) {
                return formatTime.secondsToTime(seconds)
            },
            generatePDFReport: function (reportProject) {
                ipcRenderer.send('sheeptime:report:PDF', reportProject)
            }
        }
    }
</script>