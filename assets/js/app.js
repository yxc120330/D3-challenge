// set up the chart
var svgWidth = 1200;
var svgHeight = 500;
var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 120
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Step2: Create an SVG wrapper,
// append an SVG group that will hold the chart, 
// and shift hte latter by left and top margins. 

var svg = d3
    .select("body")
    .append("svg")
    .attr("width",svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform",`translate(${margin.left},${margin.top})`);

// step 3: import data from the data.csv file
(async function(){
    var url = "https://raw.githubusercontent.com/yxc120330/D3-challenge/master/assets/data/data.csv"
    var newspaperdata = await d3.csv(url).catch(function(error){
        console.log(error);
    })

//step 4: Parse the data
//format the data and convert to numerical and date values
//========================================================
//Format the data
newspaperdata.forEach(function(data){
    data.healthcare = +data.healthcare;
    data.poverty = +data.poverty;
});

//step 5: Create the scale function
//========================================================
var xLinearScale = d3.scaleLinear() 
                     .domain([8,d3.max(newspaperdata, d=>d.poverty)*1.1])
                     .range([0,width]);
var yLinearScale = d3.scaleLinear() 
                     .domain([0,d3.max(newspaperdata, d=>d.healthcare)*1.1])
                     .range([height,0]);                   

// step 6: create axis functions
//========================================================
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

// step 7: append axis to the chart
//========================================================
chartGroup.append("g")
          .attr("transform",`translate(0,${height})`)
          .call(bottomAxis);
chartGroup.append("g")
          .call(leftAxis);

// step 8: create circles
//========================================================
var circlesGroup = chartGroup.selectAll("circle")
.data(newspaperdata)
.enter()
.append("circle")
.attr("cx", d => xLinearScale(d.poverty))
.attr("cy", d => yLinearScale(d.healthcare))
.attr("r", "15")
.attr("fill", "pink")
.attr("opacity", ".65");


circlesGroup.append("svg:text")
            .attr("class","nodetext")
            .attr("dx",12)
            .attr("dy",".35em")
            .text("fill", d=> d.abbr);

// step 9: INitialize tool tip
//=========================================================
var toolTip = d3.tip()
                .attr("class","tooltip")
                .offset([80,-60])
                .html(function(d){
                    return (`${d.state}<br>Healthcare :${d.healthcare}<br>Hits: ${d.poverty}`);
                });

// step 10: Create tooltip in the chart
//=========================================================
chartGroup.call(toolTip);

// step 11: Create event listeners to display and hide the tooltip
//=========================================================
circlesGroup.on("click",function(data){
    toolTip.show(data,this);
})

// onmouseout event
.on("mouseout",function(data,index){
toolTip.hide(data);
})

//Create axis labels
chartGroup.append("text")
          .attr("transform","rotate(-90)")
          .attr("y", 0 - margin.left+20)
          .attr("x", 0 - (height/2))
          .attr("dy","1em")
          .attr("class","axisText")
          .text("Lacks Healthcare (%)")

chartGroup.append("text")
          .attr("transform", `translate(${width/2},${height +margin.top +30})`)
          .attr("class","axisText")
          .text("In Poverty (%)")


})()


