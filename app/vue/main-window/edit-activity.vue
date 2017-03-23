<template>
    <div class="modal fade" id="edit-activity" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div v-if="activityToEdit" class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>
                    <h4 class="modal-title" id="myModalLabel" v-if="activityToEdit">Edit activity</h4>
                </div>
                <div class="modal-body" id="">
                    <form>
                        <div class="form-group">
                            <label for="activityName">Name</label>
                            <input type="text" class="form-control" id="activityName" :value="activityToEdit[1].name">
                        </div>
                        <div class="form-group">
                            <label for="projectsDropdown">Project</label>
                            <projects-dropdown :pl="projectList"></projects-dropdown>
                        </div>
                        <div class="form-group">
                            <input data-provide="datepicker">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Save</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  const formatTime = require('./../../formatTime')
  const ipcRenderer = require('electron').ipcRenderer

  export default {
    props: ['activityToEdit', 'projectList'],
    methods: {
      secondsToTime: function (seconds) {
        return formatTime.secondsToTimeString(seconds)
      },
      generatePDFReport: function (reportProject) {
        ipcRenderer.send('sheeptime:report:PDF', reportProject)
      }
    }
  }
</script>