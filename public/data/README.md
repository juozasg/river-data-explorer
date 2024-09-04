# SJRBC-web-map-data
Repository for adding, updating, and maintaining water monitoring data for the SJRBC web map
## Data description

The data is formatted to work with the [St. Joe River Basin Commission Web Map](data.sjrbc.com). The source code for the web map is available [here](https://github.com/juozasg/river-data-explorer)


### sites.csv file

`sites.csv` list all monitored sites and their geographical coordinates.

Each site must have a unique `siteId` field in the format `dataset-number`. For example: `ecoli-1` or `fish-20`

The dataset names in `sites.csv` refer to files containing the data for the sites. So for `ecoli-1` the data is stored in `ecoli.csv`. 

### dataset CSV files

Dataset files contain rows for each site and for each time point for the site. Each row must have a `siteId` field (referring to `sites.csv`) and a `date` field that's formatted `YYYY-MM-DD`

https://docs.google.com/document/d/1pWqvHNNVfzj7IMEtLlDoVPWuivBZYijpp8Dl4jVxAp4/

