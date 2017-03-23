<template>
    <div class="modal fade" id="edit-activity" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div v-if="activityToEdit" class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>
                    <h4 class="modal-title" id="myModalLabel" v-if="activityToEdit">Edit activity <i>{{activityToEdit[1].name}}</i></h4>
                </div>
                <div class="modal-body" id="">
                    <!-- Total time: {{secondsToTime(reportProject.totalSeconds)}}
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
                    </div> -->
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  const formatTime = require('./../../formatTime')
  const ipcRenderer = require('electron').ipcRenderer

  export default {
    props: ['activityToEdit'],
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