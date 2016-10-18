<template>
    <div class="modal fade" id="deletionConfirmation" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>
                    <h4 class="modal-title" id="myModalLabel">Are you sure?</h4>
                </div>
                <div class="modal-body">
                    Deleting this project will also delete all activities associated with it.
                    <form>
                        <div class="checkbox">
                            <label>
                                <input type="checkbox" v-model="dontShowDeletionConfirmation">
                                Don't show this dialogue again
                                <small>(It can be re-enabled in the settings.)</small>
                            </label>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" id="confirmProjectDeletion" data-dismiss="modal" v-on:click="deleteProject(projectToDelete)">Delete project</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    const ipcRenderer = require('electron').ipcRenderer

    var data = {
        dontShowDeletionConfirmation: false
    }

    export default {
        props: ['projectToDelete'],
        methods: {
            deleteProject: function (projectID) {
                console.log("Delete project " + projectID)
                console.log("Don't show confirmation: " + data.dontShowDeletionConfirmation)
                ipcRenderer.send('sheeptime:project:delete', projectID)
            },
        },
        data() {
            return data
        }
    }
</script>