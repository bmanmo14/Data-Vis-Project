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
