<template>
    <div class="container" id="settings-window">
        <div class="row">
            <div class="col-md-6 col-md-offset-3 col-sm-12 col-xs-12">
                <h1>Settings</h1>
                <div class="alert alert-warning" role="alert">Some of these settings will only come into effect after a restart.</div>
            </div>
        </div>
        <time-format></time-format>
        <savefile-location></savefile-location>
        <show-deletion-confirmation></show-deletion-confirmation>
        <enable-debug-mode></enable-debug-mode>
        <div class="row">
            <div class="col-md-6 col-md-offset-3 col-sm-12 col-xs-12">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <h3 class="panel-title">About</h3>
                    </div>
                    <div class="panel-body">
                        a project by <a class="open-in-browser" href="https://l3r.de">lx4r</a><br>
                        I hope you find SheepTime useful and have fun using it. :-)<br>
                        If you encounter any bugs (which is quite likely for the time being) don't hesitate to open an issue on <a class="open-in-browser" href="https://github.com/lx4r/sheeptime/issues" target="_blank">Github</a> or contact me via <a class="open-in-browser" href="https://twitter.com/lx4r" target="_blank">Twitter</a>.
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>