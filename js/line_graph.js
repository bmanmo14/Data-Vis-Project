class LineGraph {
  constructor(data, religion_color, religion_graph) {
    this.religion_color = religion_color;
    this.data = data.countries;
    this.attributes = data.attributes;
    this.topics = data.topics;
    this.religion_graph = religion_graph;

    this.margin = { top: 150, right: 25, bottom: 50, left: 25 },
      this.width = 1250 - this.margin.left - this.margin.right,
      this.height = 750 - this.margin.top - this.margin.bottom;

    this.tooltip_margin = { top: 25, right: 25, bottom: 25, left: 25 },
      this.tooltip_width = 1250 - this.tooltip_margin.left - this.tooltip_margin.right,
      this.tooltip_height = 150 - this.tooltip_margin.top - this.tooltip_margin.bottom;

    this.selected_countries = ["USA", "MEX"];
    this.selected_topic = null;
    this.selected_attribute = null;
    this.selected_year = null;
    this.paths = {};
    this.layout();
  }

  layout() {
    var span = d3.select("#line-graph").append("svg")
      .attr("width", this.tooltip_width + this.tooltip_margin.left + this.tooltip_margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
    this.tooltip = span
      .append("g")
      .attr("transform", "translate(" + this.tooltip_margin.left + "," + this.tooltip_margin.top + ")")
      .attr("width", this.tooltip_width + this.tooltip_margin.left + this.tooltip_margin.right)
      .attr("height", this.tooltip_height + this.tooltip_margin.top + this.tooltip_margin.bottom)

    this.svg = span
      .append("g")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    // Years for both sides
    this.xScale = d3.scaleLinear()
      .domain([-1 * (YEAR_END - YEAR_START), (YEAR_END - YEAR_START)])
      .range([0, this.width]);

    // Years for both sides
    this.xConv = d3.scaleLinear()
      .range([-1 * (YEAR_END - YEAR_START), (YEAR_END - YEAR_START)])
      .domain([0, this.width]);

    // Percentage, from 0 to 100
    this.yScale = d3.scaleLinear()
      .domain([0, 100])
      .range([this.height, 0]);

    this.yConv = d3.scaleLinear()
      .range([0, 100])
      .domain([this.height, 0]);

    this.path = this.svg.append("g")
      .attr("width", this.width)
      .attr("height", this.height);

    this.circles = this.path
      .append("g")
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("class", "circ")
      .style("opacity", 0);
    this.drawLegend();
    this.draw_lines();
    this.drawLines();
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

  changeSelectedCountry(selected_countries) {
    this.selected_countries = selected_countries;
    this.drawLines();
  }

  drawLines() {
    this.paths = {};
    for(var c in this.selected_countries) {
      const country = this.data[this.selected_countries[c]];
      for(var t in this.topics) {
        const topic = this.topics[t];
        for(var a in this.attributes) {
          var path = d3.path();
          var prev_value = 0;
          path.moveTo(this.xScale(0), this.yScale(0));
          const attribute = this.attributes[a];
          if(c != 0){
            prev_value = country.topic_attributes[YEAR_START].topics[topic].attributes[attribute] || prev_value;
            path.moveTo(0, this.yScale(prev_value));
          }
          for(var i = YEAR_START; i < YEAR_END; i++) {
            const value = country.topic_attributes[i].topics[topic].attributes[attribute] || prev_value;
            if(c != 0){
              path.lineTo(this.xScale(i-YEAR_END), this.yScale(value));
            }
            else {
              path.lineTo(this.xScale(i-YEAR_START), this.yScale(value));
            }
            prev_value = value;
          }
          this.paths[country.country_code + topic.split(/[ ,]+/)[0] + attribute.split(/[ ,]+/)[0]] = [path, c, topic, attribute, country.country_code + topic.split(/[ ,]+/)[0] + attribute.split(/[ ,]+/)[0]];
        }
      }
    }
    this.drawPaths();
  }

  sendChange(year) {
    this.religion_graph.changeAttrOrYear(this.selected_topic, this.selected_attribute, year);
  }

  drawPaths() {
    const that = this
    const sel_country = Object.keys(this.paths).map(d => {
      return this.paths[d];
    });
    console.log(sel_country);
    this.path.selectAll("path")
      .data(sel_country)
      .join("path")
      .attr("id", d => d[4])
      .attr("fill", "none")
      .attr("stroke", "gray")
      .attr("stroke-width", 4)
      .attr("d", d => d[0])
      .on('click', function (d, i) {
        var year = 0;
        var other_country = "";
        if(d[1] != 0) {
          year = YEAR_END + parseInt(that.xConv(d3.mouse(this)[0]));
          other_country = 0;
        } else {
          year = YEAR_START + parseInt(that.xConv(d3.mouse(this)[0]));
          other_country = 1;
        }
        const d2 = [null, other_country, d[2], d[3]]
        d3.select("#" + that.selected_countries[other_country] + d[2].split(/[ ,]+/)[0] + d[3].split(/[ ,]+/)[0]).attr("stroke", other => {
          return that.religion_color[that.data[that.selected_countries[other_country]].religion[year].parent_religion];
        });
        d3.select(this).attr("stroke", d => {
          return that.religion_color[that.data[that.selected_countries[d[1]]].religion[year].parent_religion];
        });
        that.tooltip.transition()
          .duration(50)
          .style("opacity", 1)
          .style("stroke-width", 2);
        that.tooltip.selectAll("text")
                .data([d])
        .join("text")
        .text(that.selected_countries[0] + "  " + that.selected_countries[1])
        ;

        // that.tooltip.html(
        //   "<div class=tooltip-title>" + d[3] + "</div>"
        // )
        // .style("left", (d3.event.pageX + 10) + "px")
        // .style("top", (d3.event.pageY - 15) + "px");
        that.circles.style("opacity", 1);
        that.circles.selectAll("circle")
        .data([d])
        .join("circle")
        .attr("r", CIRCLE_RADIUS)
        .attr("cx", d3.mouse(this)[0])
        .attr("cy", d3.mouse(this)[1])
        .attr("opacity", 1)
        .attr("fill", d => {
          return that.religion_color[that.data[that.selected_countries[d[1]]].religion[year].parent_religion];
        });
        that.selected_topic = d[2];
        that.selected_attribute = d[3];
        that.sendChange(year);
      })
      .on('mouseout', function (d, i) {
        d3.select(this).attr("stroke", "gray")
        that.tooltip.transition()
          .duration('50')
          .style("opacity", 0);
        that.circles.transition()
          .duration('50')
          .style("opacity", 0);
        var year = 0;
        var other_country = 0;
        if(d[1] != 0) {
          year = YEAR_END + parseInt(that.xConv(d3.mouse(this)[0]));
          other_country = 0;
        } else {
          year = YEAR_START + parseInt(that.xConv(d3.mouse(this)[0]));
          other_country = 1;
        }
        d3.select("#" + that.selected_countries[other_country] + d[2].split(/[ ,]+/)[0] + d[3].split(/[ ,]+/)[0]).attr("stroke", "gray");
        // that.selected_topic = null;
        // that.selected_attribute = null;
        // that.sendChange(null);
      });
  }

}

