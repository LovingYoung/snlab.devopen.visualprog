/**
 * Created by lovingyoung on 17-5-24.
 */
function BlockCollections(){
  this.load_blocks = function () {
    var cls = this;
    var block_list = Object.getOwnPropertyNames(this).filter(function (p){
      return (p.startsWith("type")) && (typeof cls[p] === 'function');
    });
    for(var i = 0; i < block_list.length; i++){
      var name = block_list[i];
      var fn = this[name];
      if(typeof fn === 'function')
        Blockly.Blocks[name] = fn();
    }
  }
}

var primitive_types = new BlockCollections();
var structure = new BlockCollections();
var generic = new BlockCollections();

primitive_types.type_primitive = function () {
  var json = {
    "message0": "%1",
    "args0":[
      {
        "type": "field_dropdown",
        "name": "TYPE",
        "options": [
          ["Integer", "INT"],
          ["Decimal", "DOUBLE"],
          ["Character", "CHAR"],
          ["String", "STRING"]
        ]
      }
    ],
    "colour": 250,
    "output": "Type"
  };
  return {
    init: function () {
      this.jsonInit(json);
    }
  }
};

primitive_types.type_array = function () {
  var json = {
    "message0": "array of %1",
    "args0": [{"type": "input_value", "name": "TYPE", "check": "Type"}],
    "colour": 250,
    "output": "Type"
  };
  return {
    init: function () {
      this.jsonInit(json);
    }
  }
};

primitive_types.type_map = function () {
  var json = {
    "message0": "map from %1 to %2",
    "args0": [
      {
        "type": "input_value",
        "name": "TYPE_KEY",
        "check": "Type"
      },
      {
        "type": "input_value",
        "name": "TYPE_VALUE",
        "check": "Type"
      }
      ],
    "colour": 250,
    "output": "Type",
    "inputsInline": true
  };
  return {
    init: function () {
      this.jsonInit(json);
    }
  }
};

primitive_types.type_set = function () {
  var json = {
    "message0": "set of %1",
    "args0": [{"type": "input_value", "name": "TYPE", "check": "Type"}],
    "colour": 250,
    "output": "Type"
  };
  return {
    init: function () {
      this.jsonInit(json);
    }
  }
};

structure.type_property = function () {
  var json = {
    "message0": "Property of %1 with name of %2",
    "args0": [
      {
        "type": "input_value",
        "name": "TYPE",
        "check": "Type"
      },
      {
        "type": "field_input",
        "name": "NAME",
        "text": "name"
      }
    ],
    "colour": 200,
    "previousStatement": true,
    "nextStatement": true,
    "inputsInline": true
  };
  return {
    init: function () {
      this.jsonInit(json);
    }
  }
};

structure.type_struct = function () {
  var json = {
    "message0": "Define Struct %1",
    "args0": [ { "type": "field_input", "name": "NAME", "text": "name" } ],
    "message1": "%1",
    "args1": [ { "type": "input_statement", "name": "PROPERTIES" } ],
    "colour": 200
  };
  return {
    init: function () {
      this.jsonInit(json);
    }
  }
};

generic.type_generic = function () {
  return{
    init: function () {
      this.appendDummyInput('TOPROW')
        .appendField('', 'NAME');
      this.setOutput("Type");
      this.setColour(150);
    },
    renameType: function (oldName, newName) {
      if(Blockly.Names.equals(oldName, this.getTypeName())){
        this.setFieldValue(newName, 'NAME');
      }
    },
    getTypeName: function () {
      return this.getFieldValue("NAME");
    },
    domToMutation: function (xmlElement) {
      var name = xmlElement.getAttribute('name');
      this.renameType(this.getTypeName(), name);
    },
    mutationToDom: function () {
      var container = document.createElement('mutation');
      container.setAttribute('name', this.getTypeName());
      return container;
    }
  }
};


/* Loading Blocks */
var collection_list= [
  'primitive_types',
  'structure',
  'generic'
];

function load_blocks(){
  for(var i = 0; i < collection_list.length; i++){
    window[collection_list[i]].load_blocks();
  }
}

load_blocks();
