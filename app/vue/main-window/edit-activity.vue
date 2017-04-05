<template>
    <div class="modal fade" id="edit-activity" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div v-if="activityToEditProperties && activityToEdit" class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>
                    <h4 class="modal-title" id="myModalLabel">
                        Edit activity <i>{{activityToEdit[1].name}}</i>
                        <i v-show='activityToEdit[1].name === ""'>(no name)</i>
                    </h4>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="activityName">Name</label>
                        <input type="text" class="form-control" id="activityName" v-model="activityToEdit[1].name">
                    </div>
                    <div class="form-group">
                        <label for="projectsDropdown">Project</label>
                        <select class="form-control" id="projectsDropdown" v-model="activityToEdit[1].projectID">
                            <option v-for="project in projectList" :value="project[0]">
                                {{project[1].name}}
                            </option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="activityName">Date</label>
                        <input type="text" class="form-control" v-model="activityToEditProperties.dateString">
                    </div>
                    <label for="activityDuration">Duration</label>
                    <div class="row" id="activityDuration">
                        <div class="col-xs-2">
                            <div class="form-group">
                                <input type="text" class="form-control editActivityDuration" v-model="activityToEditProperties.durationHours" id="activityDurationHours" @change="hoursChanged(activityToEditProperties, activityToEdit[1])">
                            </div>
                        </div>
                        <div class="col-xs-1 edit-activity-duration-separator">
                            :
                        </div>
                        <div class="col-xs-2">
                            <div class="form-group">
                                <input type="text" class="form-control editActivityDuration" v-model="activityToEditProperties.durationMinutes" id="activityDurationMinutes" @change="minutesChanged(activityToEditProperties, activityToEdit[1])">
                            </div>
                        </div>
                        <div class="col-xs-1 edit-activity-duration-separator">
                            :
                        </div>
                        <div class="col-xs-2">
                            <div class="form-group">
                                <input type="text" class="form-control editActivityDuration" v-model="activityToEditProperties.durationSeconds" id="activityDurationSeconds" @change="secondsChanged(activityToEditProperties, activityToEdit[1])">
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-6 col-sm-6 col-md-3">
                            <div class="form-group">
                                <label for="startTime">start time</label>
                                <input type="time" class="form-control" id="startTime" v-model="activityToEditProperties.startTimeString">
                            </div>
                        </div>
                        <div class="col-xs-6 col-sm-6 col-md-3">
                            <div class="form-group">
                                <label for="endTime">end time</label>
                                <input type="time" class="form-control" id="endTime" v-model="activityToEditProperties.endTimeString">
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
  const formatTime = require('./../../formatTime')
  const ipcRenderer = require('electron').ipcRenderer

  export default {
    props: ['activityToEdit', 'projectList', 'activityToEditProperties'],
    methods: {
      // TODO: simplify code here
      hoursChanged: function (activityToEditProperties, activityToEditContent) {
        if (!this.isValidInput(activityToEditProperties.durationHours)){
          // reset hours if input was invalid
          activityToEditProperties.durationHours = activityToEditProperties.durationObject.hours
          return
        }
        // activityToEditProperties.durationObject contains the previous duration
        if (activityToEditProperties.durationHours < activityToEditProperties.durationObject.hours) {
          // hours decreased
          let hoursDifference = activityToEditProperties.durationObject.hours - activityToEditProperties.durationHours
          activityToEditContent.endTime -= (hoursDifference * 3600)
          activityToEditContent.duration -= (hoursDifference * 3600)
          this.updateEndTimeDuration(activityToEditProperties, activityToEditContent)
        } else if (activityToEditProperties.durationHours > activityToEditProperties.durationObject.hours) {
          // hours increased
          let hoursDifference = activityToEditProperties.durationHours - activityToEditProperties.durationObject.hours
          activityToEditContent.endTime += (hoursDifference * 3600)
          activityToEditContent.duration += (hoursDifference * 3600)
          this.updateEndTimeDuration(activityToEditProperties, activityToEditContent)
        }
      },
      minutesChanged: function (activityToEditProperties, activityToEditContent) {
        if (!this.isValidInput(activityToEditProperties.durationMinutes) || activityToEditProperties.durationMinutes > 59){
          // reset minutes if input was invalid
          activityToEditProperties.durationMinutes = activityToEditProperties.durationObject.minutes
          return
        }
        // activityToEditProperties.durationObject contains the previous duration
        if (activityToEditProperties.durationMinutes < activityToEditProperties.durationObject.minutes) {
          // minutes decreased
          let minutesDifference = activityToEditProperties.durationObject.minutes - activityToEditProperties.durationMinutes
          activityToEditContent.endTime -= (minutesDifference * 60)
          activityToEditContent.duration -= (minutesDifference * 60)
          this.updateEndTimeDuration(activityToEditProperties, activityToEditContent)
        } else if (activityToEditProperties.durationMinutes > activityToEditProperties.durationObject.minutes) {
          // minutes increased
          let minutesDifference = activityToEditProperties.durationMinutes - activityToEditProperties.durationObject.minutes
          activityToEditContent.endTime += (minutesDifference * 60)
          activityToEditContent.duration += (minutesDifference * 60)
          this.updateEndTimeDuration(activityToEditProperties, activityToEditContent)
        }
      },
      secondsChanged: function (activityToEditProperties, activityToEditContent) {
        if (!this.isValidInput(activityToEditProperties.durationSeconds) || activityToEditProperties.durationSeconds > 59){
          // reset seconds if input was invalid
          activityToEditProperties.durationSeconds = activityToEditProperties.durationObject.seconds
          return
        }
        // activityToEditProperties.durationObject contains the previous duration
        if (activityToEditProperties.durationSeconds < activityToEditProperties.durationObject.seconds) {
          // seconds decreased
          let secondsDifference = activityToEditProperties.durationObject.seconds - activityToEditProperties.durationSeconds
          activityToEditContent.endTime -= secondsDifference
          activityToEditContent.duration -= secondsDifference
          this.updateEndTimeDuration(activityToEditProperties, activityToEditContent)
        } else if (activityToEditProperties.durationSeconds > activityToEditProperties.durationObject.seconds) {
          // seconds increased
          let secondsDifference = activityToEditProperties.durationSeconds - activityToEditProperties.durationObject.seconds
          activityToEditContent.endTime += secondsDifference
          activityToEditContent.duration += secondsDifference
          this.updateEndTimeDuration(activityToEditProperties, activityToEditContent)
        }
      },
      updateEndTimeDuration: function (activityToEditProperties, activityToEditContent) {
        // helper function to update end time and duration
        activityToEditProperties.endTimeString = formatTime.timestampToTimeString(activityToEditContent.endTime)
        // update duration object to be able to compare with it at the next change
        activityToEditProperties.durationObject = formatTime.secondsToTimeObject(activityToEditContent.duration)
      },
      isValidInput: function (inputString) {
        return !(isNaN(inputString) || inputString.length > 2 || inputString.length < 1 || inputString < 0);
      }
    }
  }
</script>