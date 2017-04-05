<template>
    <div class="container" id="projects-window">
        <div class="row" id="project-heading">
            <div class="col-md-12">
                <h1>Projects</h1>
            </div>
        </div>
        <project-input :colors="colors"></project-input>
        <project-list :colors="colors"></project-list>
    </div>
</template>

<script>
  const ipcRenderer = require('electron').ipcRenderer

  var data = {
    colors: null
  }

  ipcRenderer.send('sheeptime:config:colors:send');

  ipcRenderer.on('sheeptime:config:colors:get', function (event, colors) {
    data.colors = colors
  })

  export default {
    data(){
      return data
    }
  }
</script>