<template>
    <div class="row" id="project-input">
        <div class="col-md-6 col-md-offset-3 col-sm-12 col-xs-12">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">Add project</h3>
                </div>
                <div class="panel-body">
                    <div class="form-group">
                        <div class="input-group">
                            <input type="text" class="form-control" id="projectName" placeholder="project name" v-model="projectName">
                            <div class="input-group-btn">
                                <div class="dropdown">
                                    <button id="dLabel" type="button" class="btn btn-default" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        Color
                                        <span class="caret"></span>
                                    </button>
                                    <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dLabel">
                                        <div class="color-picker-row">
                                            <div class="color-example color-example-selected" id="ce1">&nbsp;</div>
                                            <div class="color-example" id="ce2">&nbsp;</div>
                                            <div class="color-example" id="ce3">&nbsp;</div>
                                            <div class="color-example color-example-end" id="ce4">&nbsp;</div>
                                        </div>
                                        <div class="color-picker-row">
                                            <div class="color-example" id="ce5">&nbsp;</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button class="btn btn-success" id="addProjectButton" type="button" v-on:click="addProject(projectName)">Add project</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    const ipcRenderer = require('electron').ipcRenderer

    var data = {
        projectName:  ""
    }

    export default {
        methods: {
            addProject: function (name) {
                ipcRenderer.send('sheeptime:project:add', name)
            }
        },
        data(){
            return data
        }
    }
</script>