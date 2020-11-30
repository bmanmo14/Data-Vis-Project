class CountrySelection {
    constructor(data, line_graph, religion_color) {
        this.data = data.countries;
        this.religions = data.religions;
        this.attributes = data.attributes;
        this.topics = data.topics;
        this.line_graph = line_graph;
        this.selected_countries = ["USA", "MEX"];
        this.religion_color = religion_color;
        this.religion_year_counts = {};

        this.calcCountryReligionCounts(this.selected_countries[0]);
        this.calcCountryReligionCounts(this.selected_countries[1]);

        this.scaleX = d3.scaleLinear()
            .domain([0, 40])
            .range([0, 250]);

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

        this.margin = {top: 100, right: 50, bottom: 50, left: 75},
            this.width = 1000 - this.margin.left - this.margin.right,
            this.height = 200 - this.margin.top - this.margin.bottom;

        this.selected_topic = null;
        this.selected_attribute = null;
        this.selected_year = null;
        this.layout();
    }

    layout() {

        // draws a parent table to encase the two year count tables for each of the two selected countries
        var parentTable = d3.select("#country-selection")
            .append('table')
            .attr('id', 'parent-table')
            .append('tr');
        // this.svg = span
        // .append("svg")
        // .attr("width", this.width + this.margin.left + this.margin.right)
        // .attr("height", this.height + this.margin.top + this.margin.bottom);

        let tableOne = parentTable.append('td').append("table");
        let tableOneHeader = tableOne.attr("id", "religion-year-count-one")
            .classed('religion-year-count', true)
            .append('thead');

        let tableOneHeaderRowOne = tableOneHeader.append('tr');
        tableOneHeaderRowOne.append('td')
            .append('img')
        tableOneHeaderRowOne.append('th')

        let tableOneHeaderRowTwo = tableOneHeader.append('tr');
        tableOneHeaderRowTwo.append('td');
        tableOneHeaderRowTwo.append('td')
            .classed('year-count-legend', true);


        tableOne.append('tbody')
            .attr("id", "religion-year-count-body-one");

      let tableTwo = parentTable.append('td').append("table");
      let tableTwoHeader = tableTwo.attr("id", "religion-year-count-two")
            .classed('religion-year-count', true)
            .append('thead');

      let tableTwoHeaderRowOne = tableTwoHeader.append('tr')
        tableTwoHeaderRowOne.append('td')
            .append('img')
        tableTwoHeaderRowOne.append('th')

        let tableTwoHeaderRowTwo = tableTwoHeader.append('tr');
        tableTwoHeaderRowTwo.append('td');
        tableTwoHeaderRowTwo.append('td')
            .classed('year-count-legend', true);

        tableTwo.append('tbody')
            .attr("id", "religion-year-count-body-two");

        this.hover = d3.select("body")
            .append("div")
            .attr("class", "hover")
            .style("opacity", 0);

        this.drawYearCountLegend();

        this.drawReligionYearTable(0);
        this.drawReligionYearTable(1);

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
                delete this.religion_year_counts[this.selected_countries[1]];
                this.selected_countries[1] = d.country_code;
                this.line_graph.changeSelectedCountry(this.selected_countries);
                this.calcCountryReligionCounts(d.country_code);
                this.drawReligionYearTable(1);
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
                    delete this.religion_year_counts[this.selected_countries[1]];
                    this.selected_countries[1] = d.country_code;
                    this.line_graph.changeSelectedCountry(this.selected_countries);
                    this.calcCountryReligionCounts(d.country_code);
                    this.drawReligionYearTable(1);
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
                delete this.religion_year_counts[this.selected_countries[0]];
                this.selected_countries[0] = d.country_code;
                this.line_graph.changeSelectedCountry(this.selected_countries);
                this.calcCountryReligionCounts(d.country_code);
                this.drawReligionYearTable(0);
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
                    delete this.religion_year_counts[this.selected_countries[0]];
                    this.selected_countries[0] = d.country_code;
                    this.line_graph.changeSelectedCountry(d.country_code);
                    this.calcCountryReligionCounts(0);
                    this.drawReligionYearTable(0);
                    d3.select("#dropdown-menu2")
                        .html(this.data[this.selected_countries[0]].country_name);
                    document.getElementById("dropdown2").classList.toggle("show", false);
                });
        });
    }

    /**
     * Draws the table for the selected country showing
     * the religion count over 40 years.
     *
     * @param selectedIndex - the index 0 or 1 for selected country
     */
    drawReligionYearTable(selectedIndex) {

        let country = this.data[this.selected_countries[selectedIndex]];
        let country_name = country.country_name.toLowerCase().replaceAll(' ', '-');

        let data = this.religion_year_counts[this.selected_countries[selectedIndex]];
        let tableId = selectedIndex === 0 ? '#religion-year-count-two' : '#religion-year-count-one';
        let tableBodyId = selectedIndex === 0 ? '#religion-year-count-body-two' : '#religion-year-count-body-one';

        //update header
        d3.select(tableId).select('thead').select('tr').select('th')
            .text(this.data[this.selected_countries[selectedIndex]].country_name);

        //update flag image
        d3.select(tableId).select('thead').select('tr').select('img')
            .attr('src', 'countrys-flags/svg/' + country_name + '.svg');

        // draw body
        let rowSelection = d3.select(tableBodyId)
            .selectAll('tr')
            .data(data)
            .join('tr');
        let dataSelection = rowSelection.selectAll('td')
            .data(this.rowToCellDataTransform)
            .join('td')

        let religionNameSelection = dataSelection.filter(d => d.type == 'religion_name');
        religionNameSelection.text(d => d.value);

        let religionCountSelection = dataSelection.filter(d => d.type == 'religion_count');
        let svgSelect = religionCountSelection.selectAll('svg')
            .data(d => [d])
            .join('svg')
            .attr('width', 260)
            .attr('height', 15);

        //clear any existing rects
        svgSelect.selectAll('g').remove();

        let grouperSelect = svgSelect.append('g')
            .data(d => [d]);

        this.addYearCountRect(grouperSelect);
    }

    drawYearCountLegend() {
        let yearCountAxisData = [0, 20, 40];
        let yearCountLegend = d3.selectAll('.year-count-legend')
            .append('svg')
            .attr('width', 260)
            .attr('height', 15);
        let yearCountGroup = yearCountLegend.append('g');
        yearCountGroup.selectAll('text')
            .data(yearCountAxisData)
            .join('text')
            .text(d => Math.abs(d))
            .classed('axis-label', true)
            .attr('font-size', '10px')
            .attr('x', d => this.scaleX(d) + 3)
            .attr('y', 9);
        yearCountGroup.selectAll('line')
            .data(yearCountAxisData)
            .join('line')
            .style("stroke", "black")
            .style("stroke-width", 1)
            .attr('x1', d => this.scaleX(d) + 3)
            .attr("y1", 11)
            .attr('x2', d => this.scaleX(d) + 3)
            .attr("y2", 16);
    }

    /**
     * Method for drawing year count rects
     *
     *
     * @param - containerSelect - the group to add to
     */
    addYearCountRect(containerSelect) {

        let bars = containerSelect.selectAll('svg')
            .data(d => [d])
            .enter();

        bars.append('rect')
            .transition()
            .duration(1000)
            .attr('class', d => d.name)
            .attr('fill', d => this.religion_color[d.name])
            .attr('height', 15)
            .attr('width', d => this.scaleX(d.value))
            .attr('x', 3)
            .attr('y', 0);
    }

    /**
     * Transforms data in religion year counts to usable
     * data in tables
     *
     * @param d - religion year count for that country.
     */
    rowToCellDataTransform(d) {
        let religion_name = {
            type: 'religion_name',
            value: d.name === "" ? "Other" : d.name,
        };
        let religion_count = {
            type: 'religion_count',
            name:  d.name === "" ? "Other" : d.name,
            value: d.count,
        };
        let data_list = [religion_name, religion_count];
        return data_list;
    }

    /**
     * Calculates the religion count for the 40 years span
     * for a selected country
     *
     * @param country_code - Country code of a selected country
     */
    calcCountryReligionCounts(country_code) {
        let years = Object.values(this.data[country_code].religion);
        let religion_counts = [{"name": "Christian", "count": 0}, {"name": "Muslim", "count": 0},
            {"name": "New Age", "count": 0}, {"name": "Hindu", "count": 0}, {"name": "Buddhist", "count": 0},
            {"name": "", "count": 0}];

        years.forEach(year => {
            // check if year is undefined and add to "other" count
            if (year === undefined) {
                let religion = religion_counts.find(r => r.name === "");
                religion.count = religion.count + 1;
            } else {
                let religion = religion_counts.find(r => r.name === year.parent_religion);
                // check if parent religion is our list, if not add to "other" count
                if(religion === undefined) {
                    let religion = religion_counts.find(r => r.name === "");
                    religion.count = religion.count + 1;
                }
                else {
                    religion.count = religion.count + 1;
                }
            }
        });
        this.religion_year_counts[country_code] = religion_counts;
    }


}
