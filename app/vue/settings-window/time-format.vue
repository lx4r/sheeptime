<template>
    <div class="row">
        <div class="col-md-6 col-md-offset-3 col-sm-12 col-xs-12">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">Time format</h3>
                </div>
                <div class="panel-body">
                    <form v-if="dataReceived">
                        <div class="radio">
                            <label>
                                <input type="radio" class="timeFormatRadio" name="timeFormatRadios" id="timeFormatEuropean" value="european" v-model="timeFormat" v-on:change='changeTimeFormat()'>
                                DD.MM.YYYY, HH:MM
                            </label>
                        </div>
                        <div class="radio">
                            <label>
                                <input type="radio" class="timeFormatRadio" name="timeFormatRadios" id="timeFormatAmerican" value="american" v-model="timeFormat" v-on:change='changeTimeFormat()'>
                                MM/DD/YYYY, HH:MM
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
        timeFormat: "",
        dataReceived: false
    }

    ipcRenderer.send('sheeptime:config:time-format:send')

    ipcRenderer.on('sheeptime:config:time-format:get', function (event, timeFormat) {
        data.timeFormat = timeFormat
        console.log("Got time format: " + timeFormat)
        data.dataReceived = true
    })

    export default {
        methods: {
          changeTimeFormat: function () {
              ipcRenderer.send('sheeptime:config:time-format:set', data.timeFormat)
          }
        },
        data () {
            return data
        }
    }

</script>