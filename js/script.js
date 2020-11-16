Promise.all([d3.csv('data/esg/CountryData.csv'), d3.csv('data/religion/relig.csv')])
  .then(([countries, religions]) => {
    const country_data = new DataOrchestrator(countries, religions);
    const country_selection = new CountrySelection(country_data);
    const line_graph = new LineGraph(country_data);
});

