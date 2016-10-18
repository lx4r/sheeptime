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

function setElement (mapAsArray, key, value) {
  var map = arrayToMap(mapAsArray)
  map.set(key, value)
  return mapToArray(map)
}

function deleteElement (mapAsArray, key) {
  var map = arrayToMap(mapAsArray)
  map.delete(key)
  return mapToArray(map)
}

function getElement (mapAsArray, key) {
  var map = arrayToMap(mapAsArray)
  return map.get(key)
}

module.exports = {
  mapToArray: mapToArray,
  arrayToMap: arrayToMap,
  setElement: setElement,
  deleteElement: deleteElement,
  getElement: getElement
}
