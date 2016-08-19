/**
 * Created by lx4r on 18.08.16.
 */
var fs = require('fs');
var currentSeconds = 0;
var intervalID;
var loggedActivities = [];

startButton.addEventListener("click", function () {
    intervalID = setInterval(function(){
        currentSeconds++;
        timer.innerHTML = formatTime(currentSeconds)
    }, 1000);
});

stopButton.addEventListener("click", function () {
    clearInterval(intervalID);
    loggedActivities.push({name: activity.value, duration: currentSeconds});
    currentSeconds = 0;
    timer.innerHTML = "00:00:00";
    activity.value = "";
    console.log(loggedActivities);
    updateActivitiesTable();
    //log.insertAdjacentHTML("<tr><td>" + activity.value + "</td><td>" + formatTime(currentSeconds) + "</td>");
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
                    elem.duration +
                "</td>" +
            "</tr>";
        ;
    });
    output += "</table>";
    activityList.innerHTML = output;

    fs.writeFile("test.json", JSON.stringify(loggedActivities), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
}