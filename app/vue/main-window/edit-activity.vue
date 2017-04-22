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
                        <input type="text" class="form-control" v-model="activityToEditProperties.dateString" @change="dateChanged(activityToEditProperties, activityToEdit[1])">
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
      hoursChanged: function (activityToEditAdditional, activityToEditContent) {
        if (!this.isValidInput(activityToEditAdditional.durationHours)){
          // reset hours if input was invalid
          activityToEditAdditional.durationHours = activityToEditAdditional.durationObjectPrev.hours
          return
        }
        // activityToEditProperties.durationObjectPrev contains the previous duration
        if (activityToEditAdditional.durationHours < activityToEditAdditional.durationObjectPrev.hours) {
          // hours decreased
          let hoursDifference = activityToEditAdditional.durationObjectPrev.hours - activityToEditAdditional.durationHours
          activityToEditContent.endTime -= (hoursDifference * 3600)
          activityToEditContent.duration -= (hoursDifference * 3600)
        } else if (activityToEditAdditional.durationHours > activityToEditAdditional.durationObjectPrev.hours) {
          // hours increased
          let hoursDifference = activityToEditAdditional.durationHours - activityToEditAdditional.durationObjectPrev.hours
          activityToEditContent.endTime += (hoursDifference * 3600)
          activityToEditContent.duration += (hoursDifference * 3600)
        }
        this.updateDurationObjectPrev(activityToEditAdditional, activityToEditContent)
        this.updateEndTime(activityToEditAdditional, activityToEditContent)
        activityToEditAdditional.durationHours = formatTime.addLeadingZero(activityToEditAdditional.durationHours)
      },
      minutesChanged: function (activityToEditAdditional, activityToEditContent) {
        if (!this.isValidInput(activityToEditAdditional.durationMinutes) || activityToEditAdditional.durationMinutes > 59){
          // reset minutes if input was invalid
          activityToEditAdditional.durationMinutes = activityToEditAdditional.durationObjectPrev.minutes
          return
        }
        // activityToEditProperties.durationObjectPrev contains the previous duration
        if (activityToEditAdditional.durationMinutes < activityToEditAdditional.durationObjectPrev.minutes) {
          // minutes decreased
          let minutesDifference = activityToEditAdditional.durationObjectPrev.minutes - activityToEditAdditional.durationMinutes
          activityToEditContent.endTime -= (minutesDifference * 60)
          activityToEditContent.duration -= (minutesDifference * 60)
        } else if (activityToEditAdditional.durationMinutes > activityToEditAdditional.durationObjectPrev.minutes) {
          // minutes increased
          let minutesDifference = activityToEditAdditional.durationMinutes - activityToEditAdditional.durationObjectPrev.minutes
          activityToEditContent.endTime += (minutesDifference * 60)
          activityToEditContent.duration += (minutesDifference * 60)
        }
        this.updateDurationObjectPrev(activityToEditAdditional, activityToEditContent)
        this.updateEndTime(activityToEditAdditional, activityToEditContent)
        activityToEditAdditional.durationMinutes = formatTime.addLeadingZero(activityToEditAdditional.durationMinutes)
      },
      secondsChanged: function (activityToEditAdditional, activityToEditContent) {
        if (!this.isValidInput(activityToEditAdditional.durationSeconds) || activityToEditAdditional.durationSeconds > 59){
          // reset seconds if input was invalid
          activityToEditAdditional.durationSeconds = activityToEditAdditional.durationObjectPrev.seconds
          return
        }
        // activityToEditProperties.durationObjectPrev contains the previous duration
        if (activityToEditAdditional.durationSeconds < activityToEditAdditional.durationObjectPrev.seconds) {
          // seconds decreased
          let secondsDifference = activityToEditAdditional.durationObjectPrev.seconds - activityToEditAdditional.durationSeconds
          activityToEditContent.endTime -= secondsDifference
          activityToEditContent.duration -= secondsDifference
        } else if (activityToEditAdditional.durationSeconds > activityToEditAdditional.durationObjectPrev.seconds) {
          // seconds increased
          let secondsDifference = activityToEditAdditional.durationSeconds - activityToEditAdditional.durationObjectPrev.seconds
          activityToEditContent.endTime += secondsDifference
          activityToEditContent.duration += secondsDifference
        }
        this.updateDurationObjectPrev(activityToEditAdditional, activityToEditContent)
        this.updateEndTime(activityToEditAdditional, activityToEditContent)
        activityToEditAdditional.durationSeconds = formatTime.addLeadingZero(activityToEditAdditional.durationSeconds)
      },
      startTimeChanged: function (activityToEditAdditional, activityToEditContent) {
        const startTimePrevString = formatTime.timestampToTimeString(activityToEditAdditional.startTimePrev)
        const timeDiff = timeCalculations.diffTimeStrings(startTimePrevString, activityToEditAdditional.startTimeString)
        if (activityToEditAdditional.startTimeString < startTimePrevString){
          // earlier start time
          if (timeDiff.hours !== 0) {
            activityToEditContent.startTime = timeCalculations.subtractHoursFromTimestamp(timeDiff.hoursDiff, activityToEditContent.startTime)
          }
          if (timeDiff.minutes !== 0) {
            activityToEditContent.startTime = timeCalculations.subtractMinutesFromTimestamp(timeDiff.minutesDiff, activityToEditContent.startTime)
          }
        } else if (activityToEditAdditional.startTimeString > startTimePrevString){
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
          activityToEditContent.startTime = activityToEditAdditional.startTimePrev
          activityToEditAdditional.startTimeString = startTimePrevString
          return
        }
        activityToEditContent.duration = activityToEditContent.endTime - activityToEditContent.startTime
        this.updateDurationObjectPrev(activityToEditAdditional, activityToEditContent)
        this.updateDurationMinutesHours(activityToEditAdditional, activityToEditContent)
        this.updateStartTimePrev(activityToEditAdditional, activityToEditContent)
      },
      endTimeChanged: function (activityToEditAdditional, activityToEditContent) {
        const endTimePrevString = formatTime.timestampToTimeString(activityToEditAdditional.endTimePrev)
        const timeDiff = timeCalculations.diffTimeStrings(endTimePrevString, activityToEditAdditional.endTimeString)
        if (activityToEditAdditional.endTimeString < endTimePrevString){
          // earlier end time
          if (timeDiff.hours !== 0) {
            activityToEditContent.endTime = timeCalculations.subtractHoursFromTimestamp(timeDiff.hoursDiff, activityToEditContent.endTime)
          }
          if (timeDiff.minutes !== 0) {
            activityToEditContent.endTime = timeCalculations.subtractMinutesFromTimestamp(timeDiff.minutesDiff, activityToEditContent.endTime)
          }
        } else if (activityToEditAdditional.endTimeString > endTimePrevString){
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
          activityToEditContent.endTime = activityToEditAdditional.endTimePrev
          activityToEditAdditional.endTimeString = endTimePrevString
          return
        }
        activityToEditContent.duration = activityToEditContent.endTime - activityToEditContent.startTime
        this.updateDurationObjectPrev(activityToEditAdditional, activityToEditContent)
        this.updateDurationMinutesHours(activityToEditAdditional, activityToEditContent)
        this.updateEndTimePrev(activityToEditAdditional, activityToEditContent)
      },
      dateChanged: function (activityToEditAdditional, activityToEditContent) {
        const parsedDate = formatTime.parseDateString(activityToEditAdditional.dateString)
        console.log(parsedDate)
        if (!parsedDate) {
          // reset date string
          console.log('invalid')
          activityToEditAdditional.dateString = formatTime.timestampToDateString(activityToEditContent.startTime)
        } else {
          console.log("yay, valid")
        }
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