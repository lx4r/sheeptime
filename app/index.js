/**
 * Created by lx4r on 18.08.16.
 */
'use strict';

var fs = require('fs');
var projectsStorage = require('./projectsStorage.js');
var activitiesStorage = require('./activitiesStorage.js');
var ipcRenderer = require('electron').ipcRenderer

var currentSeconds = 0;
var intervalID;
var loggedActivities = activitiesStorage.readActivities();

// Initialise the view after getting the activities from the save file
updateActivitiesTable();
updateProjectsDropdown();

startButton.addEventListener("click", function () {
    // When the start button is pressed start the "stopwatch":
    // Update the "stopwatch" every second with the human-readable representation of the current number of seconds on the "stopwatch"
    intervalID = setInterval(function(){
        currentSeconds++;
        timer.innerHTML = formatTime(currentSeconds)
    }, 1000);
});

stopButton.addEventListener("click", function () {
    // When the stop button is pressed stop the "stopwatch"
    clearInterval(intervalID);
    // Add the new activitiy to the activities array, reset the "stopwatch" and save the activities to the save file
    loggedActivities.push({name: activity.value, duration: currentSeconds});
    currentSeconds = 0;
    timer.innerHTML = "00:00:00";
    activity.value = "";
    updateActivitiesTable();
    activitiesStorage.saveActivities(loggedActivities);
});

projectsButton.addEventListener("click", function () {
    ipcRenderer.send('open-projects-window');
});

function formatTime(seconds) {
    return new Date(seconds * 1000).toISOString().substr(11, 8);
}

function updateActivitiesTable() {
    var output = '<table class="table" id="log"><tr><th>Activity</th><th>Time</th></tr>';
    loggedActivities.forEach(function (elem) {
        output +=
            "<tr>" +
                "<td>" +
                    elem.name +
                "</td>" +
                "<td>" +
                    formatTime(elem.duration) +
                "</td>" +
            "</tr>";
    });
    output += "</table>";
    activityList.innerHTML = output;
}

function updateProjectsDropdown() {
    var output = '<select name="projects">';
    var savedProjects = projectsStorage.readProjects()
    savedProjects.forEach(function (elem) {
        output +=
            "<option>" +
            (elem.name) +
            "</option>";
    });
    output += "</select>";
    projects.innerHTML = output;
}