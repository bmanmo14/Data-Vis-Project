class CountrySelection {
  constructor(data, line_graph) {
    this.data = data.countries;
    this.attributes = data.attributes;
    this.topics = data.topics;
    this.line_graph = line_graph;
    this.selected_countries = ["USA", "MEX"];

    d3.select("#dropdown-menu1")
    .html(this.data[this.selected_countries[1]].country_name)
    .on("click", d => {
      document.getElementById("dropdown1").classList.toggle("show");
    });
    d3.select("#dropdown-menu2")
    .html(this.data[this.selected_countries[0]].country_name)
    .on("click", d => {
      document.getElementById("dropdown2").classList.toggle("show");
    });

    this.margin = { top: 100, right: 50, bottom: 50, left: 75 },
      this.width = 1000 - this.margin.left - this.margin.right,
      this.height = 200 - this.margin.top - this.margin.bottom;

    this.selected_topic = null;
    this.selected_attribute = null;
    this.selected_year = null;
    this.layout();
  }

  layout() {
    var span = d3.select("#country-selection");
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

    this.group = d3.select("#dropdown1")
      .append("g")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")")
      .attr("class", "dropdown-scroll")
      .attr("overflow", "scroll");
    this.group.selectAll("a").data(Object.values(this.data))
      .join("a")
      .attr("class", "dropdown-item")
      .html(d => d.country_name)
      .on("click", d => {
        this.selected_countries[1] = d.country_code;
        this.line_graph.changeSelectedCountry(this.selected_countries);
        d3.select("#dropdown-menu1")
          .html(this.data[this.selected_countries[1]].country_name);
        document.getElementById("dropdown1").classList.toggle("show", false);
      });
    // Switch and IDK why
    d3.select("#dropdown-input1").on("keyup", d => {
      const search_value = document.getElementById("dropdown-input1").value.toLowerCase();
      this.group.selectAll("a").data(Object.values(this.data).filter(d => d.country_name.toLowerCase().includes(search_value)))
      .join("a")
      .attr("class", "dropdown-item")
      .html(d => d.country_name)
      .on("click", d => {
        this.selected_countries[1] = d.country_code;
        this.line_graph.changeSelectedCountry(this.selected_countries);
        d3.select("#dropdown-menu1")
          .html(this.data[this.selected_countries[1]].country_name);
        document.getElementById("dropdown1").classList.toggle("show", false);
      });
    });

    this.group2 = d3.select("#dropdown2")
      .append("g")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")")
      .attr("class", "dropdown-scroll")
      .attr("overflow", "scroll");
    this.group2.selectAll("a").data(Object.values(this.data))
      .join("a")
      .attr("class", "dropdown-item")
      .html(d => d.country_name)
      .on("click", d => {
        this.selected_countries[0] = d.country_code;
        this.line_graph.changeSelectedCountry(this.selected_countries);
        d3.select("#dropdown-menu2")
          .html(this.data[this.selected_countries[0]].country_name);
        document.getElementById("dropdown2").classList.toggle("show", false);
      });
    // Switch and IDK why
    d3.select("#dropdown-input2").on("keyup", d => {
      const search_value = document.getElementById("dropdown-input2").value.toLowerCase();
      this.group2.selectAll("a").data(Object.values(this.data).filter(d => d.country_name.toLowerCase().includes(search_value)))
      .join("a")
      .attr("class", "dropdown-item")
      .html(d => d.country_name)
      .on("click", d => {
        this.selected_countries[0] = d.country_code;
        this.line_graph.changeSelectedCountry(this.selected_countries);
        d3.select("#dropdown-menu2")
          .html(this.data[this.selected_countries[0]].country_name);
        document.getElementById("dropdown2").classList.toggle("show", false);
      });
    });
  }
}
