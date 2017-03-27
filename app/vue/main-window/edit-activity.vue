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
                        <input type="text" class="form-control" id="activityName" v-model="activityName" :value="setActivityName">
                    </div>
                    <div class="form-group">
                        <label for="projectsDropdown">Project</label>
                        <select class="form-control" id="projectsDropdown" v-model="activityProjectID" :value="setProjectID">
                            <option v-for="project in projectList" :value="project[0]">
                                {{project[1].name}}
                            </option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="activityName">Date</label>
                        <input type="text" class="form-control" :value="setDate" v-model="activityDateString">
                    </div>
                    <div class="row">
                        <div class="col-xs-6 col-sm-6 col-md-3">
                            <div class="form-group">
                                <label for="startTime">start time</label>
                                <input type="time" class="form-control" id="startTime" v-model="startTime" :value="setStartTimeString">
                            </div>
                        </div>
                        <div class="col-xs-6 col-sm-6 col-md-3">
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

  let data = {
    startTime: "00:00",
    endTime: "00:00",
    activityProjectID: 0,
    activityName: "",
    activityDateString: "01/01/2000"
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
      },
      setProjectID: function () {
        data.activityProjectID = this.activityToEdit[1].projectID
        return this.activityToEdit[1].projectID
      },
      setActivityName: function () {
        data.activityName = this.activityToEdit[1].name
        return this.activityToEdit[1].name
      },
      setDate: function () {
        let dateString = formatTime.timestampToDateString(this.activityToEdit[1].startTime);
        data.activityDateString = dateString
        return dateString
      }
    },
    data: function () {
      return data;
    }
  }
</script>