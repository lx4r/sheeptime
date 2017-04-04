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
                                <input type="checkbox" id="enable-debug-mode" v-model="enableDebugMode" v-on:change="toggleDebugMode()">
                                Show the debug sidebar
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

  var data = {
    enableDebugMode: false,
    dataReceived: false
  }

  ipcRenderer.send('sheeptime:config:debug-mode:send')

  ipcRenderer.on('sheeptime:config:debug-mode:get', function (event, status) {
    data.enableDebugMode = status
    data.dataReceived = true
  })

  export default {
    methods: {
      toggleDebugMode: function () {
        ipcRenderer.send('sheeptime:config:debug-mode:set', data.enableDebugMode)
      }
    },
    data () {
      return data
    }
  }
</script>