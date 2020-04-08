var svg = d3.select("#sv_map");

var width = svg.node().getBoundingClientRect().width;
var height = svg.node().getBoundingClientRect().height;

//width = +svg.attr("width"),
//height = +svg.attr("height");

countyValues = d3.map();
countyText = d3.map();
countyMin = Number.MAX_SAFE_INTEGER;
countyMax = Number.MIN_SAFE_INTEGER;

$('#subtitle').hide();

d3.queue()
  .defer(d3.json, "./data/geo/sweden-counties.topojson")
  .defer(d3.csv, "./data/csv/deaths_by_region.csv", function(d){
	var countyName = d['Region'];
	var countyVal = +d['Totalt_antal_avlidna'] / +d['Population'];
	countyValues.set(countyName, countyVal);
	countyText.set(countyName, d['Totalt_antal_avlidna'] + " (pop:" + d["Population"]+")");
	  if(countyVal < countyMin){
		  countyMin = countyVal;
	  }
	  if(countyVal > countyMax){
		  countyMax = countyVal;
	  }
  })
  .await(ready);

function ready(error, topo, csvfile){

  var colorScale = d3.scaleLinear()
	.domain([countyMin, countyMax])
	//.range(['#ffd3d3', '#ff0000']);
	.range(['#eee', '#ff0000']);
	//.range(['#d0d0f9', '#ff0000']);

  var path = d3.geoPath();
  var projection = d3.geoMercator()
  .rotate(-75)
  .fitSize([width,height], topojson.feature(topo, topo.objects['sweden-counties']));
  var path = d3.geoPath().projection(projection);

  svg.append("g")
    .attr('id', 'svgmaing')
    .selectAll("path")
    .data(topojson.feature(topo, topo.objects['sweden-counties']).features)
    .enter()
    .append("path")
      // draw each region
    .attr("d", function(feature){ return path(feature); })
    .attr("data-desc", function(d){ return countyText.get( d.properties.name ); })
    .attr("data-name", function(d){ return d.properties.name; })
	.attr('fill', function(d){ 
		return colorScale(countyValues.get( d.properties.name ));
	})
	.on("mouseover", function(d){
      d3.select(this).attr('stroke', 'grey');
      var total_people = d3.select(this).attr('data-desc');
      var display_txt = d3.select(this).attr('data-name');
      if(total_people){
        display_txt += " - " + total_people;
      }
      $('#subtitle').show();
      $('#subtitle').text(display_txt);
      d3.select('#subtitle')
        .style('left', (d3.event.pageX) + "px")
        .style('top', (d3.event.pageY - 28) + "px");

    })
    .on("mouseout", function(d){
      d3.select(this).attr('stroke', 'none');
      $('#subtitle').hide();
    });
}
