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


