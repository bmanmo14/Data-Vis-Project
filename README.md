# World Leader Religious Affiliations and their Sociopolitical Effects

### Created By: Brandon Mouser, Kyle Price, Brandon Ward

### [Project Webpage](https://bmanmo14.github.io/Data-Vis-Project/project.html)

### Project Overview

The project is set up like most of the homeworks for this class:
  * Process Book is ProcessBook.pdf, located [here](./ProcessBook.pdf)
  * The project is loaded from `project.html`
  * Styles are in `styles.css`
  * The feedback excercise and this README are in this main directory

Folders used within the project are:
  * `country-flags` and `religion-indicators`: Used by `country_selection.js`, these folders include flags and colors that appear next to country and religion names.
  * `data`: The religion data and country datasets reside in this folder and are read in by `script.js`. The datasets in this folder have been preprocessed and modified from the original datasets to be used for this project.
  * `js`: This folder houses all of the Javascript files used for the project. There are 11 files total. The first file that is loaded is `script.js` which calls classes in the other files. `constants.js` is a simple file that holds constants used across the page. The remaining files set up the classes and datasets used throughout the page and create the visualizations in D3:
    1. `country_data.js`, `religion_data.js`, `data_orchestrator.js`: These three files set up the `CountryData` and `ReligionData` from the datasets in the `data` folder. `data_orchestrato.js` uses these two files to create a `religion` and `country` object that is used by the visualizations throughout the page. Other work is done to also set up a dictionary or topics and attributes and a color scale used by the lines in line_graph.
    2. `country_selection.js`: This file houses the `CountrySelector` class that includes the two dropdowns for selecting a country, and the country table shown near the top of the page. Flags and the "scribble" colors are taken from the `country-flags` and `religion-indicators` folders.
    3. `help.js`: This file sets up and shows the overlaid `div` that appears when a user clicks on the "Help" button on the very top left of the page. Instructions and descriptions for the page are shown when the button is clicked, to help the user navigate the page.
    4. `line_graph.js`: This file creates the `LineGraph` object. It sets up the lines for each country when a country is changed, dragging, changes when a new topic is selected, and calls the classes in `tolltip.js` and `religion_graph.js` to make changes when a user makes a selection.
    5. `religion_graph.js`: This file includes the religion graphs for each of the parent religions, as seen on the site. Placed below the line graph, this file sets up histograms for each parent religion, changes when a new topic or attribute is selected, and also calculates metrics for each religion, which can be selected via radio buttons.
    6. `tooltip.js`: The tooltip on this page contains the description of the selected topic, attribute, and year selected on the line graph. Placed above the line graph, it changes when dragging across the graph, when a country is changed, or when a topic is changed via the topic buttons. Metrics, year, religion, and attribute description are set up and shown by this tooltip.
    7. `topic_selection.js`: A simple file used to set up the topic buttons placed above the line graph. On click handlers change the selected topic within `line_graph.js`.

