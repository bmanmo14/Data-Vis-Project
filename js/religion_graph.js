class ReligionGraph {
    constructor(religions, religionBuckets, religionColors) {
        this.data = religions;
        this.religionBuckets = religionBuckets;
        this.religionColors = religionColors;
        this.margin = { top: 50, right: 80, bottom: 50, left: 100 };
        this.width = 1350;
        this.height = 1200;
        this.chartHeight = 100;
        this.plotMargin = 50;
        this.xScale = d3.scaleLinear()
            .domain([YEAR_START, YEAR_END - 1])
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

    swap(thisC, thatC, inW) {
        return inW.replace(thatC, thisC);
    }

    addWhitespace(word) {
        return word.replace(' ', '_')
    }

    createReligionPlot(svg, religion, yOffset) {
        let xAxis = d3.axisBottom(this.xScale)
            .tickSize(5)
            .ticks(YEAR_END - 1 - YEAR_START)
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
            .attr("id", this.swap('_', ' ', religion))
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
        if (this.metric != metric) {
            this.metric = metric;
            this.updateCharts();
        }
    }

    changeAttrOrYear(topic, attr, year, selectedCountryReligions, selectedAttrValues) {
        console.log(topic, this.selectedTopic);
        if (topic !== this.selectedTopic  || attr === "") {
            this.selectedTopic = topic;
            this.clearCharts();
        }
        else if (attr !== this.selectedAttr || year !== this.selectedYear) {
            [this.selectedTopic, this.selectedAttr, this.selectedYear] = [topic, attr, year];
            [this.selectedCountryReligions, this.selectedAttrValues] = [selectedCountryReligions, selectedAttrValues];
            this.updateCharts();
        }
    }

    changeSelectedCountries(selectedCountries) {
        if (!(selectedCountries[0] === this.selectedCountries[0] &&
            selectedCountries[1] === this.selectedCountries[1])) {
            this.selectedCountries = selectedCountries;
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
        let religPlots = d3.selectAll(".indiv-relig-plot");
        religPlots.selectAll("line")
            .remove();
        religPlots.selectAll("rect")
            .remove();
        religPlots.selectAll(".religion-country-label")
            .remove();
    }

    drawCountryIndicatorText(c, v, rectWidth, rectHeight, rLabelG) {
        rLabelG.append("rect")
            .style("fill", "E9E9E9")
            .style("opacity", ".7")
            .attr("width", rectWidth)
            .attr("height", rectHeight)
            .style("stroke", "black")
            .style("stroke-width", 0);
        let rTextCountry = rLabelG.append("text")
            .text(`${c}@`);
        let rTextValue = rLabelG.append("text")
            .text(`${v} \%`);
        rLabelG.selectAll("text")
            .style("font-family", "Helvetica")
            .style("fill", "#555555")
            .attr("font-size", "20px");
        let rTextCountryBBox = rTextCountry.node().getBBox();
        let rTextValueBBox = rTextValue.node().getBBox();
        let centerDist = 3;
        rTextCountry.attr("x", rectWidth / 2 - rTextCountryBBox.width / 2)
            .attr("y", rectHeight / 2 - centerDist);
        rTextValue.attr("x", rectWidth / 2 - rTextValueBBox.width / 2)
            .attr("y", rectHeight / 2 + rTextValueBBox.height * .75 + centerDist);
    }

    drawCountryIndicators() {
        let that = this;
        let [c1, c2] = this.selectedCountries;
        let [r1, r2] = this.selectedCountryReligions.map(r => (that.religionBuckets.includes(r)) ? r : "Other");
        let yearIndex = this.yearRange.indexOf(this.selectedYear);
        let x1 = this.margin.left + (yearIndex * this.barWidth);
        let x2 = x1 + this.barWidth;
        let c1Y = this.chartHeight - this.selectedAttrValues[0];
        let c2Y = this.chartHeight - this.selectedAttrValues[1];
        let r1G = d3.select("#" + this.swap('_', ' ', r1));
        let r2G = d3.select("#" + this.swap('_', ' ', r2));
        r1G.append('line')
            .style("stroke", "#989898")
            .style("stroke-dasharray","4,4")
            .style("stroke-width", 3)
            .attr("x1", x1)
            .attr("y1", c1Y)
            .attr("x2", x2)
            .attr("y2", c1Y);
        r2G.append('line')
            .style("stroke", "#989898")
            .style("stroke-dasharray","4,4")
            .style("stroke-width", 3)
            .attr("x1", x1)
            .attr("y1", c2Y)
            .attr("x2", x2)
            .attr("y2", c2Y);

        let lineRectDist = 0;
        let rectWidth = 80;
        let rectHeight = 50;

        let r1LabelG = r1G.append("g")
            .classed("religion-country-label", true)
            .attr("transform", `translate(${x2 + lineRectDist}, ${c1Y - rectHeight / 2})`);
        let c1Val = String(Number(this.selectedAttrValues[0]).toFixed(1));
        this.drawCountryIndicatorText(c1, c1Val, rectWidth, rectHeight, r1LabelG);
        let r2LabelG = r2G.append("g")
            .classed("religion-country-label", true)
            .attr("transform", `translate(${x1 - lineRectDist - rectWidth}, ${c2Y - rectHeight / 2})`);
        let c2Val = String(Number(this.selectedAttrValues[1]).toFixed(1));
        this.drawCountryIndicatorText(c2, c2Val, rectWidth, rectHeight, r2LabelG);
    }

    updateCharts() {
        let that = this;
        this.clearCharts();
        let bars = d3.selectAll(".indiv-relig-plot")
            .selectAll("rect")
            .data(that.yearRange)
            .join("rect");
        bars.style("fill", function (d) {
                let relig = that.swap(' ', '_', d3.select(this.parentNode).attr("id"));
                return that.religionColors[relig];
            })
            .attr("width", (d) => that.barWidth - that.barSpacing)
            .attr("height", function (d) {
                let relig = that.swap(' ', '_', d3.select(this.parentNode).attr("id"));
                let metricForYear = that.data[relig].metrics[that.metric][d];
                if (!(that.selectedTopic in metricForYear) || !(that.selectedAttr in metricForYear[that.selectedTopic])) {
                    return 0;
                }
                return metricForYear[that.selectedTopic][that.selectedAttr];
            })
            .attr("transform", function (d, i) {
                let height = d3.select(this).attr("height");
                return `translate(${that.margin.left + (i * that.barWidth) + that.barSpacing / 2}, ${that.chartHeight - height})`;
            });

            this.drawCountryIndicators();
    }
}
