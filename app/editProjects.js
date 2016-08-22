/**
 * Created by lx4r on 20.08.16.
 */

var fs = require('fs');
var projectsStorage = require('./projectsStorage.js');
var projects = projectsStorage.readProjects();
console.log(projects);
updateProjectsTable();

addProjectButton.addEventListener('click', function () {
    if (!projectName.value){
        return;
    }
    // Add the new project to the project list with the fresh ID from the save file as ID
    projects.push({ID: projects[0], name: projectName.value});
    // Increment the fresh ID
    projects[0]++;
    projectName.value = "";
    updateProjectsTable();
    projectsStorage.saveProjects(projects);
});

function updateProjectsTable() {
    // If the projects file only contains the fresh id
    if (projects.length == 1){
        projectsTable.innerHTML = "No projects";
        return;
    }
    var output = '<table class="table"><tr><th>Project name</th></tr>';
    projects.slice(1).forEach(function (elem) {
        output +=
            "<tr>" +
            "<td>" +
            elem.name +
            "</tr>";
    });
    output += "</table>";
    projectsTable.innerHTML = output;
}