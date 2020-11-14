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

class YearData {
  /**
   * Creates the YearData Object for a specific Country's year.
   *  - Year
   *    - Religion Object
   *    - TopicData {Dict of Topics}
   *
   * @param year
   */
  constructor(year) {
    this.year = year;
    this.topics = {}
    this.religion = "";
  }
}

class TopicData {
  constructor(topic) {
    this.topic = topic;
    this.attributes = {};
    this.attribute_definition = {};
  }

  setAttribute(name, value, definition) {
    this.attributes[name] = value;
    this.attribute_definition[name] = definition;
  }
}

class CountryData {
  /**
   * Creates the Country Data Object from CountryData.csv
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
    var countries = {};
    const headers = data.columns;
    for(var i = 0; i < data.length; i++) {
      var row = data[i];
      const country = row[COUNTRY_NAME];
      const topic = this.createTopic(row[TOPIC]);
      const attribute_name = row[ATTRIBUTE_NAME].split(" (")[0];
      const attribute_definition = row[DEFINITION];

      if(!(country in countries)) {
        countries[country] = {}
      }

      for(var y = YEAR_START; y < YEAR_END; y++) {
        if(!(y in countries[country])) {
          countries[country][y] = new YearData(y);
        }
        const attribute_value = row[y];
        var year = countries[country][y];
        if(!(topic in year.topics)) {
          year.topics[topic] = new TopicData(topic);
        }
        year.topics[topic].setAttribute(attribute_name, attribute_value, attribute_definition);
      }
    }
    console.log(countries);
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
