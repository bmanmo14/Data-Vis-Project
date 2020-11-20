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
    this.topic_attributes = {}
    this.religion = {}
  }

  setYearTopicAttribute(year, topic, attribute_name, attribute_value, attribute_definition) {
    if(!(year in this.topic_attributes)) {
      this.topic_attributes[year] = new Year(year);
    }
    this.topic_attributes[year].setTopicAttribute(topic, attribute_name, attribute_value, attribute_definition)
  }

  getYearTopicAttribute(year) {
    return this.topic_attributes[year];
  }

  setReligion(religion, year) {
    this.religion[year] = religion;
  }
}


