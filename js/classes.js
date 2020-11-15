class Religion {
  /**
   * Creates the ReligionData Object for a specific parent religion
   *  - Religion
   *    - Parent Religion
   *    - Religion
   *    - Year: All years for all religions
   *    - Topics: All TopicAtrributes for religion across all years
   *
   * @param parent_religion
   */
  constructor(parent_religion) {
    this.parent_religion = parent_religion;
    this.religion = [];
    this.year = {};
    this.religion_total_metric = 0;
  }

  setReligion(religion) {
    if(!(this.religion.includes(religion))){
      this.religion.push(religion);
    }

  }

  setYearTopic(year, topic) {
    if(!(year in this.year)) {
      this.year[year] = []
    }
    this.year[year].push(topic);
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
    if(!(topic in this.topics)) {
      this.topics[topic] = new TopicAttribute(topic);
    }
    this.topics[topic].setAttribute(attribute_name, attribute_value, attribute_definition);
  }

  setReligion(religion) {
    this.religion = religion;
  }

}

class Country {
  /**
   * Creates a Country and adds Religion and TopicAttribute across all years
   *  - Country
   *    - Topic
   *    - Attributes: Dict
   *    - Attribute Definitions: Dict
   *
   * @param country_code
   * @param country_name
   */
  constructor(country_code, country_name){
    this.country_code = country_code;
    this.country_name = country_name;
    this.years = {}
    this.religion = {}
  }

  setYearTopicAttribute(year, topic, attribute_name, attribute_value, attribute_definition) {
    if(!(year in this.years)) {
      this.years[year] = new Year(year);
    }
    this.years[year].setTopicAttribute(topic, attribute_name, attribute_value, attribute_definition)
  }

  getYearTopicAttribute(year) {
    return this.years[year];
  }

  setReligion(religion, year) {
    this.religion[year] = religion;
  }

}

class CountryData {
  /**
   * Creates countries and religions from the two datasets using the classes above
   *
   * @param country_data the full CountryData
   * @param religion_data the full ReligionData
   */
  constructor(country_data, religion_data) {
    // Main Structures that hold Country and Religion data
    this.countries = {};
    this.religions = {};

    this.country_religions = {};

    this.createReligionData(religion_data);
    this.createCountryData(country_data);

    console.log(this.countries);
    console.log(this.religions);
  }

  createTopic(t) {
    var topic = t.split(":")[0];
    if(["Economic Policy & Debt", "Infrastructure", "Poverty"].includes(topic)) {
      topic = "Economics and Infrastructure";
    } else if(topic == "Gender") {
      topic = "Education";
    }
    return topic;
  }

  createCountryData(country_data) {
    for(var i = 0; i < country_data.length; i++) {
      var row = country_data[i];
      const country_code = row[COUNTRY_CODE];
      const country_name = row[COUNTRY_NAME];
      const topic = this.createTopic(row[TOPIC]);
      const attribute_name = row[ATTRIBUTE_NAME].split(" (")[0];
      const attribute_definition = row[DEFINITION];

      if(!(country_code in this.countries)) {
        this.countries[country_code] = new Country(country_code, country_name)
      }

      for(var y = YEAR_START; y < YEAR_END; y++) {
        const attribute_value = row[y];
        const country = this.countries[country_code];
        country.setYearTopicAttribute(y, topic, attribute_name, attribute_value, attribute_definition);
        country.setReligion(this.country_religions[country_code], y);
        this.religions[this.country_religions[country_code].parent_religion].setYearTopic(y, country.getYearTopicAttribute(y));
      }
    }
  }

  createReligionData(religion_data) {
    for(var i = 0; i < religion_data.length; i++) {
      var row = religion_data[i];
      const year = row[RELIGION_YEAR];
      if(year < YEAR_START || year > YEAR_END) continue;
      const religion = row[RELIGION];
      const parent_religion = row[RELIGION_PARENT];
      const country_code = row[RELIGION_COUNTRY_CODE];

      if(!(country_code in this.country_religions)) {
        this.country_religions[country_code] = new Religion(parent_religion);
        this.country_religions[country_code].setReligion(religion);
      }
      if(!(parent_religion in this.religions)) {
        this.religions[parent_religion] = new Religion(parent_religion);
      }
      if(!(religion in this.religions[parent_religion].religion)) {
        this.religions[parent_religion].religion.push(religion);
      }
    }
  }

}
