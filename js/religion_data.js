class Religion {
  /**
   * Creates the ReligionData Object for a specific parent religion
   *  - Religion
   *    - Parent Religion
   *    - Religions
   *    - Year: All years for all religions
   *    - Topics: All TopicAtrributes for religion across all years
   *
   * @param parent_religion
   */
  constructor(parent_religion) {
    this.parent_religion = parent_religion;
    this.religions = {};
    this.years = {};
    this.metrics = {}; // metric -> year -> topic -> attribute
  }

  setCountryReligionYear(religion, year) {
    this.religions[year] = religion;
  }

  setReligion(religion) {
    if(!(religion in this.religions)){
      this.religions[religion] = 1;
    }
    else {
      this.religions[religion]++;
    }
  }

  setYearTopic(year, topic) {
    if(!(year in this.years)) {
      this.years[year] = []
    }
    if(!(this.years[year].includes(topic))) {
      this.years[year].push(topic);
    }
  }

  calculateMetrics(topicAttributeRelationships) {
    this.calculateMetric("mean", (array) => array.reduce((a, b) => a + b) / array.length, topicAttributeRelationships);
    this.calculateMetric("median", (array) => [...array].sort()[Math.floor(array.length / 2)], topicAttributeRelationships);
  }

  calculateMetric(metric_name, f, topicAttributeRelationships) {
    this.metrics[metric_name] = {};
    let mean = this.metrics[metric_name];
    let that = this;
    Object.keys(this.years).forEach(function(y) {
      mean[y] = that.createDefaults(topicAttributeRelationships);
      that.calculateMetricForYear(f, mean, y, topicAttributeRelationships);
    });
    console.log(this.parent_religion, mean);
  }

  calculateMetricForYear(f, metric, year, topicAttributeRelationships) {
    Object.keys(topicAttributeRelationships).forEach(t => {
      Object.values(topicAttributeRelationships[t]).forEach(a => {
        let attribute_vals = [];
        Object.values(this.years[year]).forEach(c => {
          let attribute_val = c.topics[t].attributes[a];
          if (attribute_val != '') {
            attribute_vals.push(Number(attribute_val));
          }
        });
        if (attribute_vals.length != 0) {
          metric[year][t][a] = f(attribute_vals);
        }
      })
    });
  }

  createDefaults(topicAttributeRelationships) {
    let religionYearMetrics = {};
    Object.keys(topicAttributeRelationships).forEach(t => {
      religionYearMetrics[t] = {}
      Object.values(topicAttributeRelationships[t]).forEach(a => {
        religionYearMetrics[t][a] = null;
      })
    });
    return religionYearMetrics;
  }
}
