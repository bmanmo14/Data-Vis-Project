class LineGraph {
  constructor(data, religion_color, religion_graph, tooltip) {
    this.tooltip = tooltip;
    this.span = tooltip.span;
    this.religion_color = religion_color;
    this.data = data.countries;
    this.attributes = data.attributes;
    this.topics = data.topics;
    this.religion_graph = religion_graph;

    this.margin = { top: 20, right: 25, bottom: 50, left: 25 },
      this.width = 1250 - this.margin.left - this.margin.right,
      this.height = 750 - this.margin.top - this.margin.bottom;

    this.selected_countries = ["USA", "MEX"];
    this.selected_topic = null;
    this.topic_dropdown = null;
    this.selected_attribute = null;
    this.selected_year = null;
    this.paths = {};
    this.layout();
  }

  layout() {
    this.svg = d3.select("#line-graph").append("svg")
      .attr("width", this.width + this.margin.left + this.margin.right + 10)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr("width", this.width + this.margin.left + this.margin.right + 10 )
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

    this.dot_line = this.svg.append("g")
    .classed(".dot-line", true)
      .attr("width", this.width)
      .attr("height", this.height);

    const that = this;
    this.svg.on('click', function (d, i) {
      that.circles.transition()
        .duration('50')
        .style("opacity", 0);

      d3.select("#" + that.selected_countries[0] + that.selected_topic.split(/[ ,]+/)[0] + that.selected_attribute.split(/[ ,]+/)[0]).attr("stroke", "gray");
      d3.select("#" + that.selected_countries[1] + that.selected_topic.split(/[ ,]+/)[0] + that.selected_attribute.split(/[ ,]+/)[0]).attr("stroke", "gray");
      });

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

  changeSelectedTopic(topic) {
    this.topic_dropdown = topic;
    this.selected_topic = "";
    if(topic != null){
      this.selected_topic = topic;
    }
    this.selected_year = YEAR_START;
    this.drawLines();
    this.sendChange(this.height, this.height);
  }

  changeSelectedCountry(selected_countries) {
    this.selected_countries = selected_countries;
    this.circles.transition()
      .duration('50')
      .style("opacity", 0);
    this.drawLines();
    this.religion_graph.changeSelectedCountries(this.selected_countries);
  }

  drawLines() {
    this.paths = {};
    for(var c in this.selected_countries) {
      const country = this.data[this.selected_countries[c]];
      for(var t in this.topics) {
        const topic = this.topics[t];
        if (this.topic_dropdown != null && topic != this.topic_dropdown) {
          continue
        }
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
            var y_val = this.yScale(value);
            if(value < 0) {
              y_val = this.yScale(0);
            }
            if(c != 0){
              path.lineTo(this.xScale(i-YEAR_END), y_val);
            }
            else {
              path.lineTo(this.xScale(i-YEAR_START), y_val);
            }
            prev_value = value;
          }
          this.paths[country.country_code + topic.split(/[ ,]+/)[0] + attribute.split(/[ ,]+/)[0]] = [path, c, topic, attribute, country.country_code + topic.split(/[ ,]+/)[0] + attribute.split(/[ ,]+/)[0]];
        }
      }
    }
    this.drawPaths();
  }

  drawDotLines(cy, other_cy) {
    const lt = other_cy >= cy;
    this.dot_line.selectAll('line')
    .data([cy, other_cy])
    .join("line")
    .classed(".line_y", true)
    .attr("class", "label")
    .style("stroke-dasharray","4,4")
    .style("stroke", "black")
    .style("stroke-width", 1)
    .style("stroke-opacity", 1)
    .attr("x1",0)
    .attr("x2", this.width - 20)
    .attr("y1", d => d)
    .attr("y2", d => d);
    this.dot_line.selectAll("text")
    .data([cy, other_cy])
    .join("text")
    .attr("x", this.width - 10)
    .attr("y", (d, i) =>    {
      d = d > this.yScale(0) ? this.yScale(0) : d;
    if(i == 0 && !lt) {
      d += 20;
    }
      return d;
    })
    .text(d => this.yConv(d).toFixed(1) + "%");
  }

  sendChange(cy, other_cy) {
    if(this.selected_topic === "" || this.selected_attribute == "" ||this.selected_topic === null || this.selected_attribute == null) {
      this.religion_graph.changeAttrOrYear(this.selected_topic, this.selected_attribute, null, null, null);
    }
    else {
    let selectedCountryReligions = [this.data[this.selected_countries[0]].religion[this.selected_year].parent_religion,
                                      this.data[this.selected_countries[1]].religion[this.selected_year].parent_religion];
      let selectedAttrValues = [this.data[this.selected_countries[0]].topic_attributes[this.selected_year].topics[this.selected_topic].attributes[this.selected_attribute],
                                this.data[this.selected_countries[1]].topic_attributes[this.selected_year].topics[this.selected_topic].attributes[this.selected_attribute]];
      this.religion_graph.changeAttrOrYear(this.selected_topic, this.selected_attribute, this.selected_year, selectedCountryReligions, selectedAttrValues);
    }
    this.drawDotLines(cy, other_cy);
    this.tooltip.setupTooltip(this.selected_topic || this.topic_dropdown || "", this.selected_attribute, this.selected_year || YEAR_START, this.selected_countries);
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
      .call(this.drag(that));
      // .on('click', function (d, i) {
      //   // if (d.defaultPrevented) return;
      // d3.select(this).attr("stroke", "gray")
      // that.tooltip.transition()
      //   .duration('50')
      //   .style("opacity", 0);
      // that.circles.transition()
      //   .duration('50')
      //   .style("opacity", 0);

      // d3.select("#" + that.selected_countries[this.other_country] + that.selected_topic.split(/[ ,]+/)[0] + that.selected_attribute.split(/[ ,]+/)[0]).attr("stroke", "gray");
      // })

  }

  drag(that) {
    function dragstarted(d, i) {
      if (that.selected_attribute != null) {
      d3.select("#" + that.selected_countries[0] + that.selected_topic.split(/[ ,]+/)[0] + that.selected_attribute.split(/[ ,]+/)[0]).attr("stroke", "gray");
      d3.select("#" + that.selected_countries[1] + that.selected_topic.split(/[ ,]+/)[0] + that.selected_attribute.split(/[ ,]+/)[0]).attr("stroke", "gray");
      }
      this.year = 0;
      this.other_country = 0;
      this.cx = d3.mouse(this)[0];
      this.cy = d3.mouse(this)[1];
      this.other_cy = 0;
      this.other_cx = 0;
      if(d[1] != 0) {
        this.year = YEAR_END + parseInt(that.xConv(d3.mouse(this)[0]));
        this.other_country = 0;
        this.other_cx = that.xScale(this.year-YEAR_START);
      } else {
        this.year = YEAR_START + parseInt(that.xConv(d3.mouse(this)[0]));
        this.other_country = 1;
        this.other_cx = that.xScale(this.year-YEAR_END);
      }
      this.other_cy = that.yScale(that.data[that.selected_countries[this.other_country]].topic_attributes[this.year].topics[d[2]].attributes[d[3]])
      this.cy = that.yScale(that.data[that.selected_countries[d[1]]].topic_attributes[this.year].topics[d[2]].attributes[d[3]]);
      this.cx = d3.mouse(this)[0];

      var circles = [[this.cx, this.cy, d[1]], [this.other_cx, this.other_cy, this.other_country]]
      that.circles.style("opacity", 1);

      d3.select(this).attr("stroke", d => that.religion_color[that.data[that.selected_countries[d[1]]].religion[this.year].parent_religion] || that.region_color["Other"]);

      d3.select("#" + that.selected_countries[this.other_country] + d[2].split(/[ ,]+/)[0] + d[3].split(/[ ,]+/)[0]).attr("stroke", that.religion_color[that.data[that.selected_countries[this.other_country]].religion[this.year].parent_religion] || that.religion_color["Other"]);

      that.circles.selectAll("circle")
        .data(circles)
        .join("circle")
        .attr("r", CIRCLE_RADIUS)
        .attr("cx", d => d[0])
        .attr("cy", d => d[1])
        .attr("opacity", 1)
        .attr("fill", d => that.religion_color[that.data[that.selected_countries[d[2]]].religion[this.year].parent_religion] || that.religion_color["Other"]);

      that.selected_topic = d[2];
      that.selected_attribute = d[3];
      that.selected_year = this.year
      that.sendChange(this.cy, this.other_cy);
    }

    function dragged(d, i) {
      if(d[1] != 0) {
        this.year = YEAR_END + parseInt(that.xConv(d3.mouse(this)[0]));
        this.other_country = 0;
        this.other_cx = that.xScale(this.year-YEAR_START);
      } else {
        this.year = YEAR_START + parseInt(that.xConv(d3.mouse(this)[0]));
        this.other_country = 1;
        this.other_cx = that.xScale(this.year-YEAR_END);
      }
      this.other_cy = that.data[that.selected_countries[this.other_country]].topic_attributes[this.year].topics[d[2]].attributes[d[3]];

      this.cx = d3.mouse(this)[0];
      this.cy = that.data[that.selected_countries[d[1]]].topic_attributes[this.year].topics[d[2]].attributes[d[3]];

      if(!this.cy) {
        var i = 0;
        while(!this.cy && this.year - i > YEAR_START) {
            this.cy = that.data[that.selected_countries[d[1]]].topic_attributes[this.year - i].topics[d[2]].attributes[d[3]];
            i++;
        }
      }
      if(!this.other_cy){
        var i = 0;
        while(!this.other_cy && this.year - i > YEAR_START) {
            this.other_cy = that.data[that.selected_countries[this.other_country]].topic_attributes[this.year - i].topics[d[2]].attributes[d[3]];
            i++;
        }
      }

      const y = this.cy = that.yScale(this.cy) > that.yScale(0) ? that.yScale(0) : that.yScale(this.cy);
      const other_y = that.yScale(this.other_cy) > that.yScale(0) ? that.yScale(0) : that.yScale(this.other_cy);

      d3.select(this).attr("stroke", d => that.religion_color[that.data[that.selected_countries[d[1]]].religion[this.year].parent_religion] || that.religion_color.Other);

      d3.select("#" + that.selected_countries[this.other_country] + d[2].split(/[ ,]+/)[0] + d[3].split(/[ ,]+/)[0]).attr("stroke", that.religion_color[that.data[that.selected_countries[this.other_country]].religion[this.year].parent_religion] || that.religion_color["Other"]);

      const circles = [[this.cx, y, d[1]], [this.other_cx, other_y, this.other_country]]

      that.circles.selectAll("circle")
          .data(circles)
          .join("circle")
          .attr("r", CIRCLE_RADIUS)
          .attr("cx", od => od[0])
          .attr("cy", od => od[1])
          .attr("opacity", 1)
          .attr("fill", od => {
            return that.religion_color[that.data[that.selected_countries[od[2]]].religion[this.year].parent_religion] || that.religion_color["Other"];
          });
      that.selected_year = this.year
      that.sendChange(that.yScale(this.cy), that.yScale(this.other_cy));
  }

    function dragended(d, i) {
      that.selected_year = this.year
      that.sendChange(that.yScale(this.cy), that.yScale(this.other_cy));
    }

    return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
  }
}

