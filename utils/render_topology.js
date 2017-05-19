/**
 * Created by lovingyoung on 17-5-16.
 */
// var JSONdata = {
//   "nodes":[
//     {"name":"node1","group":1},
//     {"name":"node2","group":2},
//     {"name":"node3","group":2},
//     {"name":"node4","group":3}
//   ],
//   "links":[
//     {"source":2,"target":1,"weight":1},
//     {"source":0,"target":2,"weight":3}
//   ]
// };

var StaticRouteNode = [];
var StaticRouteLink = [];
var Topo = undefined;
var IdDict = {};
var NameDict = {};
var LinkList = {};

function createTopo(JSONData) {
  Topo = JSONData;
  for(var i = 0; i < JSONData.nodes.length; i++){
    JSONData.nodes[i].group = parseInt(JSONData.nodes[i].deviceId.split(':')[1]);
    IdDict[JSONData.nodes[i].deviceId] = i;
    NameDict[JSONData.nodes[i].name] = i;
  }
  for(var i = 0; i < JSONData.links.length; i++){
    JSONData.links[i].sourceStr = JSONData.links[i].source;
    JSONData.links[i].targetStr = JSONData.links[i].target;
    JSONData.links[i].source = IdDict[JSONData.links[i].sourceStr];
    if(JSONData.links[i].source === undefined) JSONData.links[i].source = NameDict[JSONData.links[i].sourceStr];
    JSONData.links[i].target = IdDict[JSONData.links[i].targetStr];
    if(JSONData.links[i].target === undefined) JSONData.links[i].target = NameDict[JSONData.links[i].targetStr];
    LinkList[[JSONData.links[i].source, JSONData.links[i].target]] = i;
    LinkList[[JSONData.links[i].target, JSONData.links[i].source]] = i;
  }
  var width = 500,
    height = 450;

  var svg = d3.select(document.getElementById("TopologyModalBody")).append("svg")
    .attr("width", width)
    .attr("height", height);

  var force = d3.layout.force()
    .gravity(.05)
    .distance(100)
    .charge(-100)
    .size([width, height]);

  function begin(json) {
    force
      .nodes(json.nodes)
      .links(json.links)
      .start();

    var link = svg.selectAll(".link")
      .data(json.links)
      .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", function (d) {
        return Math.sqrt(d.weight);
      });

    var node = svg.selectAll(".node")
      .data(json.nodes)
      .enter().append("g")
      .attr("class", "node")
      .call(force.drag)
      .on('click', function () {
        var val = this.querySelector('text').textContent;
        var data = JSONData.nodes[NameDict[val]];
        for(var i = 0; i < StaticRouteNode.length; i++)
          if(data.name === StaticRouteNode[i].name) return;
        if(StaticRouteNode.length > 0){
          var previous = StaticRouteNode[StaticRouteNode.length - 1];
          if([NameDict[previous.name], NameDict[val]] in LinkList){
            StaticRouteNode.push(data);
          } else return;
        } else {
          StaticRouteNode.push(data);
        }
        document.getElementById("staticRoute").textContent += (val + ' -> ');
      });

    node.append("circle")
      .attr("r", "5");

    node.append("text")
      .attr("dx", 12)
      .attr("dy", ".35em")
      .text(function (d) {
        return d.name
      });

    force.on("tick", function () {
      link.attr("x1", function (d) {
        return d.source.x;
      })
        .attr("y1", function (d) {
          return d.source.y;
        })
        .attr("x2", function (d) {
          return d.target.x;
        })
        .attr("y2", function (d) {
          return d.target.y;
        });

      node.attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
      });
    });
  }
  begin(JSONData);
}

function nodes2Links(){
  StaticRouteLink = [];
  for(i = 0 ; i < StaticRouteNode.length - 1; i++){
    j = i + 1;
    i_index = NameDict[StaticRouteNode[i].name];
    j_index = NameDict[StaticRouteNode[j].name];
    link_index = LinkList[[i_index, j_index]];
    link = Topo.links[link_index];
    if(link.sourceStr.startsWith('h')){
      StaticRouteLink.push(link.targetPort);
      continue;
    }
    if(link.targetStr.startsWith('h')){
      StaticRouteLink.push(link.sourcePort);
    }
    if(link.sourcePort.startsWith(StaticRouteNode[i].deviceId)){
      StaticRouteLink.push(link.sourcePort);
    } else {
      StaticRouteLink.push(link.targetPort);
    }
  };
}
