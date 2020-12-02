class Help {
    constructor() {
        let mainDiv = d3.select("body").append("div");
        this.whiteDiv = mainDiv.append("div")
            .attr("id", "help-div-screen");
        this.helpDiv = mainDiv.append("div")
            .attr("id", "help-div-content");
        let that = this;
        this.fontInfo = ["18", "Helvetica"];
        document.getElementById("help-button").onclick = e => that.activateStory();
        document.getElementById("help-div-content").onclick = e => that.deactivateStory();
        document.getElementById("help-div-screen").onclick = e => that.deactivateStory();
        window.addEventListener('resize', e => that.deactivateStory());
        this.helpSvg = this.helpDiv.append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .append("g");
        this.rightSpace = 50;
        this.helpData = this.makeHelpData();
    }

    makeHelpData() {
        let helpData = {};
        helpData["country_info"] = {
            boxWidth : 220,
            boxHeight : 195,
            text : "The selected countries will appear here. For each religion, the number of years (from 1978 - 2017) each country had a leader who prescribed to that religion is indicated to the right.",
            pageElement: "parent-table",
            leftShift : 0,
        };
        helpData["topic_attr_info"] = {
            boxWidth: 220,
            boxHeight: 105,
            text: "The selected attribute will be described here. Its topic will also be displayed.",
            pageElement: "topic-svg",
            leftShift : 22,
        };
        helpData["tooltip_info"] = {
            boxWidth: 230,
            boxHeight: 148,
            text: "For the selected attribute, these boxes indicate each country leader's religious affiliation (as well as the attribute value) in the selected year.",
            pageElement: "tooltip-svg",
            leftShift : 22,
        };
        helpData["line_info"] = {
            boxWidth: 230,
            boxHeight: 435,
            text: "This is the main interaction area. The left and right line plots illustrate the attribute values as they change throughout time (1978 - 2017) for the selected countries. Users can click a line on either side and both plots will 'focus' on the selected year/attribute. The user can also drag their cursor from the left to right and the page will update to reflect the change. Lastly, to narrow the attributes in the plot, the user can select individual topics.",
            pageElement: "line-svg",
            leftShift : 115,
        };
        helpData["relig_info"] = {
            boxWidth: 230,
            boxHeight: 420,
            text: "This area is not interactive. It simply reflects the changes made from above. For the selected topic/attribute, metrics are caculated over every country who has a leader that ascribes to the religion represented by the histograms for a given year. The selectable metrics are 'mean', 'median', and 'mode'. Additionally, the selected countries' attribute values are pointed out in their respective religion histograms.",
            pageElement: "religion-svg",
            leftShift: 75,
        };
        return helpData;
    }

    // text measuring function partially taken from the web at: 
    // https://stackoverflow.com/questions/29031659/calculate-width-of-text-before-drawing-the-text
    getWidth(text) {
        var canvas = document.createElement('canvas'),
        context = canvas.getContext('2d');
        let [fontSize, fontFace] = this.fontInfo;
        context.font = fontSize + 'px ' + fontFace;
        return context.measureText(text).width;
    }

    getTextSplits(text, max_width, splits) {
        let prevSplitIdx = splits[splits.length - 1];        
        let [width, splitIdx] = [this.getWidth(text), text.length];
        if (width == 0) {
            return;
        }
        while (width > max_width && splitIdx + prevSplitIdx > prevSplitIdx) {
            splitIdx--;
            splitIdx = text.lastIndexOf(" ", splitIdx);
            width = this.getWidth(text.substring(0, splitIdx));
        }
        splits.push(prevSplitIdx + splitIdx + 1)
        this.getTextSplits(text.substring(splitIdx + 1), max_width, splits);
    }

    getTextSegments(text, boxWidth) {
        let splits = [0];
        this.getTextSplits(text, boxWidth, splits);
        let segments = [];
        for (var i = 0; i < splits.length - 1; i++) {
            segments.push(text.substring(splits[i], splits[i + 1]));
        }
        return segments;
    }

    createHelpBox(data) {
        let pageElement = document.getElementById(data.pageElement);
        let bodyRect = document.body.getBoundingClientRect();
        let pageElementRect = pageElement.getBoundingClientRect();
        let pageElementOffsetY = pageElementRect.top - bodyRect.top + (pageElementRect.height - data.boxHeight) / 2;
        let pageElementOffsetX = pageElementRect.left + bodyRect.left + pageElementRect.width + this.rightSpace - data.leftShift;
        this.helpSvg.append("g")
            .append("rect")
            .style("stroke", "black")
            .style("stroke-opacity", ".7")
            .style("stroke-width", 2)
            .attr('fill', "white")
            .attr('height', data.boxHeight)
            .attr('width', data.boxWidth)
            .attr('x', pageElementOffsetX)
            .attr('y', pageElementOffsetY);

        let segments = this.getTextSegments(data.text, data.boxWidth - 17);
        this.helpSvg.append("g")
            .attr("transform", `translate(${pageElementOffsetX + 10}, ${pageElementOffsetY})`)
            .selectAll("text")
            .data(segments)
            .join("text")
            .classed("help-text", true)
            .text(d => d)
            .attr("x", 0)
            .attr("y", (d, i) => `${(i + 1) * 1.25}em`);
        this.helpSvg.append("g")
            .append("line")
            .style("stroke", "black")
            .style("stroke-opacity", ".7")
            .style("stroke-width", 2)
            .attr("x1", pageElementOffsetX - this.rightSpace)
            .attr("x2", pageElementOffsetX)
            .attr("y1", pageElementOffsetY + data.boxHeight / 2)
            .attr("y2", pageElementOffsetY + data.boxHeight / 2);
    }

    activateStory() {
        this.whiteDiv.style("display", "block");
        this.helpDiv.style("display", "block");
        for (var data of Object.values(this.helpData)) {
            this.createHelpBox(data);
        }
    }
    deactivateStory() {
        this.whiteDiv.style("display", "none");
        this.helpDiv.style("display", "none");
        this.helpSvg.selectAll("*").remove();
    }
}
