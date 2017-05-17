/**
 * Created by lovingyoung on 17-5-15.
 */

function getTypeAndName(varName) {

  var isNumber = function (varName) {
    var digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];
    for(var i = 0; i < varName.length; i++){
      if(! varName[i] in digits) return false;
    }
    return true;
  };

  var isDouble = function (varName) {
    return varName.includes('.');
  };

  if(!varName.includes('-') && !varName.includes('_')){
    if(isNumber(varName)){
      if(isDouble(varName)) return ['double', varName];
      else return ['int', varName];
    } else {
      return ['String', varName];
    }
  } else {
    var varType;
    if (varName.includes('-')) {
      varType = varName.split('-')[0];
    } else {
      varType = varName.split('_')[0];
    }
    varName = varName.slice(varType.length + 1);
    return [varType, varName];
  }
}
