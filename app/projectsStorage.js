/**
 * Created by lx4r on 20.08.16.
 */
'use strict';

var fs = require('fs');

function saveProjects(projects) {
    fs.writeFile("sheeptime_projects.json", JSON.stringify(projects), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
}

function readProjects(){
    var projects = fs.readFileSync('sheeptime_projects.json', 'utf8');
    if (projects) {
        return JSON.parse(projects);
    } else {
        return [];
    }
}

module.exports = {
    saveProjects: saveProjects,
    readProjects: readProjects
};