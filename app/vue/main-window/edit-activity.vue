<template>
    <div class="modal fade" id="edit-activity" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div v-if="activityToEdit" class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>
                    <h4 class="modal-title" id="myModalLabel" v-if="activityToEdit">Edit activity</h4>
                </div>
                <div class="modal-body" id="">
                    <div class="form-group">
                        <label for="activityName">Name</label>
                        <input type="text" class="form-control" id="activityName" :value="activityToEdit[1].name">
                    </div>
                    <div class="form-group">
                        <label for="projectsDropdown">Project</label>
                        <projects-dropdown :pl="projectList"></projects-dropdown>
                    </div>
                    <div class="form-group">
                        <!-- <input data-provide="datepicker" id="start-date-picker" :="fillStartDatePicker()">
                        <input data-provide="datepicker" id="end-date-picker" :="fillEndDatePicker()"> -->
                        <div class="input-group date" data-provide="datepicker">
                            <!-- <label for="startDatePicker">Date</label>
                            <input type="text" class="form-control" id="startDatePicker" :="getStartDate(activityToEdit[1].startTime)">
                            <div class="input-group-addon">
                                <span class="glyphicon glyphicon-th"></span>
                            </div> -->
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-3">
                            <div class="form-group">
                                <label for="startTime">start time</label>
                                <input type="time" class="form-control" id="startTime" v-model="startTime" :value="setStartTimeString">
                            </div>
                        </div>
                        <div class="col-xs-3">
                            <div class="form-group">
                                <label for="endTime">end time</label>
                                <input type="time" class="form-control" id="endTime" v-model="endTime" :value="setEndTimeString">
                            </div>
                        </div>
                    </div>

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
  let data = {
    startTime: "00:00",
    endTime: "00:00"
  }

  export default {
    props: ['activityToEdit', 'projectList'],
    methods: {

    },
    computed: {
      setStartTimeString: function () {
        let startTimeString = formatTime.timestampToTimeString(this.activityToEdit[1].startTime)
        data.startTime = startTimeString
        return startTimeString
      },
      setEndTimeString: function () {
        let endTimeString = formatTime.timestampToTimeString(this.activityToEdit[1].endTime)
        data.endTime = endTimeString
        return endTimeString
      }
    },
    data: function () {
      return data;
    }
  }
</script>