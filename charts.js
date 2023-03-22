function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
   
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Deliverable 1: 1. Create the buildChart function.
function buildCharts(sample) {
  // Deliverable 1: 2. Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

    // Deliverable 1: 3. Create a variable that holds the samples array. 
    var samplesArray = data.samples;
    // Deliverable 1: 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samplesArray.filter(sampleObj => sampleObj.id == sample);
    // Deliverable 3: 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadataArray = data.metadata
    var resultsMetadata = metadataArray.filter(sampleObj => sampleObj.id == sample);
  
    // Deliverable 1: 5. Create a variable that holds the first sample in the array.
    var firstSample = resultArray[0];
    console.log(firstSample);
    // Deliverable 3: 2. Create a variable that holds the first sample in the metadata array.
    var firstMetadata = resultsMetadata[0];
    console.log(firstMetadata);
    // Deliverable 1: 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var sample_values = firstSample.sample_values;
    var otu_ids = firstSample.otu_ids;
    var otu_labels = firstSample.otu_labels;
    // Deliverable 3: 3. Create a variable that holds the washing frequency.
    var wFreq = parseFloat(firstMetadata.wFreq);
    // Deliverable 1: 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order 
    // so the otu_ids with the most bacteria are last. 
    var yticks = otu_ids.slice(0,10).map(id => "OTU" + id + " ").reverse();

    // Deliverable 1: 8. Create the trace for the bar chart. 
    var barData = [{
      x: sample_values.slice(0,10).reverse(),
      y:yticks,
      text: otu_labels.slice(0,10).reverse(),
      type: "bar",
      orientation : "h",
      marker: {
        color:sample_values.slice(0,10).reverse(),
        colorscale:"Y10rBr"
      }
    }

    ];

    // Deliverable 1: 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top Ten Bacterial Cultures Found"

    };

    // Deliverable 1: 10. Use Plotly to plot the data with the layout. 
    Plotly.newplot("bar", barData, barLayout);
    // Deliverable 2: 1. Create the trace for the bubble chart.
    var bubbleChart = [{
      x:otu_ids,
      y:sample_values,
      text:otu_labels,
      type: "scatter",
      mode: "markers",
      marker: {
        size:sample_values,
        color:otu_ids,
        colorscale: "Y10rBr"
      }
    }]
    // Deliverable 2: 2. Create the layout for the bubble chart.
    var layoutBubble = {
      title: "Bacteria Cultures Per Sample",
      xaxis : {title: "OTU ID"},
      margin : {
        l: 0,
        r: 0,
        t: 0,
        b: 0

      },
      hovermode: "closest"
    };
    // Deliverable 2: 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleChart, layoutBubble); 
    // Deliverable 3: 4. Create the trace for the gauge chart.
    var gaugeChart = [{
      domain: { x: [0, 1], y: [0, 1] },
      value: wFreq,
      title: {text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week", font: {size: 24}},
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: {
          range: [0, 10], 
          tickwidth: 1, 
          tickcolor: "black"},
        bar: {color: "black"},
        steps: [
          {range: [0, 2], color: "orange"},
          {range: [2, 4], color: "red"},
          {range: [4, 6], color: "green"},
          {range: [6, 8], color: "yellow"},
          {range: [8, 10], color: "lightgreen"},
        ]}
    }];
    // Deliverable 3: 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 500, 
      height: 400,
      margin: {t: 0, r: 0, l: 0, b: 0}
    };
    // Deliverable 3: 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeChart, gaugeLayout);
  });
}
