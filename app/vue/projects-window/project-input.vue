<template>
    <div class="row" id="project-input">
        <div class="col-md-6 col-md-offset-3 col-sm-12 col-xs-12">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">Add project</h3>
                </div>
                <div v-if="dataReceived" class="panel-body">
                    <div class="form-group">
                        <div class="input-group">
                            <input type="text" class="form-control" id="projectName" placeholder="project name" v-model="projectName">
                            <div class="input-group-btn">
                                <div class="dropdown">
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
                    <button class="btn btn-success" id="addProjectButton" type="button" v-on:click="addProject()">Add project</button>
                </div>
                <div v-else class="panel-body">
                    Loading
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  const ipcRenderer = require('electron').ipcRenderer

  ipcRenderer.send('sheeptime:config:colors:send');

  ipcRenderer.on('sheeptime:config:colors:get', function (event, colors) {
    console.log("colors: " + colors);
    data.colors = colors
    data.dataReceived = true
  })

  var data = {
    projectName:  "",
    colors: [],
    selectedColor: 0,
    dataReceived: false
  }

  export default {
    methods: {
      addProject: function () {
        console.log('Selected color: ' + data.selectedColor)
        var newProject = {
          name: this.projectName,
          selectedColor: this.selectedColor
        }
        ipcRenderer.send('sheeptime:project:add', newProject)
        data.projectName = ""
      }
    },
    data(){
      return data
    },
    computed: {
      highlightSelectedColor: function () {
        return {
          // code to come
        }
      }
    }
  }
</script>