//Create function to make graph responsive
function makeResponsive(){

  //Create margins and define parameters for svg group
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 40,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("/D3_data_journalism/assets/data/data.csv").then(function(censusData) {

    // Parse Data/Cast as numbers
    censusData.forEach(function(data) {
      data.smokes = +data.smokes;
      data.age = +data.age;
    });

    //Create scale functions
    
    var xLinearScale = d3.scaleLinear()
      .domain([8, d3.max(censusData, d => d.smokes)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([30, d3.max(censusData, d => d.age)])
      .range([height, 0]);

    //Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //Append Axes to the chart
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    //Create Circles
 
    var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.smokes))
    .attr("cy", d => yLinearScale(d.age))
    .attr("r", "15")
    .attr("fill", "lightblue")
    .attr("stroke", "gray")
    .attr("opacity", ".75")
    .on('mouseover', toolTip.show)
    .on('mouseout', toolTip.hide);

   var Statecircles = chartGroup.selectAll()
    .data(censusData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.smokes))
    .attr("y",d => yLinearScale(d.age))
    .attr("font-family", "sans-serif")
    .attr("font-size", "11px")
    .style("text-anchor", "middle")
    .style("fill", "ivory")
    .text(d => d.abbr);

  // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Age (Median)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Percent of Smokers (%)");

  }).catch(function(error) {
    console.log(error);
  });

   // Initialize tool tip
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([0, 10])
      .html(function(d) {
        return (`${d.state} <br><br> Smokes(%): ${d.smokes}% <br> Age(Median): ${d.age}`);
      });

    
    //Call tooltip
    chartGroup.call(toolTip);

   


}makeResponsive();

d3.select(window).on("resize", makeResponsive);