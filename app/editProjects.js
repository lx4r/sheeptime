/**
 * Created by lx4r on 20.08.16.
 */

var fs = require('fs');
var projectsStorage = require('./projectsStorage.js');
var projects = projectsStorage.readProjects();
updateProjectsTable();

addProjectButton.addEventListener('click', function () {
    if (!projectName.value){
        return;
    }
    projects.push({name: projectName.value});
    projectName.value = "";
    updateProjectsTable();
    projectsStorage.saveProjects(projects);
});

function updateProjectsTable() {
    if (projects.length == 0){
        projectsTable.innerHTML = "No projects";
        return;
    }
    var output = '<table class="table"><tr><th>Project name</th></tr>';
    projects.forEach(function (elem) {
        output +=
            "<tr>" +
            "<td>" +
            elem.name +
            "</tr>";
    });
    output += "</table>";
    projectsTable.innerHTML = output;
}