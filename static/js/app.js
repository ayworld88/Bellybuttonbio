function buildMetadata(sample) {
 // Using `d3.json` to fetch the metadata for a sample


  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then(function (data) {
    console.log(data);
    // Use d3 to select the panel with id of `#sample-metadata`
    var url = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    url.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    Object.entries(data).forEach(([key, value]) => {
      url.append("h6").text(`${key}: ${value}`);
    })
    
    
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
  })

}


    function buildCharts(sample) {
      // @TODO: Use `d3.json` to fetch the sample data for the plots
      d3.json(`/samples/${sample}`).then(function (data) {

        const otu_ids = data.otu_ids;
        const sample_values = data.sample_values;
        const otu_labels = data.otu_labels;

        // @TODO: Build a Bubble Chart using the sample data
        var bubblePlot = [{
          x: otu_ids,
          y: sample_values,
          mode: "markers",
          hoverinfo: "text",
          marker: {
            size: sample_values,
            color: otu_ids,
            colorscale: "Earth"
          }
        }];

        var blayout = {
          hovermode: "closest",
          margin: {t: 0 },
          xaxis: {title: "OTU ID" },
        };

        Plotly.newPlot("bubble", bubblePlot, blayout);
        // @TODO: Build a Pie Chart
        // Sort the data array to grab the top 10 sample_values
        var piePlot = [{
          values: sample_values.slice(0, 10),
          labels: otu_ids.slice(0, 10),
          hovertext: otu_labels.slice(0, 10),
          type: "pie"
        }];

        var playout = {
          margin: {t: 0}
        };

        Plotly.newPlot("pie", piePlot, playout);
      });
    }
 
  

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
