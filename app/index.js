/**
 * Created by lx4r on 18.08.16.
 */
'use strict';

var fs = require('fs');
var projectsStorage = require('./projectsStorage');
var activitiesStorage = require('./activitiesStorage');
var ipcRenderer = require('electron').ipcRenderer;
var formatTime = require('./formatTime');

var currentSeconds = 0;
var intervalID;
var loggedActivities = activitiesStorage.readActivities();
var errors = [];
var stopwatchRunning = false;

// Initialise the view after getting the activities from the save file
updateActivitiesTable();
updateProjectsDropdown();

errors.forEach(function (err) {
    console.error(err);
});

startStopButton.addEventListener("click", function () {
    // Stopwatch is running -> buttons acts as stop button
    if (stopwatchRunning){
        // Stop the stopwatch
        clearInterval(intervalID);
        // Add the new activitiy to the activities array, reset the stopwatch and save the activities to the save file
        // loggedActivities.push({ID: loggedActivities[0], projectID: parseInt(projects.value), name: activity.value, duration: currentSeconds});
        loggedActivities[1].set(loggedActivities[0], {projectID: parseInt(projects.value), name: activity.value, duration: currentSeconds});
        // Increment the fresh ID
        loggedActivities[0]++;
        currentSeconds = 0;
        timer.innerHTML = "00:00:00";
        activity.value = "";
        updateActivitiesTable();
        activitiesStorage.saveActivities(loggedActivities);

        // Update the button's color and change it's text -> start button
        startStopButton.className = "btn btn-success";
        startStopButton.innerHTML = "Start";
        // Update the stopwatch's status
        stopwatchRunning = false;

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

projectsButton.addEventListener("click", function () {
    ipcRenderer.send('open-projects-window');
});

function updateActivitiesTable() {
    if (loggedActivities.length == 1){
        activityTable.innerHTML = "No activities yet";
        return;
    }
    var output = '<table class="table" id="log"><tr><th>Activity</th><th>Time</th></tr>';
    loggedActivities[1].forEach(function (elem) {
        output +=
            "<tr>" +
                "<td>" +
                    elem.name +
                "</td>" +
                "<td>" +
                    formatTime.formatSeconds(elem.duration) +
                "</td>" +
            "</tr>";
    });
    output += "</table>";
    activityTable.innerHTML = output;
}

function updateProjectsDropdown() {
    var output = '<select name="projects">';
    var savedProjects = projectsStorage.readProjects();
    // If the projects file only contains the fresh id
    if (savedProjects.length == 1){
        errors.push("Please add a project before tracking activities");
        return;
    }
    savedProjects.slice(1).forEach(function (elem) {
        output +=
            '<option value="' + elem.ID + '">' +
            (elem.name) +
            '</option>';
    });
    output += "</select>";
    projects.innerHTML = output;
}

