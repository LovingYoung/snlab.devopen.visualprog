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

function createTopo(JSONData) {
  var dict = {};
  for(var i = 0; i < JSONData.nodes.length; i++){
    JSONData.nodes[i].group = parseInt(JSONData.nodes[i].deviceId.split(':')[1]);
    dict[JSONData.nodes[i].deviceId] = i;
  }
  for(var i = 0; i < JSONData.links.length; i++){
    JSONData.links[i].sourceStr = JSONData.links[i].source;
    JSONData.links[i].targetStr = JSONData.links[i].target;
    JSONData.links[i].source = dict[JSONData.links[i].sourceStr];
    JSONData.links[i].target = dict[JSONData.links[i].targetStr];
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
    console.log(json);
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
      .call(force.drag);

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
