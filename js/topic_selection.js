class TopicSelection {
  constructor(line_graph, topics) {
    this.line_graph = line_graph;
    this.topics = topics;
    this.previously_selected = "option0";
    const that = this;
    this.buttons = d3.selectAll(".btn-secondary")
      .on("click", function (d, i) {
        document.getElementById(that.previously_selected).parentNode.classList.toggle("active");
        that.previously_selected = "option" + i;
        document.getElementById(that.previously_selected).parentNode.classList.toggle("active");
        if(topics[i] == "All") {
          that.line_graph.changeSelectedTopic(null);
          that.line_graph.selected_attribute = "";
          return;
        }
        that.line_graph.circles.transition()
          .duration('50')
          .style("opacity", 0);
        that.line_graph.changeSelectedTopic(topics[i-1]);
        that.line_graph.selected_attribute ="";
      });
  }
}
