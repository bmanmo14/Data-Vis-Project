class ReligionGraph {
    constructor(religions, religionBuckets) {
        this.data = religions;
        this.religionBuckets = religionBuckets;
        this.margin = { top: 50, right: 50, bottom: 50, left: 75 };
        this.width = 1000;
        this.height = 750;
        this.chartHeight = 150;
        this.xScale = d3.scaleLinear()
            .domain([YEAR_START, YEAR_END])
            .range([this.margin.left, this.width - this.margin.right]);
        this.yScale = d3.scaleLinear()
            .domain([0, 100])
            .range([this.chartHeight + this.margin.top, this.margin.top]);
        let that = this;
        this.metric = "mean";
        document.getElementById("mean-radio").onclick = (e) => that.setMetric(e.target.value);
        document.getElementById("median-radio").onclick = (e) => that.setMetric(e.target.value); 
        this.layout();
    }

    layout() {
        let svg = d3.select("#religion-graph")
            .append("svg")
            .attr("width", this.width)
            .attr("height", this.height);
        // var text = svg.append("text")
        //     .text("Global Attribute Metrics per Religion")
        //     // .attr("font-family", "sans-serif")
        //     .attr("font-size", "40px");
        //     // .attr("fill", "red");
        // let textBB = text.node().getBBox();
        // text.attr("x", (this.width - textBB.width) / 2)
        //     .attr("y", textBB.height);

        let xAxis = d3.axisBottom(this.xScale)
            .ticks(YEAR_END - YEAR_START + 1)
            .tickFormat(d => (d % 5 == 0) ? d : "");
        svg.append("g")
            .attr("transform", `translate(0, ${this.chartHeight + this.margin.top})`)
            .call(xAxis);


        let yAxis = d3.axisLeft()
            .scale(this.yScale)
            .ticks(11)
            .tickFormat(d => d);
        svg.append("g")
            .attr("transform", `translate(${this.margin.left}, 0)`)
            .call(yAxis);

    }

    setMetric(metric) {
        console.log(metric);
    }
}
