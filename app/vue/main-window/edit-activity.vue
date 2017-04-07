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
                                <input type="time" class="form-control" id="startTime" v-model="activityToEditProperties.startTimeString" @change="startTimeChanged(activityToEditProperties, activityToEdit[1])">
                            </div>
                        </div>
                        <div class="col-xs-6 col-sm-6 col-md-3">
                            <div class="form-group">
                                <label for="endTime">end time</label>
                                <input type="time" class="form-control" id="endTime" v-model="activityToEditProperties.endTimeString" @change="endTimeChanged(activityToEditProperties, activityToEdit[1])">
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
  const timeCalculations = require('./../../timeCalculations')

  export default {
    props: ['activityToEdit', 'projectList', 'activityToEditProperties'],
    methods: {
      // TODO: simplify code here, maybe move new time calculation to formatTime
      hoursChanged: function (activityToEditProperties, activityToEditContent) {
        if (!this.isValidInput(activityToEditProperties.durationHours)){
          // reset hours if input was invalid
          activityToEditProperties.durationHours = activityToEditProperties.durationObjectPrev.hours
          return
        }
        // activityToEditProperties.durationObjectPrev contains the previous duration
        if (activityToEditProperties.durationHours < activityToEditProperties.durationObjectPrev.hours) {
          // hours decreased
          let hoursDifference = activityToEditProperties.durationObjectPrev.hours - activityToEditProperties.durationHours
          activityToEditContent.endTime -= (hoursDifference * 3600)
          activityToEditContent.duration -= (hoursDifference * 3600)
        } else if (activityToEditProperties.durationHours > activityToEditProperties.durationObjectPrev.hours) {
          // hours increased
          let hoursDifference = activityToEditProperties.durationHours - activityToEditProperties.durationObjectPrev.hours
          activityToEditContent.endTime += (hoursDifference * 3600)
          activityToEditContent.duration += (hoursDifference * 3600)
        }
        this.updateDurationObjectPrev(activityToEditProperties, activityToEditContent)
        this.updateEndTime(activityToEditProperties, activityToEditContent)
        activityToEditProperties.durationHours = formatTime.addLeadingZero(activityToEditProperties.durationHours)
      },
      minutesChanged: function (activityToEditProperties, activityToEditContent) {
        if (!this.isValidInput(activityToEditProperties.durationMinutes) || activityToEditProperties.durationMinutes > 59){
          // reset minutes if input was invalid
          activityToEditProperties.durationMinutes = activityToEditProperties.durationObjectPrev.minutes
          return
        }
        // activityToEditProperties.durationObjectPrev contains the previous duration
        if (activityToEditProperties.durationMinutes < activityToEditProperties.durationObjectPrev.minutes) {
          // minutes decreased
          let minutesDifference = activityToEditProperties.durationObjectPrev.minutes - activityToEditProperties.durationMinutes
          activityToEditContent.endTime -= (minutesDifference * 60)
          activityToEditContent.duration -= (minutesDifference * 60)
        } else if (activityToEditProperties.durationMinutes > activityToEditProperties.durationObjectPrev.minutes) {
          // minutes increased
          let minutesDifference = activityToEditProperties.durationMinutes - activityToEditProperties.durationObjectPrev.minutes
          activityToEditContent.endTime += (minutesDifference * 60)
          activityToEditContent.duration += (minutesDifference * 60)
        }
        this.updateDurationObjectPrev(activityToEditProperties, activityToEditContent)
        this.updateEndTime(activityToEditProperties, activityToEditContent)
        activityToEditProperties.durationMinutes = formatTime.addLeadingZero(activityToEditProperties.durationMinutes)
      },
      secondsChanged: function (activityToEditProperties, activityToEditContent) {
        if (!this.isValidInput(activityToEditProperties.durationSeconds) || activityToEditProperties.durationSeconds > 59){
          // reset seconds if input was invalid
          activityToEditProperties.durationSeconds = activityToEditProperties.durationObjectPrev.seconds
          return
        }
        // activityToEditProperties.durationObjectPrev contains the previous duration
        if (activityToEditProperties.durationSeconds < activityToEditProperties.durationObjectPrev.seconds) {
          // seconds decreased
          let secondsDifference = activityToEditProperties.durationObjectPrev.seconds - activityToEditProperties.durationSeconds
          activityToEditContent.endTime -= secondsDifference
          activityToEditContent.duration -= secondsDifference
        } else if (activityToEditProperties.durationSeconds > activityToEditProperties.durationObjectPrev.seconds) {
          // seconds increased
          let secondsDifference = activityToEditProperties.durationSeconds - activityToEditProperties.durationObjectPrev.seconds
          activityToEditContent.endTime += secondsDifference
          activityToEditContent.duration += secondsDifference
        }
        this.updateDurationObjectPrev(activityToEditProperties, activityToEditContent)
        this.updateEndTime(activityToEditProperties, activityToEditContent)
        activityToEditProperties.durationSeconds = formatTime.addLeadingZero(activityToEditProperties.durationSeconds)
      },
      startTimeChanged: function (activityToEditProperties, activityToEditContent) {
        const startTimePrevString = formatTime.timestampToTimeString(activityToEditProperties.startTimePrev)
        const timeDiff = timeCalculations.diffTimeStrings(startTimePrevString, activityToEditProperties.startTimeString)
        if (activityToEditProperties.startTimeString < startTimePrevString){
          // earlier start time
          if (timeDiff.hours !== 0) {
            activityToEditContent.startTime = timeCalculations.subtractHoursFromTimestamp(timeDiff.hoursDiff, activityToEditContent.startTime)
          }
          if (timeDiff.minutes !== 0) {
            activityToEditContent.startTime = timeCalculations.subtractMinutesFromTimestamp(timeDiff.minutesDiff, activityToEditContent.startTime)
          }
        } else if (activityToEditProperties.startTimeString > startTimePrevString){
          // later start time
          if (timeDiff.hours !== 0) {
            activityToEditContent.startTime = timeCalculations.addHoursToTimestamp(timeDiff.hoursDiff, activityToEditContent.startTime)
          }
          if (timeDiff.minutes !== 0) {
            activityToEditContent.startTime = timeCalculations.addMinutesToTimestamp(timeDiff.minutesDiff, activityToEditContent.startTime)
          }
        }
        // reset start time if the user sets it to an invalid value
        if (activityToEditContent.startTime > activityToEditContent.endTime) {
          activityToEditContent.startTime = activityToEditProperties.startTimePrev
          activityToEditProperties.startTimeString = startTimePrevString
          return
        }
        activityToEditContent.duration = activityToEditContent.endTime - activityToEditContent.startTime
        this.updateDurationObjectPrev(activityToEditProperties, activityToEditContent)
        this.updateDurationMinutesHours(activityToEditProperties, activityToEditContent)
        this.updateStartTimePrev(activityToEditProperties, activityToEditContent)
      },
      endTimeChanged: function (activityToEditProperties, activityToEditContent) {
        const endTimePrevString = formatTime.timestampToTimeString(activityToEditProperties.endTimePrev)
        const timeDiff = timeCalculations.diffTimeStrings(endTimePrevString, activityToEditProperties.endTimeString)
        if (activityToEditProperties.endTimeString < endTimePrevString){
          // earlier end time
          if (timeDiff.hours !== 0) {
            activityToEditContent.endTime = timeCalculations.subtractHoursFromTimestamp(timeDiff.hoursDiff, activityToEditContent.endTime)
          }
          if (timeDiff.minutes !== 0) {
            activityToEditContent.endTime = timeCalculations.subtractMinutesFromTimestamp(timeDiff.minutesDiff, activityToEditContent.endTime)
          }
        } else if (activityToEditProperties.endTimeString > endTimePrevString){
          // later end time
          if (timeDiff.hours !== 0) {
            activityToEditContent.endTime = timeCalculations.addHoursToTimestamp(timeDiff.hoursDiff, activityToEditContent.endTime)
          }
          if (timeDiff.minutes !== 0) {
            activityToEditContent.endTime = timeCalculations.addMinutesToTimestamp(timeDiff.minutesDiff, activityToEditContent.endTime)
          }
        }
        // reset end time if the user sets it to an invalid value
        if (activityToEditContent.endTime < activityToEditContent.startTime) {
          activityToEditContent.endTime = activityToEditProperties.endTimePrev
          activityToEditProperties.endTimeString = endTimePrevString
          return
        }
        activityToEditContent.duration = activityToEditContent.endTime - activityToEditContent.startTime
        this.updateDurationObjectPrev(activityToEditProperties, activityToEditContent)
        this.updateDurationMinutesHours(activityToEditProperties, activityToEditContent)
        this.updateEndTimePrev(activityToEditProperties, activityToEditContent)
      },
      updateDurationObjectPrev: function (activityToEditProperties, activityToEditContent) {
        // update duration object to be able to compare with it at the next change
        activityToEditProperties.durationObjectPrev = formatTime.secondsToTimeObject(activityToEditContent.duration)
      },
      updateEndTime: function (activityToEditProperties, activityToEditContent) {
        activityToEditProperties.endTimeString = formatTime.timestampToTimeString(activityToEditContent.endTime)
      },
      updateDurationMinutesHours: function (activityToEditProperties, activityToEditContent) {
        let newDurationObject = formatTime.secondsToTimeObject(activityToEditContent.duration)
        console.log(newDurationObject)
        activityToEditProperties.durationHours = newDurationObject.hours
        activityToEditProperties.durationMinutes = newDurationObject.minutes
      },
      updateStartTimePrev: function (activityToEditProperties, activityToEditContent) {
        activityToEditProperties.startTimePrev = activityToEditContent.startTime
      },
      updateEndTimePrev: function (activityToEditProperties, activityToEditContent) {
        activityToEditProperties.endTimePrev = activityToEditContent.endTime
      },
      isValidInput: function (inputString) {
        return !(isNaN(inputString) || inputString.length > 2 || inputString.length < 1 || inputString < 0);
      }
    }
  }
</script>