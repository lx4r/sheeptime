<template>
    <div class="row" id="project-input">
        <div class="col-md-6 col-md-offset-3 col-sm-12 col-xs-12">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">Add project</h3>
                </div>
                <div class="panel-body">
                    <form>
                        <div class="form-group">
                            <input type="text" class="form-control" id="projectName" placeholder="project name" v-model="projectName">
                        </div>
                        <button class="btn btn-success" id="addProjectButton" type="button" v-on:click="addProject(projectName)">Add project</button>
                    </form>
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