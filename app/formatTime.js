/**
 * Created by lx4r on 22.08.16.
 */

function formatSeconds(secondsIn) {
    var hours   = Math.floor(secondsIn / 3600);
    var minutes = Math.floor((secondsIn - (hours * 3600)) / 60);
    var seconds = secondsIn - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
}

module.exports = {
    formatSeconds: formatSeconds
};