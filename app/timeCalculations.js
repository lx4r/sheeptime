/**
 * Created by lx4r on 06.04.2017.
 */
'use strict'

function diffTimeStrings (timeStringA, timeStringB) {
  // time strings should have a ":" in the middle
  if (timeStringA.indexOf(':') !== 2 || timeStringB.indexOf(':') !== 2){
    throw Error("wrong time string format")
  }
  const timeStringASplit = timeStringA.split(':')
  const timeStringBSplit = timeStringB.split(':')
}

module.exports = {

}