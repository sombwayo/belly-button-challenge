const url= "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// // Fetch the JSON data and console log it
d3.json(url).then(function(data) {
  console.log(data);
});

function init() {
       
    // Use D3 to select the dropdown menu
    let dropdownMenu = d3.select("#selDataset");
    
    // Use D3 to get sample names and populate the drop-down selector
    d3.json(url).then((data) => {
      
        // Set a variable for the sample names
        let names = data.names;

        // Add  samples to dropdown menu
        names.forEach((id) => {

            // Log the value of id for each iteration of the loop
            console.log(id);

            dropdownMenu.append("option").text(id).property("value",id);
        });

        // Set the first sample from the list
        let sample_one = names[0];

        // Log the value of sample_one
        console.log(sample_one);

        // Build the initial plots
        
        buildMetadata(sample_one);
        buildBarChart(sample_one);
        buildBubbleChart(sample_one);

    });
};
//call the program to run
init();

function buildMetadata(BellyButton) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {

        // Retrieve all metadata
        let metadata = data.metadata;

        // Filter based on the value of the sample
        let sample = metadata.filter(result => result.id == BellyButton);

        // Log the array of metadata objects after the have been filtered
        console.log(sample)

        // Get the first index from the array
        let sample_area = sample[0];

        // Clear out metadata
        d3.select("#sample-metadata").html("");

        // Use Object.entries to add each key/value pair to the panel
        Object.entries(sample_area).forEach(([key,sample]) => {

            // Log the individual key/value pairs as they are being appended to the metadata panel
            console.log(key,sample);

            d3.select("#sample-metadata").append("h5").text(`${key}: ${sample}`);
        });
    });

};


function buildBarChart(BellyButton) {

    d3.json(url).then((data)=> {

        // filter based on the value of the sample

        let sample= data.samples.filter(sampleid=>sampleid.id == BellyButton);

        // retrieve first index of the array
        let sample_area=sample[0];
        
        //retrieve data of first index of array in cosole
        console.log(`Sample Data: ${sample_area}`);

        // Define bar chart parameters

        let otu_id= sample_area.otu_ids;
        let otu_label= sample_area.otu_labels;
        console.log(`OTU IDs: ${otu_label}`);
        let sample_values=sample_area.sample_values;

        console.log(otu_id, otu_label,sample_values);

        let yticks=otu_id.slice(0.10).map(id=>`OTU ${id}`).reverse();
        let xticks=sample_values.slice(0,10).reverse();
        let labels=otu_label.slice(0,10).reverse();

        //Set up trace for horizontal bar chart
        let hbar= {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"

        };
        //set up the chart layout
        let layout = {
            title: "Top 10 OTUs Present"
        };

        // Call Plotly to plot the bar chart
        Plotly.newPlot("bar", [hbar], layout);

    });

};    

function buildBubbleChart(BellyButton) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {
        

        // Filter based on the value of the sample
        let sample = data.samples.filter(sampleid => sampleid.id == BellyButton);

        // Get the first index from the array
        let sample_area = sample[0];

        // Get the otu_ids, lables, and sample values
        let otu_id = sample_area.otu_ids;
        let otu_label = sample_area.otu_labels;
        let sample_values = sample_area.sample_values;

        // Log the data to the console
        console.log(otu_id,otu_label,sample_values);
        
        // Set up the trace for bubble chart
        let bubble = {
            x: otu_id,
            y: sample_values,
            text: otu_label,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_id,
                colorscale: "Earth"
            }
        };

        // Set up the layout
        let layout = {
            title: "Bacteria Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
            yaxis:{title: "Sample Values"},
        };

    // Call Plotly to plot the bubble chart
        
    Plotly.newPlot("bubble", [bubble], layout)
});
};

function optionChanged(sample) { 

    // Log the new value
    console.log(sample); 

    // Call all functions 
    buildMetadata(sample);
    buildBarChart(sample);
    buildBubbleChart(sample);
    buildGaugeChart(sample);
    
};