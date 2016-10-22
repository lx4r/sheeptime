<template>
    <div class="row">
        <div class="col-md-6 col-md-offset-3 col-sm-12 col-xs-12">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">Save file location</h3>
                </div>
                <div class="panel-body">
                    <div id="errorMessage"></div>
                    <form>
                        <div class="form-group">
                            <input type="text" class="form-control" id="savefileDirectory" placeholder="loading">
                            <p class="help-block">The files <b>sheeptime_activities.json</b> and <b>sheeptime_projects.json</b> will be stored in this directory.</p>
                        </div>
                        <button type="button" class="btn btn-success" id="savePathButton">save path</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>