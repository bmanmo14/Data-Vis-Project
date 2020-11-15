async function load_data() {
  return d3.csv('data/esg/CountryData.csv');
}
async function load_data2() {
  return d3.csv('data/religion/relig.csv');
}

load_data().then(d => {
  load_data2().then(d2 => {
    const country_data = new CountryData(d, d2);
    const line_graph = new LineGraph(country_data);
  });
});

