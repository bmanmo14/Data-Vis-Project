class Tooltip {
  constructor(data) {
    this.data = data.countries;
    this.attributes = data.attributes;
    this.topics = data.topics;

    // this.margin = { top: 150, right: 25, bottom: 50, left: 25 },
    //   this.width = 1250 - this.margin.left - this.margin.right,
    //   this.height = 750 - this.margin.top - this.margin.bottom;

    this.description_margin = { top: 100, right: 25, bottom: 20, left: 25 },
      this.description_width = 1250 - this.description_margin.left - this.description_margin.right,
      this.description_height =  50 - this.description_margin.top - this.description_margin.bottom;

    this.tooltip_margin = { top: 20, right: 25, bottom: 10, left: 25 },
      this.tooltip_width = 1250 - this.tooltip_margin.left - this.tooltip_margin.right,
      this.tooltip_height = 100 - this.tooltip_margin.top - this.tooltip_margin.bottom;

    this.selected_topic = null;
    this.selected_attribute = null;
    this.selected_year = null;
    this.layout();
  }

  layout() {
    this.desc_span = d3.select("#attribute-selection").append("svg")
      .attr("width", this.description_width + this.description_margin.left + this.description_margin.right)
      .attr("height", 175);

    this.span = d3.select("#tooltip").append("svg")
      .attr("width", this.tooltip_width + this.tooltip_margin.left + this.tooltip_margin.right)
      .attr("height", this.tooltip_height + this.tooltip_margin.top + this.tooltip_margin.bottom);

    this.tooltip = this.span
      .append("g")
      .attr("transform", "translate(" + this.tooltip_margin.left + "," + this.tooltip_margin.top + ")")
      .attr("width", this.tooltip_width + this.tooltip_margin.left + this.tooltip_margin.right)
      .attr("height", this.tooltip_height + this.tooltip_margin.top + this.tooltip_margin.bottom);

    this.description = this.desc_span
      .append("g")
      .attr("transform", "translate(" + this.tooltip_margin.left + "," + this.tooltip_margin.top + ")")
      .attr("width", this.tooltip_width + this.tooltip_margin.left + this.tooltip_margin.right)
      .attr("height", this.tooltip_height + this.tooltip_margin.top + this.tooltip_margin.bottom)
        .append('text')
        .attr('id', 'attr-desc')

    this.tooltip_lines = this.tooltip.append("g");
    this.tooltip_data_left = this.tooltip.append("g")
      .attr("transform", "translate(" + this.tooltip_margin.left + "," + this.tooltip_margin.top + ")")
      .attr("width", this.tooltip_width/2)
      .attr("height", this.tooltip_height + this.tooltip_margin.top + this.tooltip_margin.bottom);

    this.tooltip_data_right = this.tooltip.append("g")
      .attr("transform", "translate(" + (this.tooltip_width/2 + this.tooltip_margin.left) + "," + this.tooltip_margin.top + ")")
      .attr("width", this.tooltip_width/2)
      .attr("height", this.tooltip_height + this.tooltip_margin.top + this.tooltip_margin.bottom);

    this.drawLines();
  }

  drawLines() {
    this.tooltip_lines.append("line")
      .classed(".tooltip_lines", true)
      .attr("class", "label")
      .style("stroke", "black")
      .style("stroke-width", 1)
      .style("stroke-opacity", 1)
      .attr("x1", 0)
      .attr("x2", this.tooltip_width)
      .attr("y1", (0))
      .attr("y2", (0));
    this.tooltip_lines.append("line")
      .classed(".tooltip_lines", true)
      .attr("class", "label")
      .style("stroke", "black")
      .style("stroke-width", 1)
      .style("stroke-opacity", 1)
      .attr("x1", 0)
      .attr("x2", this.tooltip_width)
      .attr("y1", this.tooltip_height)
      .attr("y2", this.tooltip_height);
    this.tooltip_lines.append("line")
      .classed(".tooltip_lines", true)
      .attr("class", "label")
      .style("stroke", "black")
      .style("stroke-width", 1)
      .style("stroke-opacity", 1)
      .attr("x1", this.tooltip_width/2)
      .attr("x2", this.tooltip_width/2)
      .attr("y1", 0)
      .attr("y2", this.tooltip_height);
  }

  updateDescription(selected_year, selected_attribute, selected_topic, country) {
    let desc = country.topic_attributes[selected_year].topics[selected_topic].attribute_definition[selected_attribute];

    let description = d3.select("#attribute-selection").select("g");

    description.selectAll('text').remove();


    // topic description logic
    description.append('text').append("tspan")
        .attr("x", 0)
        .attr("dy", (d, i) => (0.8 * 2) + "em")
        .attr("class", "center-text")
        .style("opacity", 1)
        .style('font-size', '24px')
        .text('Topic: ' + selected_topic);

    // attribute description logic
    description.append('text').append("tspan")
        .attr("x", 0)
        .attr("dy", (d, i) => (1.6 * 2) + "em")
        .attr("class", "center-text")
        .style("opacity", 1)
        .style('font-size', '18px')
        .text('Attribute: ' + selected_attribute);

    description.append('text').append("tspan")
        .attr("x", 0)
        .attr("dy", (d, i) => (2.8 * 2) + "em")
        .attr("class", "center-text description")
        .style("opacity", 1)
        .text('Description:');

    let text = description.append('text')
        .attr("class", "description")
        .attr("x", 0)
        .attr("dy", (d, i) => (3.2 * 2) + "em")
        .text(desc);
    this.wrapText(text, 15)
  }

  wrapText(text, scale) {
    // logic for making text wrap inside an svg
    let words = text.text().split(/\s+/).reverse();
    let width = this.description_width + this.description_margin.left + this.description_margin.right;
    let y = parseFloat(text.attr('dy'));
    let x = text.attr('x');
    let anchor = text.attr('text-anchor');

    let tspan = text.text(null).append('tspan').attr('x', x).attr('y', y).attr('text-anchor', anchor);
    let lineNumber = 0;
    let line = [];
    let word = words.pop();

    while (word) {
      line.push(word);
      tspan.text(line.join(' '));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(' '));
        line = [word];
        tspan = text.append('tspan').attr('x', x).attr('y', 125 + (lineNumber * scale)).attr('anchor', anchor).text(word);
        lineNumber += 1;
      }
      word = words.pop();
    }
  }

  // Topic: Attribute Description?
  // Religion both sides?
  // Attribute?
  // Percentage?
  setupTooltip(selected_topic, selected_attribute, selected_year, selected_countries) {
    this.selected_topic = selected_topic;
    if(selected_attribute != this.selected_attribute) {
      this.selected_attribute = selected_attribute;
      if(selected_attribute !== '') {
        let country = this.data[selected_countries[0]]
        this.updateDescription(selected_year, selected_attribute, selected_topic, country);
      }
      else {
        d3.select("#attribute-selection").select("g").selectAll('text').remove();
      }
    }
    this.selected_year = selected_year;
    this.selected_countries = selected_countries;
    this.tooltip_data_right
      .selectAll("text").remove();
    this.tooltip_data_left
      .selectAll("text").remove();
    if(selected_attribute !== '') {
      const labels = [
        "Religion: ",
        "Percentage: ",
        "Year: "
      ];
      let left_percent = parseFloat(this.data[this.selected_countries[1]].topic_attributes[selected_year].topics[selected_topic].attributes[selected_attribute]);
      left_percent = Number.isNaN(left_percent) ? 0.0 : left_percent.toFixed(2);
      const label_value_left = [
        Object.keys(this.data[this.selected_countries[1]].religion[this.selected_year].religions)[0],
        left_percent + '%',
        selected_year
      ];
      const text = this.tooltip_data_left
          .selectAll("text")
          .data(labels)
          .enter()
          .append("text")
          .attr("class", "center-text")
          .style("opacity", 1);

      text.append("tspan")
          .attr("x", 0)
          .attr("dy", (d, i) => (1.25 * i) + "em")
          .text((d, i) => labels[i] + label_value_left[i]);
      let right_percent = parseFloat(this.data[this.selected_countries[0]].topic_attributes[selected_year].topics[selected_topic].attributes[selected_attribute])
      right_percent = Number.isNaN(right_percent) ? 0.0 : right_percent.toFixed(2)
      const label_value_right = [
        Object.keys(this.data[this.selected_countries[0]].religion[this.selected_year].religions)[0],
        right_percent + '%',
        selected_year
      ];
      const text_right = this.tooltip_data_right
          .selectAll("text")
          .data(labels)
          .enter()
          .append("text")
          .attr("class", "center-text")
          .style("opacity", 1);

      text_right.append("tspan")
          .attr("x", 0)
          .attr("dy", (d, i) => (1.25 * i) + "em")
          .text((d, i) => labels[i] + label_value_right[i]);
    }
  }
}
