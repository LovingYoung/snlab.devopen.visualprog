/**
 * Created by lovingyoung on 17-5-15.
 */

function getTypeAndName(varName) {
    if(!varName.includes('-') && !varName.includes('_')) return ['int', varName];
    var varType;
    if(varName.includes('-')) {
        varType = varName.split('-')[0];
    } else{
        varType = varName.split('_')[0];
    }
    varName = varName.slice(varType.length + 1);
    return [varType, varName];
}