class DataOrchestrator {
  /**
   * Contains datastructors that house country and religion data.
   *
   * @param country_data
   * @param religion_data
   */
  constructor(country_data, religion_data) {
    // Main Structures that hold Country and Religion data
    this.countries = {};
    this.religions = {};
    this.religionBuckets = ["Christian", "Muslim", "New Age", "Hindu", "Buddhist", "Other"]
    this.topics = [];
    this.attributes = [];
    this.topicAttributeRelationships = {};

    this.country_religions = {};

    this.createReligionTemplate(religion_data);
    this.createCountryAndReligionData(country_data);
    this.calculateReligionMetrics()
  }

  getReligionBucket(religion) {
    if (this.religionBuckets.includes(religion)) {
      return religion;
    }
    else {
      return "Other";
    }
  }

  createReligionTemplate(religion_data) {
    for (var i = 0; i < religion_data.length; i++) {
      var row = religion_data[i];
      const year = row[RELIGION_YEAR];
      if (year < YEAR_START || year > YEAR_END) continue;
      const religion = row[RELIGION];
      const parent_religion = row[RELIGION_PARENT];
      const country_code = row[RELIGION_COUNTRY_CODE];

      if (!(country_code in this.country_religions)) {
        this.country_religions[country_code] = {}
      }

      this.country_religions[country_code][year] = new Religion(parent_religion);
      this.country_religions[country_code][year].setReligion(religion);
      let religion_bucket = this.getReligionBucket(parent_religion);
      if (!(religion_bucket in this.religions)) {
        this.religions[religion_bucket] = new Religion(parent_religion);
      }
      this.religions[religion_bucket].setReligion(religion);
    }
  }

  createCountryAndReligionData(country_data) {
    for(var i = 0; i < country_data.length; i++) {
      const row = country_data[i];
      const country_code = row[COUNTRY_CODE];
      const country_name = row[COUNTRY_NAME];
      const topic = this.createTopic(row[TOPIC]);
      const attribute_name = row[ATTRIBUTE_NAME].split(" (")[0];
      if(!(this.attributes.includes(attribute_name))) {
        this.attributes.push(attribute_name);
        this.topicAttributeRelationships[topic].push(attribute_name);
      }
      const attribute_definition = row[DEFINITION];

      if(!(country_code in this.countries)) {
        this.countries[country_code] = new Country(country_code, country_name)
      }

      for(var y = YEAR_START; y <= YEAR_END; y++) {
        const attribute_value = row[y];
        const country = this.countries[country_code];
        country.setYearTopicAttribute(y, topic, attribute_name, attribute_value, attribute_definition);
        country.setReligion(this.country_religions[country_code][y], y);
        if(y in this.country_religions[country_code]){
          let parent_religion = this.country_religions[country_code][y].parent_religion;
          this.religions[this.getReligionBucket(parent_religion)].setYearTopic(y, country.getYearTopicAttribute(y));
        }
      }
    }
  }

  createTopic(t) {
    var topic = t.split(":")[0];
    if (["Economic Policy & Debt", "Infrastructure", "Poverty"].includes(topic)) {
      topic = "Economics and Infrastructure";
    } else if (topic == "Gender") {
      topic = "Education";
    }
    if (!(this.topics.includes(topic))) {
      this.topics.push(topic);
      this.topicAttributeRelationships[topic] = [];
    }
    return topic;
  }

  calculateReligionMetrics() {
    // this.religions.forEach((value, key, map) => value.calculateMetrics());
    Object.values(this.religions).forEach(relig => {
      relig.calculateMetrics(this.topicAttributeRelationships);
    });
  }
}

class TopicAttribute {
  /**
   * Creates the TopicAttribute Object for a specific country and year
   *  - TopicAttribute
   *    - Topic
   *    - Attributes: Dict
   *    - Attribute Definitions: Dict
   *
   * @param topic
   */
  constructor(topic) {
    this.topic = topic;
    this.attributes = {};
    this.attribute_definition = {};
  }

  setAttribute(attribute_name, attribute_value, attribute_definition) {
    this.attributes[attribute_name] = attribute_value;
    this.attribute_definition[attribute_name] = attribute_definition;
  }
}

class Year {
  /**
   * Creates the Year Object for a specific Country's year.
   *  - Year
   *    - Religion: Religion class
   *    - Topic: TopicAttribute class
   *
   * @param year
   */
  constructor(year) {
    this.year = year;
    this.topics = {};
  }

  setTopicAttribute(topic, attribute_name, attribute_value, attribute_definition) {
    if (!(topic in this.topics)) {
      this.topics[topic] = new TopicAttribute(topic);
    }
    this.topics[topic].setAttribute(attribute_name, attribute_value, attribute_definition);
  }

  setReligion(religion) {
    this.religion = religion;
  }
}
