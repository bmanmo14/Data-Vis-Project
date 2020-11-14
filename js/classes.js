const COUNTRY_NAME = "CountryName";
const COUNTRY_CODE = "CountryCode";
const SERIES_CODE = "SeriesCode";
const ATTRIBUTE_NAME = "Indicator Name";
const YEAR_START = 1960;
const YEAR_END = 2019;
const TOPIC = "Topic";
const DEFINITION = "Definition";

class ReligionData {
  /**
   * Creates the ReligionData Object for a specific religion
   *  - Religion
   *    - Religion Object
   *    - TopicData {Dict of Topics}
   *    - Year
   *
   * @param religion
   * @param year
   */
  constructor(religion, year) {
    this.religion = religion;
    this.topics = {}
    this.religion = "";
    this.year = year
  }

}

class Topic {
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
   *    - Religion Object
   *    - Topic {Dict of Topics}
   *
   * @param year
   */
  constructor(year) {
    this.year = year;
    this.topics = {}
    this.religion = "";
  }

  setTopicAttribute(topic, attribute_name, attribute_value, attribute_definition) {
    if(!(topic in this.topics)) {
      this.topics[topic] = new Topic(topic);
    }
    this.topics[topic].setAttribute(attribute_name, attribute_value, attribute_definition);
  }

}

class Country {
  constructor(country_code, country_name){
    this.country_code = country_code;
    this.country_name = country_name;
    this.years = {}
  }

  setYearTopicAttribute(year, topic, attribute_name, attribute_value, attribute_definition) {
    if(!(year in this.years)) {
      this.years[year] = new Year(year);
    }
    this.years[year].setTopicAttribute(topic, attribute_name, attribute_value, attribute_definition)
  }

}

class CountryData {
  /**
   * Creates the CountryData Object from CountryData.csv
   * The class should look something like:
   * - Country
   *  - Year
   *    - Religion Object
   *    - Topic (Dictionary or Class)
   *      - Attributes (Vector)
   *
   * @param data the full CountryData dataset
   */

  constructor(data) {
    this.countries = {};
    for(var i = 0; i < data.length; i++) {
      var row = data[i];
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
        this.countries[country_code].setYearTopicAttribute(y, topic, attribute_name, attribute_value, attribute_definition)
      }
    }
    console.log(this.countries);
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

}
