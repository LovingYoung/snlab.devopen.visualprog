/**
 * Created by jaceliu on 09/05/2017.
 */

function string_length(){
    return {
        init: function() {
            this.appendValueInput('VALUE')
                .setCheck('String')
                .appendField('length of');
            this.setOutput(true, 'Number');
            this.setColour(160);
            this.setTooltip('Returns number of letters in the provided text.');
            this.setHelpUrl('http://www.w3schools.com/jsref/jsref_length_string.asp');
        }
    };
}

var block_list = [
    "string_length"
];

function load_blocks(){
    for(var i = 0; i < block_list.length; i++){
        var name = block_list[i];
        var fn = window[name];
        if(typeof fn === 'function')
            Blockly.Blocks[name] = fn();
    }
}
