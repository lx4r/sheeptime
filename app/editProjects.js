/**
 * Created by lx4r on 20.08.16.
 */

var fs = require('fs');
var ipcRenderer = require('electron').ipcRenderer;
var projectsStorage = require('./projectsStorage.js');
var mapHandling = require('./mapHandling');
var formatTime = require('./formatTime');

var savedProjects = projectsStorage.readProjects();

// Initialise the view after getting the savedProjects from the save file
updateProjectsTable();

$('#addProjectButton').on('click', function () {
    // Don't create a new project if the input fpr the project name is empty
    if (!projectName.value){
        return;
    }
    // Add the new project to the project map with the fresh ID from the save file as ID
    savedProjects[1].set(savedProjects[0], {name: projectName.value, totalSeconds: 0});
    // Increment the fresh ID
    savedProjects[0]++;
    projectName.value = "";
    updateProjectsTable();
    projectsStorage.saveProjects(savedProjects);
    console.log(savedProjects);
    ipcRenderer.send('project-added', mapHandling.mapToArray(savedProjects[1]));
});

$('#projectsTable').on('click', 'button.deleteProjectButton', function () {
    // Delete the activity with the ID stored in the clicked button from the activity map, update the activities table and save the new storage array to the JSON file
    var id = $(this).data('id');
    savedProjects[1].delete(id);
    updateProjectsTable();
    projectsStorage.saveProjects(savedProjects);
});

// If an activity is added in the main window, update the project list in this window
ipcRenderer.on('activity-tracked', function (event, arg) {
    savedProjects[1] = mapHandling.arrayToMap(arg);
    updateProjectsTable();
});

// If an activity is deleted in the main window, update the project list in this window
ipcRenderer.on('activity-deleted', function (event, arg) {
    savedProjects[1] = mapHandling.arrayToMap(arg);
    updateProjectsTable();
});

function updateProjectsTable() {
    // If the savedProjects file only contains the fresh id
    if (savedProjects[1].size == 0){
        projectsTable.innerHTML = "No projects";
        return;
    }
    var output = '<table class="table"><tr><th>Project name</th><th>Total time</th><th></th></tr>';
    // Loop over the savedProjects map
    savedProjects[1].forEach(function (elem, id) {
        output +=
            '<tr>' +
                '<td>' +
                    elem.name +
                '</td>' +
                '<td>' +
                    formatTime.formatSeconds(elem.totalSeconds) +
                '</td>' +
                '<td>' +
                    '<button type="button" class="btn btn-xs btn-danger deleteProjectButton" aria-label="Left Align" data-id="' + id + '">' +
                        '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span> Delete' +
                    '</button>' +
                '</td>';
    });
    output += "</table>";
    projectsTable.innerHTML = output;
}