/**
 * Created by jaceliu on 09/05/2017.
 */

function BlockCollections(){
    this.load_blocks = function () {
        var cls = this;
        var block_list = Object.getOwnPropertyNames(this).filter(function (p){
            return (p.startsWith("network")) && (typeof cls[p] === 'function');
        });
        for(var i = 0; i < block_list.length; i++){
            var name = block_list[i];
            var fn = this[name];
            if(typeof fn === 'function')
                Blockly.Blocks[name] = fn();
        }
    }
}

var functions = new BlockCollections();
var constants = new BlockCollections();
var variables = new BlockCollections();

/* Functions */
functions.network_onPacket = function(){
    var json = {
        "message0": "onPacket with pkt",
        "args0": [],
        "message1": "Do %1",
        "args1": [{"type": "input_statement", "name": "DO"}],
        "message2": "set action %1",
        "args2": [{"type": "input_value", "name":"ACTION", "check": "Number", "align": "RIGHT"}],
        "colour": 100
    };
    return {
        init: function(){
            this.jsonInit(json);
            this.setDeletable(false);
        }
    }
};

functions.network_IPv4SrcIs = function() {
    var json = {
        "message0": "IPv4SrcIs %1",
        "args0": [{"type": "input_value", "name": "IP", "check": "IP"}],
        "output": "Boolean",
        "colour": 100
    };
    return {
        init: function () {
            this.jsonInit(json);
        }
    }
};

functions.network_IPv4DstIs = function () {
    var json = {
        "message0": "IPv4DstIs %1",
        "args0": [{"type": "input_value", "name": "IP", "check": "IP"}],
        "output": "Boolean",
        "colour": 100
    };
    return {
        init: function () {
            this.jsonInit(json);
        }
    }
};

/* Constants */

constants.network_static_ip = function () {
    var json = {
        "message0": "%1.%2.%3.%4",
        "args0":[
            {"type": "field_number", "name": "IP_1", "check": "Number"},
            {"type": "field_number", "name": "IP_2", "check": "Number"},
            {"type": "field_number", "name": "IP_3", "check": "Number"},
            {"type": "field_number", "name": "IP_4", "check": "Number"}
        ],
        "output": "IP",
        "colour": "150",
        "inputsInline": true
    };
    return {
        init: function () {
            this.jsonInit(json);
        }
    }
};

/* Variables */

var collection_list= [
    'functions',
    'constants',
    'variables'
];

function load_blocks(){
    for(var i = 0; i < collection_list.length; i++){
        window[collection_list[i]].load_blocks();
    }
}
