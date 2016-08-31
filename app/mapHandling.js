/**
 * Created by lx4r on 28.08.16.
 */
// map -> array representation of a map
function mapToArray (map) {
  return [...map]
}
// array representation of a map -> map
function arrayToMap (array) {
  return new Map(array)
}

module.exports = {
  mapToArray: mapToArray,
  arrayToMap: arrayToMap
}
