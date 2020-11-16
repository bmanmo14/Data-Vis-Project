class LineGraph {
  constructor(data) {
    this.data = data.countries;
    this.attributes = data.attributes;
    this.topics = data.topics;

    this.margin = { top: 100, right: 50, bottom: 50, left: 75 },
      this.width = 1500 - this.margin.left - this.margin.right,
      this.height = 750 - this.margin.top - this.margin.bottom;

    this.selected_countries = ["USA", "MEX"];
    this.selected_topic = null;
    this.selected_attribute = null;
    this.selected_year = null;
    this.layout();
  }

  layout() {
    var span = d3.select("#line-graph");
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

    this.path = this.svg.append("g")
      .attr("width", this.width)
      .attr("height", this.height);

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
    var paths = [];
    for(var c in this.selected_countries) {
      const country = this.data[this.selected_countries[c]];
      for(var t in this.topics) {
        const topic = this.topics[t];
        console.log(topic)
        for(var a in this.attributes) {
          var path = d3.path();
          var prev_value = 0;
          path.moveTo(this.xScale(0), this.yScale(0));
          const attribute = this.attributes[a];
          if(c != 0){
            prev_value = country.years[YEAR_START].topics[topic].attributes[attribute] || prev_value;
            path.moveTo(0, this.yScale(prev_value));
          }
          console.log(attribute)
          for(var i = YEAR_START; i < YEAR_END; i++) {
            const value = country.years[i].topics[topic].attributes[attribute] || prev_value;
            if(c != 0){
              path.lineTo(this.xScale(i-YEAR_END), this.yScale(value));
            }
            else {
              path.lineTo(this.xScale(i-YEAR_START), this.yScale(value));
            }
            prev_value = value;
          }
          paths.push(path);
        }
      }
      console.log(country)
    }
    this.drawPaths(paths);
  }

  drawPaths(p) {
    this.path.selectAll("path")
      .data(p)
      .join("path")
      .attr("fill", "none")
      .attr("stroke", "gray")
      .attr("stroke-width", 1.5)
      .attr("d", d => d);
  }

}

