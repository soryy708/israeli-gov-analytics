# Israeli Government Analytics

Israeli government (Knesset) data & tools for its collection, manipulation, and visualization.

[Visualization website](https://soryy708.github.io/israeli-gov-analytics/analysis/index.html) (powered by GitHub Pages)

![](https://forthebadge.com/images/badges/built-by-developers.svg)![](https://forthebadge.com/images/badges/made-with-javascript.svg)![](https://forthebadge.com/images/badges/gluten-free.svg)![](https://forthebadge.com/images/badges/uses-badges.svg)

## Repository structure

* /
	* LICENSE
	* README
* /analysis
	* /dataTools
		* build.js - *node script for feeding `parliaments.json` and `parties.json` to the analysis & visualization web page*
		* validate.js - *node script for checking the validity of `parliaments.json` and `parties.json`*
		* parliaments.json - *data about the composition of the various parliaments in Israels history*
		* parties.json - *data about the various political parties in Israels history*
	* app.js - *browser code for analyzing and visualizing the data*
	* [index.html](https://soryy708.github.io/israeli-gov-analytics/analysis/index.html) - *web page for visualizing the data*
* /dataGathering
	* scrapeKnesset.js - *node script for populating a `parliaments.json` file*

## How to build

1. Clone this repository
2. Download & install [NodeJS]([https://nodejs.org/en/download/](https://nodejs.org/en/download/))
3. Run `/analysis/dataTools/build.js` in Node
4. Open `/analysis/index.html` to verify all works
