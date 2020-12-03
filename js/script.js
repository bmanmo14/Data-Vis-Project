Promise.all([d3.csv('data/esg/CountryData.csv'), d3.csv('data/religion/relig.csv')])
  .then(([countries, religions]) => {
    var colorScale = [
      // Green
      "#00ce9b",
      // Orange
      "#ff8757",
      // Blue
      "#4e8cd3",
      // Purple
      "#b96dc9",
      // Light Green
      "#70e412",
      // Dark Gray
      "#303030",
    ];
    const country_data = new DataOrchestrator(countries, religions);
    var religion_color = {};
    for(var i in country_data.religionBuckets) {
      religion_color[country_data.religionBuckets[i]] = colorScale[i];
    }
    const religion_graph = new ReligionGraph(country_data.religions, country_data.religionBuckets, religion_color);
    const tooltip = new Tooltip(country_data);
    const line_graph = new LineGraph(country_data, religion_color, religion_graph, tooltip);
    const topic_selection = new TopicSelection(line_graph, country_data.topics);
    const country_selection = new CountrySelection(country_data, line_graph, religion_color);
    const help = new Help();
});

