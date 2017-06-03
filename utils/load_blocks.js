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
    // "message2": "set action %1",
    // "args2": [{"type": "input_value", "name":"ACTION", "check": "Number", "align": "RIGHT"}],
    "colour": 270
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
    "message0": "IPv4 Src is %1",
    "args0": [{"type": "input_value", "name": "IP", "check": "IP"}],
    "output": "Boolean",
    "colour": 270
  };
  return {
    init: function () {
      this.jsonInit(json);
    }
  }
};

functions.network_IPv4DstIs = function () {
  var json = {
    "message0": "IPv4 Dst is %1",
    "args0": [{"type": "input_value", "name": "IP", "check": "IP"}],
    "output": "Boolean",
    "colour": 270
  };
  return {
    init: function () {
      this.jsonInit(json);
    }
  }
};

functions.network_setRoute = function () {
  var json = {
    "message0": "Set Action %1",
    "args0": [{
      "type": "input_value", "name": "Route", "check": "ArrayList<String>"
    }],
    "colour": 270,
    "previousStatement": "Action"
  };
  return {
    init: function () {
      this.jsonInit(json);
    }
  }
};

functions.network_TCPSrcPortIs = function () {
  var json = {
    "message0" : "TCP Src Port is %1",
    "args0": [{ "type" : "input_value", "name": "Port", "check": "Number" }],
    "colour": 270,
    "output": "Boolean"
  };
  return {
    init: function () {
      this.jsonInit(json);
    }
  }
};

functions.network_TCPDstPortIs = function () {
  var json = {
    "message0" : "TCP Dst Port is %1",
    "args0": [{ "type" : "input_value", "name": "Port", "check": "Number" }],
    "colour": 270,
    "output": "Boolean"
  };
  return {
    init: function () {
      this.jsonInit(json);
    }
  }
};

functions.network_PassToNext = function () {
  var json = {
    "message0": "Pass to next",
    "colour": 270,
    "previousStatement": "Action"
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

constants.network_DROP = function () {
  var json = {
    "message0": "DROP",
    "output": "ArrayList<String>",
    "colour": "150"
  };
  return {
    init: function () {
      this.jsonInit(json);
    }
  }
};

constants.network_TYPE_IPv4 = function () {
  var json = {
    "message0": "TYPE_IPv4",
    "colour": 150,
    "output": "Ethernet_Type"
  };
  return {
    init: function () {
      this.jsonInit(json);
    }
  }
};

/* Variables */

variables.network_ethType = function () {
  var json = {
    "message0": "Ethernet Type",
    "colour": 200,
    "output": "Ethernet_Type"
  };
  return {
    init: function () {
      this.jsonInit(json);
    }
  }
};

/* Loading Blocks */
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

load_blocks();