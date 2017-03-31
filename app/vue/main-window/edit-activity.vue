<template>
    <div class="modal fade" id="edit-activity" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div v-if="activityToEditProperties" class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>
                    <h4 class="modal-title" id="myModalLabel">
                        Edit activity <i>{{activityToEdit[1].name}}</i>
                        <i v-show='activityToEdit[1].name === ""'>(no name)</i>
                    </h4>
                </div>
                <div class="modal-body" id="">
                    <div class="form-group">
                        <label for="activityName">Name</label>
                        <input type="text" class="form-control" id="activityName" v-model="activityToEditProperties.name">
                    </div>
                    <div class="form-group">
                        <label for="projectsDropdown">Project</label>
                        <select class="form-control" id="projectsDropdown" v-model="activityToEditProperties.projectID">
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
                                <input type="text" class="form-control editActivityDuration" v-model="activityToEditProperties.durationMinutes" id="activityDurationMinutes">
                            </div>
                        </div>
                        <div class="col-xs-1 edit-activity-duration-separator">
                            :
                        </div>
                        <div class="col-xs-2">
                            <div class="form-group">
                                <input type="text" class="form-control editActivityDuration" v-model="activityToEditProperties.durationSeconds" id="activityDurationSeconds">
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
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Save</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  const formatTime = require('./../../formatTime')

  let data = {
    startTime: "00:00",
    endTime: "00:00",
    activityProjectID: 0,
    activityName: "",
    activityDateString: "01/01/2000",
    activityDurationHours: '00',
    activityDurationMinutes: '00',
    activityDurationSeconds: '00',
  }
  let activityObject = null
  let activityDurationObject = null

  export default {
    props: ['activityToEdit', 'projectList', 'activityToEditProperties'],
    methods: {
      hoursChanged: function (activityToEditProperties, activityToEditContent) {
        // activityToEditProperties.durationObject contains the previous duration
        if (activityToEditProperties.durationHours < activityToEditProperties.durationObject.hours) {
          console.log("hours substracted")
          let hoursDifference = activityToEditProperties.durationObject.hours - activityToEditProperties.durationHours
          activityToEditContent.endTime -= (hoursDifference * 3600)
          activityToEditProperties.endTimeString = formatTime.timestampToTimeString(activityToEditContent.endTime)
        } else if (activityToEditProperties.durationHours > activityToEditProperties.durationObject.hours) {
          console.log("hours added")
          let hoursDifference = activityToEditProperties.durationHours - activityToEditProperties.durationObject.hours
          activityToEditContent.endTime += (hoursDifference * 3600)
          activityToEditProperties.endTimeString = formatTime.timestampToTimeString(activityToEditContent.endTime)
        }
      }
    },
    data: function () {
      return data;
    }
  }
</script>