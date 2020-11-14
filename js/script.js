async function load_data() {
  return d3.csv('data/esg/CountryData.csv');
}
load_data().then(data => {
  const country_data = new CountryData(data);
});
