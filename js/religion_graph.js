class ReligionGraph {
    constructor(religions, religionBuckets, religionColors) {
        this.data = religions;
        this.religionBuckets = religionBuckets;
        this.religionColors = religionColors;
        this.margin = { top: 50, right: 50, bottom: 50, left: 75 };
        this.width = 1000;
        this.height = 1200;
        this.chartHeight = 100;
        this.plotMargin = 40;
        this.xScale = d3.scaleLinear()
            .domain([YEAR_START, YEAR_END])
            .range([this.margin.left, this.width - this.margin.right]);
        this.yScale = d3.scaleLinear()
            .domain([0, 100])
            .range([this.chartHeight, 0]);
        let that = this;
        this.metric = "mean";
        this.selectedTopic = null;
        this.selectedAttr = null;
        this.selectedYear = null;
        document.getElementById("mean-radio").onclick = (e) => that.setMetric(e.target.value);
        document.getElementById("median-radio").onclick = (e) => that.setMetric(e.target.value); 
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
            .ticks(YEAR_END - YEAR_START + 1)
            .tickFormat(d => (d % 5 == 0) ? d : "");
        svg.append("g")
            .attr("transform", `translate(0, ${this.chartHeight + yOffset})`)
            .call(xAxis);
        let yAxis = d3.axisLeft()
            .scale(this.yScale)
            .ticks(11)
            .tickFormat(d => (d % 20 == 0) ? d : "");
        svg.append("g")
            .attr("transform", `translate(${this.margin.left}, ${yOffset})`)
            .call(yAxis);
        svg.append("g")
            .classed("indiv-relig-plot", true)
            .attr("religion", religion)
            .attr("transform", `translate(0, ${yOffset})`);
        var text = svg.append("text")
            .text(religion)
            .attr("font-size", "15px")
            .attr("fill", "black");
        let textBB = text.node().getBBox();
        text.attr("x", (this.width - textBB.width) / 2)
            .attr("y", yOffset - 10);
    }

    setMetric(metric) {
        console.log(metric);
        if (this.metric != metric) {
            this.metric = metric;
            this.updateCharts();
        }
    }

    changeAttrOrYear(topic, attr, year) {
        if (attr != this.selectedAttr || year != this.selectedYear) {
            [this.selectedTopic, this.selectedAttr, this.year] = [topic, attr, year];
            this.updateCharts();
        }
    }

    updateCharts() {
        console.log(this.selectedTopic, this.selectedAttr, this.year);
        let that = this;
        const range = (start, stop) => Array.from({ length: (stop - start) + 1 }, (_, i) => start + i);
        let yearRange = range(YEAR_START, YEAR_END - 1);
        let yearCount = yearRange.length;
        let barWidth = (this.width - this.margin.left - this.margin.right) / yearCount;
        let bars = d3.selectAll(".indiv-relig-plot")
            .selectAll("rect")
            .data(yearRange)
            .join("rect");
        bars.style("fill", function (d) {  
                let relig = d3.select(this.parentNode).attr("religion");
                return that.religionColors[relig];
            })
            .attr("width", (d) => barWidth)
            .attr("height", function (d) {
                let relig = d3.select(this.parentNode).attr("religion");
                let metricForYear = that.data[relig].metrics[that.metric][d];
                if (!(that.selectedTopic in metricForYear) || !(that.selectedAttr in metricForYear[that.selectedTopic])) {
                    return 0;
                }
                console.log(d, that.selectedAttr, metricForYear[that.selectedTopic][that.selectedAttr]);
                return metricForYear[that.selectedTopic][that.selectedAttr];
            })
            .attr("transform", function (d, i) { 
                let height = d3.select(this).attr("height");
                return `translate(${that.margin.left + (i * barWidth)}, ${that.chartHeight - height})`;
            })
            .style("stroke", "black")
            .style("stroke-width", 1);
    }
}
