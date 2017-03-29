<template>
    <div class="modal fade" id="edit-activity" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div v-if="activityToEdit" class="modal-content">
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
                        <input type="text" class="form-control" id="activityName" v-model="activityName" :value="initializeForm">
                    </div>
                    <div class="form-group">
                        <label for="projectsDropdown">Project</label>
                        <select class="form-control" id="projectsDropdown" v-model="activityProjectID">
                            <option v-for="project in projectList" :value="project[0]">
                                {{project[1].name}}
                            </option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="activityName">Date</label>
                        <input type="text" class="form-control" v-model="activityDateString">
                    </div>
                    <label for="activityName">Date</label>
                    <div class="row">
                        <div class="col-xs-2">
                            <div class="form-group">
                                <input type="text" class="form-control editActivityDuration" v-model="activityDurationHours" id="activityDurationHours" v-on:change="hoursChanged()">
                            </div>
                        </div>
                        <div class="col-xs-1 edit-activity-duration-separator">
                            :
                        </div>
                        <div class="col-xs-2">
                            <div class="form-group">
                                <input type="text" class="form-control editActivityDuration" v-model="activityDurationMinutes" id="activityDurationMinutes">
                            </div>
                        </div>
                        <div class="col-xs-1 edit-activity-duration-separator">
                            :
                        </div>
                        <div class="col-xs-2">
                            <div class="form-group">
                                <input type="text" class="form-control editActivityDuration" v-model="activityDurationSeconds" id="activityDurationSeconds">
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-6 col-sm-6 col-md-3">
                            <div class="form-group">
                                <label for="startTime">start time</label>
                                <input type="time" class="form-control" id="startTime" v-model="startTime">
                            </div>
                        </div>
                        <div class="col-xs-6 col-sm-6 col-md-3">
                            <div class="form-group">
                                <label for="endTime">end time</label>
                                <input type="time" class="form-control" id="endTime" v-model="endTime">
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
    props: ['activityToEdit', 'projectList'],
    methods: {
      hoursChanged: function () {
        if (data.activityDurationHours < activityDurationObject.hours){
          console.log("hours substracted")
          let hoursDifference = activityDurationObject.hours - data.activityDurationHours
          activityObject.endTime -= (hoursDifference * 3600)
          data.endTime = formatTime.secondsToTimeString(activityObject.endTime)
        } else if (data.activityDurationHours > activityDurationObject.hours){
          console.log("hours added")
          let hoursDifference = data.activityDurationHours - activityDurationObject.hours
          activityObject.endTime += (hoursDifference * 3600)
          data.endTime = formatTime.secondsToTimeString(activityObject.endTime)
        }
      }
    },
    computed: {
      initializeForm: function () {
        // using a computed property here to have access to the props
        activityObject = this.activityToEdit[1]
        activityDurationObject = formatTime.secondsToTimeObject(activityObject.duration)

        data.startTime = formatTime.timestampToTimeString(activityObject.startTime)
        data.endTime = formatTime.timestampToTimeString(activityObject.endTime)
        data.activityProjectID = activityObject.projectID
        data.activityName = activityObject.name
        data.activityDateString = formatTime.timestampToDateString(activityObject.startTime)
        data.activityDurationHours = activityDurationObject.hours
        data.activityDurationMinutes = activityDurationObject.minutes
        data.activityDurationSeconds = activityDurationObject.seconds

      }
    },
    data: function () {
      return data;
    }
  }
</script>