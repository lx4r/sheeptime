<template>
    <div class="row">
        <div class="col-md-6 col-md-offset-3 col-sm-12 col-xs-12">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">Save file location</h3>
                </div>
                <div class="panel-body">
                    <div v-if="!success" class="alert alert-danger"><strong>Error:</strong> The path you entered is invalid. Restored previous path.</div>
                    <form v-if="dataReceived">
                        <div class="form-group">
                            <input type="text" class="form-control" id="savefileDirectory" v-model="saveFileLocation">
                            <p class="help-block">The files <b>sheeptime_activities.json</b>, <b>sheeptime_projects.json</b> and your PDF reports will be stored in this directory.</p>
                        </div>
                        <button type="button" class="btn btn-success" id="savePathButton" v-on:click="savePath()">save path</button>
                    </form>
                    <div v-else>
                        Loading
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    const ipcRenderer = require('electron').ipcRenderer

    var previousSaveFileLocation = ""

    var data = {
        saveFileLocation: "",
        error: false,
        dataReceived: false,
        success: true
    }

    ipcRenderer.send('sheeptime:config:savefile-location:send')

    ipcRenderer.on('sheeptime:config:savefile-location:get', function (event, saveFileLocation) {
        previousSaveFileLocation = saveFileLocation
        data.saveFileLocation = saveFileLocation
        data.dataReceived = true
    })

    ipcRenderer.on('sheeptime:config:savefile-location:set:done', function (event, success) {
        console.log('window got signal, success: ' + success)
        data.success = success
        if (!success){
            console.log("no success in window")
            data.saveFileLocation = previousSaveFileLocation
        } else {
            console.log("success")
            previousSaveFileLocation = data.saveFileLocation
        }
    })

    export default {
        methods: {
          savePath: function () {
              ipcRenderer.send('sheeptime:config:savefile-location:set', data.saveFileLocation)
          }
        },
        data () {
            return data
        }
    }
</script>