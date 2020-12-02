class Help {
    constructor() {
        // this.data = data;
        this.helpDiv = d3.select("body").append("div")
            .attr("id", "help-div");
        let that = this;
        document.getElementById("help-button").onclick = e => that.activateStory();
        document.getElementById("help-div").onclick = e => that.deactivateStory();
    }

    activateStory() {
        this.helpDiv.classed("help-active", true);
        console.log("activate");
    }
    deactivateStory() {
        this.helpDiv.classed("help-active", false);
        console.log("deactivate");
    }
}
