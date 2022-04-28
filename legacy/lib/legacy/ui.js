
function scaleToStyle(variable) {
  return (feature) => {
    const v = App.vars[variable];
    let val = feature.properties[v.prop];
    if(variable == "datainfo" && val === undefined) {
      val = 30;
    }

    const color = v.scale(val);
    const radius = v.scale.copy().range(radiusRange)(val)

    return {
      fillColor: color,
      stroke: true,
      color: 'black',
      weight: 2,
      fillOpacity: 0.9,
      radius: radius
    }
  }
}

function infoBox(feature) {
  clg(feature);

  $('.modal h4').text(feature.properties.Name);


  var html = "";
  for (k in feature.properties) {
    var val = feature.properties[k];
    if (val == null) {
      val = ""
    }
    var tr = "<tr>";

    /* Must not forget the $ sign */
    tr += "<td>" + k + "</td>" + "<td>" + val.toString() + "</td></tr>";

    /* We add the table row to the table body */
    html += tr;
  }

  $('.modal tbody').html(html);

  App.modal.open();
}

function hideStyle() {
  return (feature) => {
    return {fillOpacity:0, stroke: false};
  }
}


// function registerDataVariable(variable) {
//   const button = $(`#${variable}`);
//   button.click((e) => {
//     $('#filters *').removeClass('active');
//     button.addClass('active');
//     // button.parents('active');

//     if(variable == 'datainfo') {
//       App.featureLayer.setStyle(scaleToStyle(variable));
//       App.usgsFeatureLayer.setStyle(scaleToStyle(variable));
//     } else if(App.vars[variable].usgs) {
//         App.usgsFeatureLayer.setStyle(scaleToStyle(variable));
//         App.featureLayer.setStyle(hideStyle());
//     } else {
//       App.featureLayer.setStyle(scaleToStyle(variable));
//       App.usgsFeatureLayer.setStyle(hideStyle());
//     }

//     replaceLegend(variable);
//   })
// }

