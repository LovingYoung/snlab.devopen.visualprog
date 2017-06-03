/**
 * Created by jaceliu on 23/05/2017.
 */
function create_variable() {
  $("#confirm_variable").prop('checked', true);
}

function cancal_variable() {
  $("#confirm_variable").prop('checked', false);
}

function create_static_route() {
  $("#confirm_static_route").prop('checked', true);
  document.getElementById("staticRoute").textContent = ("Static Route: ");
  if(StaticRouteNode.length <= 0) return;
  nodes2Links();
  StaticRouteNode = [];
  var blk = workspace.newBlock("lists_create_with");
  blk.itemCount_ = StaticRouteLink.length;
  blk.updateShape_();
  for(var i = 0; i < StaticRouteLink.length; i++){
    var txt_i = workspace.newBlock("text");
    txt_i.setFieldValue(StaticRouteLink[i], "TEXT");
    txt_i.outputConnection.connect(blk.inputList[i].connection);
  };

  var txt = get_text();
  workspace.clear();
  set_text(txt);
  StaticRouteLink = [];
}

function cancal_static_route() {
  $("#confirm_static_route").prop('checked', false);
  StaticRouteNode = [];
  document.getElementById("staticRoute").textContent = ("Static Route: ");
}

var blocklyArea = document.getElementById('blocklyArea');
var blocklyDiv = document.getElementById('blocklyDiv');
var workspace = Blockly.inject(blocklyDiv,
  {
    media: 'lib/blockly/media/',
    toolbox: document.getElementById('toolbox'),
    grid:
      {
        spacing: 20,
        length: 3,
        color: "#ccc",
        snap: true
      },
    trashcan: true,
    //horizontalLayout: true
    zoom:
      {
        controls: true,
        wheel: true,
        startScale: 1.0,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2
      },
  });
var onresize = function(e) {
  // Compute the absolute coordinates and dimensions of blocklyArea.
  var element = blocklyArea;
  var x = 0;
  var y = 0;
  do {
    x += element.offsetLeft;
    y += element.offsetTop;
    element = element.offsetParent;
  } while (element);
  // Position blocklyDiv over blocklyArea.
  blocklyDiv.style.left = x + 'px';
  blocklyDiv.style.top = y + 'px';
  blocklyDiv.style.width = blocklyArea.offsetWidth + 'px';
  blocklyDiv.style.height = blocklyArea.offsetHeight + 'px';
};
window.addEventListener('resize', onresize, false);
onresize();
Blockly.svgResize(workspace);

function set_convert_info(data){
  convert_info = JSON.parse(data);
}

function get_text() {
  var xml = Blockly.Xml.workspaceToDom(workspace);
  var xml_text = Blockly.Xml.domToPrettyText(xml);
  return xml_text;
}

function set_text(text) {
  var xml = Blockly.Xml.textToDom(text);
  Blockly.Xml.domToWorkspace(xml, workspace);
}

function clear_blocks() {
  Blockly.mainWorkspace.clear();
}

function get_code() {
  var iframe = document.getElementById("typeIframe");
  Blockly.Java.buildSkeleton(iframe.contentWindow.workspace);
  return Blockly.Java.workspaceToCode(workspace);
}

var socket = io("http://" + window.location.hostname + ":9001");
socket.on("connect", function () {
  console.log("connected");
});
socket.on("disconnect", function () {
  console.log('disconnected');
});
socket.on("lineNumber", function (msg) {
  if(typeof(msg) === 'string'){
    msg = parseInt(msg);
  }
  var item = convert_info[msg];
  if(item){
    console.log(item.id);
    var blk = workspace.getBlockById(item.id);
    blk.select();
  }
});

workspace.addChangeListener(Blockly.Variables.variableCallback);

$("#variable_type").change(function () {
  var val = $("#variable_type").val();
  if(val === "MAP"){
    $("#variable_subtype_value_label").removeClass("hidden");
    $("#variable_subtype_value").removeClass("hidden");
    $("#variable_subtype_label").removeClass("hidden");
    $("#variable_subtype").removeClass("hidden");
  } else if(val === "SET" || val === "ARRAY"){
    $("#variable_subtype_label").removeClass("hidden");
    $("#variable_subtype").removeClass("hidden");
    $("#variable_subtype_value_label").addClass("hidden");
    $("#variable_subtype_value").addClass("hidden");
  } else {
    $("#variable_subtype_value_label").addClass("hidden");
    $("#variable_subtype_value").addClass("hidden");
    $("#variable_subtype_label").addClass("hidden");
    $("#variable_subtype").addClass("hidden");
  }
});