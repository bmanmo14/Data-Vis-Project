class ReligionGraph {
    constructor(religions, religionBuckets) {
        this.data = religions;
        this.religionBuckets = religionBuckets;
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
        document.getElementById("mean-radio").onclick = (e) => that.setMetric(e.target.value);
        document.getElementById("median-radio").onclick = (e) => that.setMetric(e.target.value); 
        this.layout();
    }

    layout() {
        // var text = svg.append("text")
        //     .text("Global Attribute Metrics per Religion")
        //     // .attr("font-family", "sans-serif")
        //     .attr("font-size", "40px");
        //     // .attr("fill", "red");
        // let textBB = text.node().getBBox();
        // text.attr("x", (this.width - textBB.width) / 2)
        //     .attr("y", textBB.height);
        let svg = d3.select("#religion-graph")
            .append("svg")
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
    }

    setMetric(metric) {
        console.log(metric);
    }
}
