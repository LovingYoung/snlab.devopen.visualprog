/**
 * Created by lovingyoung on 17-5-20.
 */

var convert_info;

/**
 * Change key of info by lineCount
 * @param {object} info the object you want to change key
 * @param {number} lineCount the number of change
 * @returns {object}
 */
function infoModify(info, lineCount) {
  var info_new = {};
  var keys = Object.keys(info);
  for(var i = 0; i < keys.length; i++){
    info_new[parseInt(keys[i]) + lineCount] = info[parseInt(keys[i])];
  }
  return info_new;
}

/**
 * return the number of breaks of a piece of text
 * @param {string} text
 * @returns {number} the number of breaks;
 */
function getNumberOfBreaks(text) {
  var count = 0;
  for(var i = 0; i < text.length; i++){
    if(text[i] === '\n') count += 1;
  }
  return count;
}
