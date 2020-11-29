class ReligionGraph {
    constructor(religions, religionBuckets, religionColors) {
        this.data = religions;
        this.religionBuckets = religionBuckets;
        this.religionColors = religionColors;
        this.margin = { top: 50, right: 50, bottom: 50, left: 75 };
        this.width = 1250;
        this.height = 1200;
        this.chartHeight = 100;
        this.plotMargin = 50;
        this.xScale = d3.scaleLinear()
            .domain([YEAR_START, YEAR_END])
            .range([this.margin.left, this.width - this.margin.right]);
        this.yScale = d3.scaleLinear()
            .domain([0, 100])
            .range([this.chartHeight, 0]);
        const range = (start, stop) => Array.from({ length: (stop - start) + 1 }, (_, i) => start + i);
        this.yearRange = range(YEAR_START, YEAR_END - 1);
        this.yearCount = this.yearRange.length;
        this.barWidth = (this.width - this.margin.left - this.margin.right) / this.yearCount;
        this.barSpacing = 4;
        let that = this;
        this.metric = "mean";
        this.selectedTopic = this.selectedAttr = this.selectedYear = null;
        this.selectedCountries = ["USA", "MEX"];
        this.selectedAttrValues = [0, 0];
        this.selectedCountryReligions = ["Christian", "Christian"];
        document.getElementById("mean-radio").onclick = (e) => that.setMetric(e.target.value);
        document.getElementById("median-radio").onclick = (e) => that.setMetric(e.target.value);
        document.getElementById("mode-radio").onclick = (e) => that.setMetric(e.target.value);
        this.layout();
    }

    layout() {
        let svg = d3.select("#religion-graph")
            .append("svg")
            .attr("id", "religion-svg")
            .attr("width", this.width)
            .attr("height", this.height);

        let yOffset = this.margin.top;
        let that = this;
        this.religionBuckets.forEach(function (religionBucket) {
            that.createReligionPlot(svg, religionBucket, yOffset);
            yOffset += that.chartHeight + that.plotMargin;
        });
    }

    createReligionPlot(svg, religion, yOffset) {
        let xAxis = d3.axisBottom(this.xScale)
            .tickSize(5)
            .ticks(YEAR_END - YEAR_START + 1)
            .tickFormat(d => (d % 5 == 0) ? d : "");
        svg.append("g")
            .style("font-size", "12px")
            .attr("transform", `translate(0, ${this.chartHeight + yOffset})`)
            .call(xAxis);
        let yAxis = d3.axisLeft()
            .tickSize(5)
            .scale(this.yScale)
            .ticks(11)
            .tickFormat(d => (d % 20 == 0) ? d : "");
        svg.append("g")
            .style("font-size", "12px")
            .attr("transform", `translate(${this.margin.left}, ${yOffset})`)
            .call(yAxis);
        svg.selectAll('line')
            .style('stroke', '#606060')
            .style('stroke-width', '1.5px');
        svg.selectAll('path')
            .style('stroke', '#606060')
            .style('stroke-width', '1.5px');
        svg.append("g")
            .classed("indiv-relig-plot", true)
            .attr("id", religion)
            .attr("transform", `translate(0, ${yOffset})`);
        var text = svg.append("text")
            .text(religion)
            .style("font-family", "Helvetica")
            .style("fill", "#606060")
            .attr("font-size", "18px");
        let textBB = text.node().getBBox();
        text.attr("x", (this.width - textBB.width) / 2)
            .attr("y", yOffset + this.chartHeight + 35);
    }

    setMetric(metric) {
        // console.log(metric);
        if (this.metric != metric) {
            this.metric = metric;
            this.updateCharts();
        }
    }

    changeAttrOrYear(topic, attr, year, selectedCountryReligions, selectedAttrValues) {
        if (attr != this.selectedAttr || year != this.selectedYear) {
            [this.selectedTopic, this.selectedAttr, this.selectedYear] = [topic, attr, year];
            [this.selectedCountryReligions, this.selectedAttrValues] = [selectedCountryReligions, selectedAttrValues];
            this.updateCharts();
        }
    }

    changeSelectedCountries(selectedCountries) {
        if (!(selectedCountries[0] === this.selectedCountries[0] && 
            selectedCountries[1] === this.selectedCountries[1])) {
            this.selectedCountries = selectedCountries;
           /* this.selectedCountryReligions = selectedCountryReligions;
            this.selectedAttrValues = selectedAttrValues;
            */
            // if (this.selectedAttr && this.selectedYear) {
            //     this.updateCharts();
            // }
            this.clearCharts();
        }
    }

    getLineY(r) {
        let metricForYear = this.data[r].metrics[this.metric][this.selectedYear];
        let metric = 0;
        if ((this.selectedTopic in metricForYear) && (this.selectedAttr in metricForYear[this.selectedTopic]) &&
            (metricForYear[this.selectedTopic][this.selectedAttr] !== null)) {
            metric = metricForYear[this.selectedTopic][this.selectedAttr];
        }
        return this.chartHeight - metric;
    }

    clearCharts() {
        d3.selectAll(".indiv-relig-plot")
            .selectAll("line")
            .remove();
        d3.selectAll(".indiv-relig-plot")
            .selectAll("rect")
            .remove();
    }

    updateCharts() {
        // console.log(this.selectedTopic, this.selectedAttr, this.year);
        let that = this;
        this.clearCharts();
        let bars = d3.selectAll(".indiv-relig-plot")
            .selectAll("rect")
            .data(that.yearRange)
            .join("rect");
        bars.style("fill", function (d) {
                let relig = d3.select(this.parentNode).attr("id");
                return that.religionColors[relig];
            })
            .attr("width", (d) => that.barWidth - that.barSpacing)
            .attr("height", function (d) {
                let relig = d3.select(this.parentNode).attr("id");
                let metricForYear = that.data[relig].metrics[that.metric][d];
                if (!(that.selectedTopic in metricForYear) || !(that.selectedAttr in metricForYear[that.selectedTopic])) {
                    return 0;
                }
                return metricForYear[that.selectedTopic][that.selectedAttr];
            })
            .attr("transform", function (d, i) {
                let height = d3.select(this).attr("height");
                return `translate(${that.margin.left + (i * that.barWidth) + that.barSpacing / 2}, ${that.chartHeight - height})`;
            })
            .style("stroke", "black")
            .style("stroke-width", 1);

            let [c1, c2] = this.selectedCountries;
            let [r1, r2] = this.selectedCountryReligions.map(r => (that.religionBuckets.includes(r)) ? r : "Other");
            let yearIndex = this.yearRange.indexOf(this.selectedYear);
            let x1 = this.margin.left + (yearIndex * this.barWidth);
            let x2 = x1 + this.barWidth;
            let c1Y = this.chartHeight - this.selectedAttrValues[0];
            let c2Y = this.chartHeight - this.selectedAttrValues[1];
            d3.select("#" + r1)
                .append('line')
                .style("stroke", "black")
                .style("stroke-width", 3)
                .attr("x1", x1)
                .attr("y1", c1Y)
                .attr("x2", x2)
                .attr("y2", c1Y);
            d3.select("#" + r2)
                .append('line')
                .style("stroke", "black")
                .style("stroke-width", 3)
                .attr("x1", x1)
                .attr("y1", c2Y)
                .attr("x2", x2)
                .attr("y2", c2Y);
            // if (r1 === r2) {
                // d3.select("#" + r1)
                //     .append("rect")
                //     .style("fill", "#f2f2f2")
                //     .attr("width", 60)
                //     .attr("height", 20)
                //     .attr("transform", `translate(${x1 - ((60 - this.barWidth) / 2)}, ${0})`)
                //     .style("stroke", "black")
                //     .style("stroke-width", 1);
            // }
            // else {

            // }
    }
}
