class LineGraph {
  constructor(data) {
    this.data = data.countries;
    this.margin = { top: 100, right: 50, bottom: 50, left: 75 },
      this.width = 1500 - this.margin.left - this.margin.right,
      this.height = 750 - this.margin.top - this.margin.bottom;
    this.layout();
  }

  layout() {
    var span = d3.select("#scatterplot");
    this.svg = span
      .append("svg")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    this.hover = d3.select("body")
      .append("div")
      .attr("class", "hover")
      .style("opacity", 0);

    // Years for both sides
    this.xScale = d3.scaleLinear()
      .domain([-1 * (YEAR_END - YEAR_START), (YEAR_END - YEAR_START)])
      .range([0, this.width]);

    // Percentage, from 0 to 100
    this.yScale = d3.scaleLinear()
      .domain([0, 100])
      .range([this.height, 0]);

    // this.line = this.svg.append("g")
    //   .attr("width", this.width)
    //   .attr("height", this.height)
    //   .attr("transform", "translate(0," + 35 + ")");

    // this.xBrushGroup = this.svg.append("g").attr("id", "brush-group");
    // for (var cat in this.categories) {
    //   var item = cat.includes('/') ? cat.split('/')[0] : cat;
    //   item = item.includes(" ") ? item.split(' ')[0] : item;
    //   this.svg.append("g").classed(item, true);
    // }
    // this.selectedIndices = [];
    this.drawLegend();
    this.draw_lines();
    this.drawLines();
    // this.selection_boxes();
  }
  draw_lines() {
    d3.selectAll(".line_x").remove();
    d3.selectAll(".line_y").remove();
    this.svg.append("g").selectAll('line')
      .data([")"])
      .join("line")
      .classed(".line_x", true)
      .attr("class", "label")
      .style("stroke", "black")
      .style("stroke-width", 1)
      .style("stroke-opacity", 1)
      .attr("x1", this.width/2)
      .attr("x2", this.width/2)
      .attr("y1", (0))
      .attr("y2", (this.height));
    this.svg.append("g").selectAll('line')
        .data([")"])
        .join("line")
        .classed(".line_y", true)
        .attr("class", "label")
        .style("stroke", "black")
        .style("stroke-width", 1)
        .style("stroke-opacity", 1)
        .attr("x1", 0)
        .attr("x2", this.width)
        .attr("y1", (this.height))
        .attr("y2", (this.height));
  }

  drawLegend() {
    var x_axis = d3.axisBottom()
      .scale(this.xScale)
      .ticks(((YEAR_END - YEAR_START) * 2))
      .tickFormat(d => {
        var ticks = Math.abs(d) + YEAR_START;
        if(d < 0){
          ticks = d + YEAR_END;
        }
        if (ticks % 5 != 0 || d == 0) {
          ticks = ""
        }
        return ticks;
      });

    var year_axis = this.svg.append("g").attr("class", "axis")
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("transform", "translate(0, " + (this.height) + ")");
    year_axis.call(x_axis);

    var y_axis = d3.axisLeft()
      .scale(this.yScale)
      .ticks(25)
      .tickFormat(d => {
        return ""
      });
    var y_axis_r = d3.axisRight()
      .scale(this.yScale)
      .ticks(25)
      .tickFormat(d => {
        return ""
      });

    var percent_axis = this.svg.append("g").attr("class", "axis")
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("transform", "translate(" + (this.width/2)  + ",0)");
    percent_axis.call(y_axis);
        var percent_axis_r = this.svg.append("g").attr("class", "axis")
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("transform", "translate(" + (this.width/2)  + ",0)");
    percent_axis_r.call(y_axis_r);
  }

  drawLines() {
    for(var j = 0; j < 17; j++) {

    }
    var path = d3.path();
    path.moveTo(this.xScale(0), this.yScale(0));
    for(var i = YEAR_START; i < YEAR_END; i++) {
      for(var topic in this.data["USA"].years[i]) {

      }
      path.lineTo(this.xScale(i-YEAR_START),this.yScale(this.data["USA"].years[i].topics["Economics and Infrastructure"].attributes["GDP growth"]));
    console.log(this.data["USA"].years[i].topics["Economics and Infrastructure"].attributes["GDP growth"])
    }
    // path.closePath();
    var p = this.svg.append("g")
          .attr("width", this.width)
      .attr("height", this.height)
      .append("path")
      // .datum(this.data["USA"])
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", path);

      // .attr("lineTo", d3.line()
      //   .x(function(d,i) { return this.xScale(i) })
      //   .y(function(d) { return this.yScale(d.years[i+YEAR_START].topics["Economics and Infrastructure"].attributes["GDP growth"]) })
      //   )
  }
}

