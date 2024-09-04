This is a Svelte static site project for St. Joseph River science data website hosted at https://website.riverdata.app/

This app provides visualization and map-based analysis tools for water and land data collected in the St. Joseph River Basin, Indiana.

The data is collected by [St. Joseph River Basin Comission](https://sjrbc.com) who also host an older version of this website at https://data.sjrbc.com

This project will replace the data.sjrbc.com website eventually.


### Running
```
./package-data.sh
yarn dev
```

After running `yarn build`, `build/index.html` is  static site app.

### Data Architecture and Build

Data (tables and polygon map geometry) is hosted in a separate repository: https://github.com/Limnogirl90/SJRBC-web-map-data/tree/main

This data must be bundled in `/static/data` folder (and it gets copied and served as part of the static build)

Run `./package-data.sh` to initialize the `/static/data` folder.

#### Caching

`/static/data/data-manifest.json` file is generated that contains a SHA1 digest for each dataset file. `data-manifest.json` is bundled with the app during static site generation _(via Sveltekit custom `fetch` function in root `+layout.ts`)._

During runtime, the Cache Web API is used to fetch and/or cache dataset file with a known SHA1 digest. For live website, the data manifest and the app itself must be rebuild whenever the data repository changes. The user cache remains valid for unchanged data.

#### Index of datasets

`data-manifest.json` also serves as an index to determine how many data files of different types there exist for the app to load at runtime. A data admin can add new files to the data and after running `./package-data.sh` the app is ready to work with new data


#### variables.yaml

Part of the data package is `variables.yaml` copied from teh data repository. This file contains metadata for all known variables (i.e. column types or observation types). It includes parameters for how to visualize the variables (color gradients for values), how to label them and etc.





## Testing

Inside that directory, you can run several commands:

  yarn run test-ct
    Runs the component tests.

  yarn run test-ct -- --project=chromium
    Runs the tests only on Desktop Chrome.

  yarn run test-ct App.test.ts
    Runs the tests in the specific file.

  yarn run test-ct -- --debug
    Runs the tests in debug mode.
