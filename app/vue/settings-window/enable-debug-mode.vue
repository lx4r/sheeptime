<template>
    <div class="row">
        <div class="col-md-6 col-md-offset-3 col-sm-12 col-xs-12">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">Enable debug mode</h3>
                </div>
                <div class="panel-body">
                    <form v-if="dataReceived">
                        <div class="checkbox">
                            <label>
                                <input type="checkbox" id="showDeletionConfirmation" v-model="showDeletionConfirmation" v-on:change="changeDebugMode()">
                                Show the deletion confirmation dialogue
                            </label>
                        </div>
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

    ipcRenderer.send('sheeptime:config:deletion-confirmation:send')

    ipcRenderer.on('sheeptime:config:deletion-confirmation:get', function (event, status) {
        data.showDeletionConfirmation = status
        data.dataReceived = true
    })

    var data = {
        showDeletionConfirmation: true,
        dataReceived: false
    }

    export default {
        methods: {
            changeDebugMode: function () {
                ipcRenderer.send('sheeptime:config:deletion-confirmation:set', data.showDeletionConfirmation)
            }
        },
        data () {
            return data
        }
    }
</script>