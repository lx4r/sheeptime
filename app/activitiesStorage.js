/**
 * Created by lx4r on 21.08.16.
 */
'use strict';

var fs = require('fs');

function saveActivities(activities) {
    fs.writeFile("sheeptime_activities.json", JSON.stringify(activities), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
}

function readActivities(){
    var activities = fs.readFileSync('sheeptime_activities.json', 'utf8');
    if (activities) {
        console.log(JSON.parse(activities));
        return JSON.parse(activities);
    } else {
        return false;
    }
}

module.exports = {
    saveActivities: saveActivities,
    readActivities: readActivities
};