<template>
    <div class="modal fade" id="edit-project" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div v-if="activityToEditProperties" class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>
                    <h4 class="modal-title" id="myModalLabel">
                        Edit project <i>{{activityToEdit[1].name}}</i>
                        <i v-show='projectToEdit[1].name === ""'>(no name)</i>
                    </h4>
                </div>
                <div class="modal-body" id="">
                    <div class="form-group">
                        <label for="projectName">Name</label>
                        <input type="text" class="form-control" id="projectName" v-model="projectToEdit[1].name">
                    </div>
                    <div class="form-group">
                        <label for="projectColor">Project</label>
                        <div class="dropdown" id="projectColor">
                            <button type="button" class="btn btn-default" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Color
                                <span class="caret"></span>
                            </button>
                            <div class="dropdown-menu dropdown-menu-right">
                                <div class="color-example" v-for="(color, index) in colors" :style='"background-color:" + color' v-on:click="selectedColor=color" :class='{colorSelected: color === selectedColor}'>&nbsp;</div>
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
    props: ['projectToEdit, colors'],
    methods: {
    }
  }
</script>