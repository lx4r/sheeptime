<template>
    <div class="modal fade" id="edit-project" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div v-if="projectToEdit && colors" class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>
                    <h4 class="modal-title" id="myModalLabel">
                        Edit project <i>{{projectToEdit[1].name}}</i>
                        <i v-show='projectToEdit[1].name === ""'>(no name)</i>
                    </h4>
                </div>
                <div class="modal-body" id="">
                    <div class="form-group">
                        <label for="projectName">Name</label>
                        <input type="text" class="form-control" id="projectName" v-model="projectToEdit[1].name">
                    </div>
                    <div class="form-group">
                        <div class="input-group-btn">
                            <div class="dropdown">
                                <button type="button" class="btn btn-default" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Color
                                    <span class="caret"></span>
                                </button>
                                <div class="dropdown-menu dropdown-menu-left">
                                    <!-- TODO: use color picker component both for this and the color picker in the project input -->
                                    <div class="color-example" v-for="color in colors" :style='"background-color:" + color' v-on:click="projectToEdit[1].color=color" :class='{colorSelected: color === projectToEdit[1].color}'>&nbsp;</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  const ipcRenderer = require('electron').ipcRenderer

  export default {
    props: ['projectToEdit', 'colors'],
  }
</script>