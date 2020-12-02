class Help {
    constructor() {
        let mainDiv = d3.select("body").append("div");
        this.whiteDiv = mainDiv.append("div")
            .attr("id", "help-div-screen");
        this.helpDiv = mainDiv.append("div")
            .attr("id", "help-div-content");
        let that = this;
        document.getElementById("help-button").onclick = e => that.activateStory();
        document.getElementById("help-div-content").onclick = e => that.deactivateStory();
    }

    activateStory() {
        this.whiteDiv.style("display", "block");
        this.helpDiv.style("display", "block");
        let countryBoxHeight = 150;
        let countryBoxWidth = 200;
        let rightSpace = 50;
        let countryTable = document.getElementById("parent-table");
        let bodyRect = document.body.getBoundingClientRect();
        let countryTableRect = countryTable.getBoundingClientRect();
        let countryTableOffsetY = countryTableRect.top - bodyRect.top + (countryTableRect.height - countryBoxHeight) / 2;
        let countryTableOffsetX = countryTableRect.left + bodyRect.left + countryTableRect.width + rightSpace;
        let helpSvg = this.helpDiv.append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .append("g");
        helpSvg.append("g")
            .append("rect")
            .style("stroke", "black")
            .style("stroke-opacity", ".7")
            .style("stroke-width", 2)
            .attr('fill', "white")
            .attr('height', countryBoxHeight)
            .attr('width', countryBoxWidth)
            .attr('x', countryTableOffsetX)
            .attr('y', countryTableOffsetY);

        let countryText = "The selected countries will appear here. For each religion, the number of \
        years (from 1978 - 2017) each country had a leader who prescribed to that religion is indicated\
        to the right."
        helpSvg.append("g")
            .append("text")
            .classed("help-text", true)
            .text("stuff about things")
            .attr("x", countryTableOffsetX + countryBoxWidth / 2)
            .attr("y", countryTableOffsetY + countryBoxHeight / 2);
        helpSvg.append("g")
            .append("line")
            .style("stroke", "black")
            .style("stroke-opacity", ".7")
            .style("stroke-width", 2)
            .attr("x1", countryTableOffsetX - rightSpace)
            .attr("x2", countryTableOffsetX)
            .attr("y1", countryTableOffsetY + countryBoxHeight / 2)
            .attr("y2", countryTableOffsetY + countryBoxHeight / 2);
        helpSvg
            .append("g")
            .style("left", (1000) + "px")
            .style("top", (600) + "px")
            // .attr("transform", `translate(${countryTableOffsetX + countryBoxWidth / 2}, ${countryTableOffsetY + countryBoxHeight / 2})`)
            .html("boner");
        console.log("activate");
    }
    deactivateStory() {
        this.whiteDiv.style("display", "none");
        this.helpDiv.style("display", "none");
        this.helpDiv.select("svg")
            .remove();
        console.log("deactivate");
    }
}
