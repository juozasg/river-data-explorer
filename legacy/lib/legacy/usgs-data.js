async function loadUSGSData() {
  const stationIds = '04096405,04096515,04097500,040975299,04097540,04099000,04100500,04101000,04101500,04101535,04101800,04102500,04099750'
  const url = `https://waterservices.usgs.gov/nwis/iv/?format=json&sites=${stationIds}&parameterCd=00060,00065&siteStatus=all`;

  // fetch
  const rawData = await fetch(url);
  const data = await rawData.json();

  // extract data
  const stations = {}
  for (ts of data.value.timeSeries) {
    // clg(ts);
    const siteCode = ts.sourceInfo.siteCode[0].value;
    stations[siteCode] ||= {}

    const loc = ts.sourceInfo.geoLocation.geogLocation;
    stations[siteCode]['type'] = 'Feature';
    stations[siteCode]['id'] = siteCode;
    stations[siteCode]["geometry"] = {
      "type": "Point",
      "coordinates": [
          loc.longitude,
          loc.latitude
      ]
    }

    stations[siteCode]['properties'] ||= {}
    stations[siteCode]['properties']['Name'] = ts.sourceInfo.siteName;
    stations[siteCode]['properties']['Id'] = siteCode;
    // TODO: real data
    stations[siteCode]['properties']['LastMeasurement'] = 0;

    if(ts.variable.variableCode[0].value == '00060') {
      // Streamflow ft/s
      stations[siteCode]['properties']['Flow'] = ts.values[0].value[0].value;
    } else if (ts.variable.variableCode[0].value == '00065') {
      // Gage height, ft
      stations[siteCode]['properties']['Height'] = ts.values[0].value[0].value;
    }
  }

  App.usgsFeatures = Object.values(stations);

  const featureCollection = {
    type: 'FeatureCollection',
    features: App.usgsFeatures
  };

  App.usgsFeatureLayer = L.geoJSON(featureCollection,{
    pointToLayer: (p, latlng) => {
      return L.circleMarker(latlng).on('click', () => infoBox(p));
    }
  }).addTo(App.map);
}

