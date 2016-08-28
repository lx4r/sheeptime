/**
 * Created by lx4r on 18.08.16.
 */
'use strict';

var fs = require('fs');
var projectsStorage = require('./projectsStorage');
var activitiesStorage = require('./activitiesStorage');
var ipcRenderer = require('electron').ipcRenderer;
var formatTime = require('./formatTime');
var mapHandling = require('./mapHandling');

var currentSeconds = 0;
var intervalID;
var loggedActivities = activitiesStorage.readActivities();
var savedProjects = projectsStorage.readProjects();
var errors = [];
var stopwatchRunning = false;

// Initialise the view after getting the activities and savedProjects from the save file
updateActivitiesTable();
updateProjectsDropdown();

errors.forEach(function (err) {
    console.error(err);
});

$('#startStopButton').on('click', function () {
    // Stopwatch is running -> buttons acts as stop button
    if (stopwatchRunning){
        // Stop the stopwatch
        clearInterval(intervalID);

        var activityProjectID = parseInt(projectsDropdown.value);
        // Add the new activitiy to the activities map
        loggedActivities[1].set(loggedActivities[0], {projectID: activityProjectID, name: activity.value, duration: currentSeconds});
        // Increment the fresh ID
        loggedActivities[0]++;
        // Update the total time of the activity's project in the project map by adding the number of elapsed seconds
        var activityProject = savedProjects[1].get(activityProjectID);
        activityProject.totalSeconds+=currentSeconds;
        savedProjects[1].set(activityProjectID, activityProject);

        // Reset the stopwatch
        currentSeconds = 0;
        // Update the view
        timer.innerHTML = "00:00:00";
        activity.value = "";
        updateActivitiesTable();
        // Update the button's color and change it's text -> start button
        startStopButton.className = "btn btn-success";
        startStopButton.innerHTML = "Start";
        // Update the stopwatch's status
        stopwatchRunning = false;

        // Save the new activity to the JSON file
        activitiesStorage.saveActivities(loggedActivities);
        // Save the updated project to the JSON file
        projectsStorage.saveProjects(savedProjects);

        // Inform the project window of the new total time of one of the savedProjects
        ipcRenderer.send('activity-tracked', mapHandling.mapToArray(savedProjects[1]));

        // Stopwatch is not running -> buttons acts as start button
    } else {
        // Update the stopwatch every second with the human-readable representation of the current number of seconds on the "stopwatch"
        intervalID = setInterval(function(){
            currentSeconds++;
            timer.innerHTML = formatTime.formatSeconds(currentSeconds);
        }, 1000);

        // Update the button's color and change it's text -> stop button
        startStopButton.className = "btn btn-danger";
        startStopButton.innerHTML = "Stop";
        // Update the stopwatch's status
        stopwatchRunning = true;
    }
});

$('#projectsButton').on("click", function () {
    ipcRenderer.send('open-savedProjects-window');
});

$('#activityTable').on('click', 'button.deleteActivityButton', function () {
    // Delete the activity with the ID stored in the clicked button from the activity map, update the activities table and save the new storage array to the JSON file
    var id = $(this).data('id');
    loggedActivities[1].delete(id);
    updateActivitiesTable();
    activitiesStorage.saveActivities(loggedActivities);
});

// If a project is added in the project window, update the project dropdown in this window
ipcRenderer.on('project-added', function (event, arg) {
    savedProjects[1] = mapHandling.arrayToMap(arg);
    console.log(savedProjects);
    console.log("hallo");
    updateProjectsDropdown();
});

function updateActivitiesTable() {
    // If the acitivities map is empty don't show the table but a string instead
    if (loggedActivities[1].size == 0){
        activityTable.innerHTML = "No activities yet";
        return;
    }
    // If the acitivities map is not empty generate the activities table
    var output = '<table class="table" id="log"><tr><th>Activity</th><th>Time</th><th></th></tr>';
    loggedActivities[1].forEach(function (elem, id) {
        output +=
            "<tr>" +
                "<td>" +
                    elem.name +
                "</td>" +
                "<td>" +
                    formatTime.formatSeconds(elem.duration) +
                "</td>" +
                '<td>' +
                    // Each button holds the acitivity's ID in his "data-id" attribute
                    '<button type="button" class="btn btn-xs btn-danger deleteActivityButton" aria-label="Left Align" data-id="' + id + '">' +
                        '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span> Delete' +
                    '</button>' +
                '</td>' +
            "</tr>";
    });
    output += "</table>";
    activityTable.innerHTML = output;
}

function updateProjectsDropdown() {
    console.log("updateprojects");
    var output = '<select name="savedProjects">';
    // If the savedProjects map is empty add an error to the error list
    if (savedProjects[1].size == 0){
        errors.push("Please add a project before tracking activities");
        return;
    }
    // Otherwise generate the savedProjects dropdown
    savedProjects[1].forEach(function (elem, id) {
        console.log(elem.name);
        output +=
            // Each option hild the project's ID in his "value" attribute
            '<option value="' + id + '">' +
            (elem.name) +
            '</option>';
    });
    output += "</select>";
    projectsDropdown.innerHTML = output;
}

