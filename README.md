This is a Svelte static site project for St. Joseph River science data website hosted at https://website.riverdata.app/

This app provides visualization and map-based analysis tools for water and land data collected in the St. Joseph River Basin, Indiana.

The data is collected by [St. Joseph River Basin Comission](https://sjrbc.com) who also host an older version of this website at https://data.sjrbc.com

This project will replace the data.sjrbc.com website eventually.


### Running

Install `jq`

```
./package-data.sh
yarn dev
```

After running `yarn build`, deploy `dist` folder.

### Data Architecture and Build

Data (tables and polygon map geometry) is hosted in a separate repository: https://github.com/Limnogirl90/SJRBC-web-map-data/tree/main

This data must be bundled in `/public/data` folder (and it gets copied and served as part of the static build)

Run `./package-data.sh` to initialize the `/public/data` folder.

#### Dataset index and caching

`/public/data/data-manifest.json` file is generated that contains a SHA1 digest for each dataset file. `data-manifest.json` is bundled with the app during static site generation.

`data-manifest.json` serves as an index to to tell the app what files to load at runtime. Folder structure is used to determine data types. A data admin can add new files to the data repository and after running `./package-data.sh` the app is ready to work with new data.

During runtime, the Cache Web API is used to fetch and/or cache dataset file with a known SHA1 digest. For the live website, the data manifest must be recalculated (the app must be rebuilt and redeployed) whenever the data repository changes. The user cache remains valid for unchanged files.


#### variables.yaml

Part of the data package is `variables.yaml` that is copied from the data repository. This file contains metadata for all known variables (i.e. column types or observation types). It includes parameters for how to visualize the variables (color gradients for values), how to label them and etc.

