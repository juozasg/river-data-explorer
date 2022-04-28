// featureMinMaxInt('pH') = [7, 9]
function featureMinMaxInt(prop) {
  const vals = App.features.map((f) => parseInt(f.properties[prop]));
  const min = Math.min(0, Math.floor(d3.min(vals)));
  return [min, Math.ceil(d3.max(vals))];
}

function featureMinMax(prop) {
  const vals = App.features.map((f) => parseFloat(f.properties[prop]));
  return [d3.min(vals), d3.max(vals)];
}

function usgsFeatureMinMax(prop) {
  const vals = App.usgsFeatures.map((f) => parseInt(f.properties[prop]));
  return [d3.min(vals), d3.max(vals)];
}

function initVars() {
  // make sure the pH scale never starts at anything larger than 6
  // const phmm = featureMinMax('pH');
  // const phmin = Math.min(6.5, phmm[0]);
  // const phmax = phmm[1];

  App.vars = {
    datainfo: {
      prop: 'LastMeasurement',
      label: "Last Measurement (days)",
      scale: d3.scaleSequential([90, 0], d3.interpolateCividis)
    },
    ph: {
      prop: 'pH',
      label: 'pH',
      scale: d3.scaleSequential(featureMinMax('pH'), d3.interpolateViridis)
    },
    turbidity: {
      prop: 'Turbidity',
      label: 'Turbidity (NTU)',
      scale: d3.scaleSequential(featureMinMaxInt('Turbidity'), d3.interpolateBlues)
    },
    temp: {
      prop: 'Temp',
      label: 'Temperature (C)',
      scale: d3.scaleSequential(featureMinMaxInt('Temp'), d3.interpolateYlOrRd)
    },
    ecoli: {
      prop: 'Escherichi',
      label: 'Escherichia coli',
      scale: d3.scaleSequential(featureMinMaxInt('Escherichi'), d3.interpolateOranges)
    },
    nitrate: {
      prop: 'Nitrate_Ni',
      label: 'Nitrate',
      scale: d3.scaleSequential(featureMinMaxInt('Nitrate_Ni'), d3.interpolateRdPu)
    },
    flow: {
      label: 'Flow (cubic ft)',
      prop: 'Flow',
      scale: d3.scaleSequentialLog(usgsFeatureMinMax('Flow'), d3.interpolatePuBu),
      // scale: d3.scaleSqrt([0, 5000], d3.interpolatePuBu),
      usgs: true
    },
    height: {
      label: 'Height (ft)',
      prop: 'Height',
      scale: d3.scaleSequential(usgsFeatureMinMax('Height'), d3.interpolateGnBu),
      usgs: true
    },
  }
}

async function initApp() {


  await loadMapData();

  // show display after things load to make it look nicer
  $('#ui').css('display', 'flex');

  loadUSGSData().then(() => {
    clg("Data loaded");
    // $('#gageflow').prop("disabled", false);
    // $('#gageheight').prop("disabled", false);
    initVars();

    for (const [key, value] of Object.entries(App.vars)) {
      registerDataVariable(key);
    }

    $('#datainfo').click();
    // $('#flow').click();

  });
}

$(document).ready(() => { initApp(); })






/*
BOD: 19.64
BOD__mg_l: 1.63
Chlorides: 11.32
Conductivi: 682.4
Dissolved: 8.66
Escherichi: 54.17
Flow_cfs: 10.608
Lat: 41.32088
Location: "Bridge on CR 300W, 0.3 mi S of US33, Noble Co."
Long: -85.48046
Nitrate_Ni: 3.32
Temp: 10.68
Total_Diss: 357
Total_Phos: 0.25
Total_Susp: 12.92
Turbidity: 9.17
Water_Body: "Carrol Creek"
pH: 7.85
*/