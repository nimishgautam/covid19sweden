var countyPopData = {};	
var active_region = "Sweden (official)"; //default selection
var future_projection = false;

var chart_config = {
	type: 'line',
	data: {
		labels: [],
		datasets: []
	},
	options: {
		annotation:{
			annotations:[]
		},
		responsive: true,
		title: {
			display: true
		},
		tooltips: {
			mode: 'index',
			intersect: false,
		},
		hover: {
			mode: 'nearest',
			intersect: true
		},
		maintainAspectRatio: false,
		scales: {
			xAxes: [{
				display: true,
				scaleLabel: {
					display: true,
					labelString: 'Date'
				}
			}],
			yAxes: [{
				display: true,
				scaleLabel: {
					display: true,
					labelString: 'People'
				}
			}]
		}
	}
};


var chart_update = function(){

	future_projection = false;
	$('#prj_button').text("Future Projection »");
	chart_config.data.labels =  covid_data['Statistikdatum'];
	
	//d3 stuff
	if( active_region == 'Sweden (official)' || active_region == 'Sweden (regional)'){
		d3.selectAll('[data-country="Sweden"]')
		  .attr('fill',  function(d){ 
			return d3.select(this).attr('data-fill');
		  })
		  .attr('stroke', 'none');
	} else {
		d3.selectAll('[data-country="Sweden"]')
		  .attr('fill', '#f0f8ff')
		  .attr('stroke', 'none');
		
		d3.selectAll('[data-name="' + active_region+'"]')
		  .attr('fill', function(d){
			return d3.select(this).attr('data-fill');
		  })
		  .attr('stroke', 'red');
	}

	//select
	$('#current_region_select').val(active_region);
	
	//chart
	chart_config.options.title.text = 'Deaths in ' + active_region;

	chart_config.data.datasets = [
		{
			label: 'Deaths',
			backgroundColor: '#ff0000',
			borderColor: '#ffcccc',
			borderWidth: 2,
			borderDash: [2,1],
			data: covid_data["Antal_avlidna"][active_region],
			fill: true,
		},
		{
			label: 'Cumulative deaths',
			backgroundColor: '#ff6666',
			borderColor: '#ff6666',
			data: covid_data["Kumulativa_avlidna"][active_region],
			fill: false,
		}
	];
	
	chart_config.options.annotation.annotations = [];

	if (active_region == "Sweden (regional)" || active_region == "Sweden (official)"){
		chart_config.data.datasets.push({
			label: 'Intensive Care',
			backgroundColor: '#66ff8f',
			borderColor: '#2f7341',
			borderWidth: 2,
			borderDash: [2,1],
			data: covid_data["Antal_intensivvardade"]["Sweden (official)"],
			fill: true,
		});

		chart_config.data.datasets.push({
			label: 'Cumulative Intensive Care',
			backgroundColor: '#66ff8f',
			borderColor: '#66ff8f',
			data: covid_data["Kumulativa_intensivvardade"]["Sweden (official)"],
			fill: false,
		});

		if(active_region == "Sweden (official)" && covid_data['Kumulativa_avlidna'].hasOwnProperty('(discrepancy)')){
			chart_config.data.datasets.push({
				label: 'Presumptive Deaths (today)',
				backgroundColor: '#0000ff',
				borderColor: '#0000ff',
				data: covid_data["Kumulativa_avlidna"]["(discrepancy)"],
				fill: false
			});
		
		}

		chart_config.options.annotation.annotations.push({
			type: 'line',
			mode: 'horizontal',
			scaleID: 'y-axis-0',
			value: 359,
			borderColor: 'rgba(102, 255, 143, 0.4)',
			borderWidth: 2,
			borderDash: [1, 3],
			label: {
				backgroundColor: 'rgba(102, 255, 143, 0.4)',
				fontStyle: "normal",
				enabled: true,
				content: "Flu Intensive Care 2019",
			}
		});

		chart_config.options.annotation.annotations.push({
			type: 'line',
			mode: 'horizontal',
			scaleID: 'y-axis-0',
			value: 505, 
			borderColor: 'rgba(255,0,0,0.20)',
			borderWidth: 2,
			borderDash: [1, 3],
			label: {
				backgroundColor: "rgba(255,0,0,0.20)",
				fontStyle: "normal",
				enabled: true,
				content: "Flu Deaths 2019",
			}
				
		});
	}
	else { //regional data
		chart_config.options.annotation.annotations.push({
			type: 'line',
			mode: 'horizontal',
			scaleID: 'y-axis-0',
			// 505 deaths in the year divided by sweden population
			// not the best with hardcoded, but can refactor later if needed
			value: 505 * countyPopData[ active_region ]['pop']/ 10327589 , 
			borderColor: 'rgba(255,0,0,0.20)',
			borderWidth: 2,
			borderDash: [1, 3],
			label: {
				backgroundColor: "rgba(255,0,0,0.20)",
				fontStyle: "normal",
				enabled: true,
				content: "Flu Deaths 2019",
			}
		});

	}
	window.myLine.update();
};

var show_projections = function(){
	let today = new Date();
	let today_day = String(today.getDate()).padStart(2, '0');
	let today_month = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
	let todaystr = today_month + "-" + today_day;

	future_projection = true;
	$('#prj_button').text("Current Data «");

	chart_config.options.title.text = 'Projections for 2020';
	chart_config.data.labels = covid_prediction['dates'];
	chart_config.options.annotation.annotations = [];

	chart_config.options.annotation.annotations.push({
			type: 'line',
			mode: 'vertical',
			scaleID: 'x-axis-0',
			value: todaystr, 
			borderColor: 'rgba(0,0,0,0.80)',
			borderWidth: 2,
			borderDash: [1, 3],
			label: {
				backgroundColor: "rgba(0,0,0,0.80)",
				fontStyle: "normal",
				enabled: true,
				content: "Today",
			}
				
		});


	chart_config.data.datasets = [
		{
			label: 'Daily Death Prediction',
			backgroundColor: '#ffcccc',
			borderColor: '#ff0000',
			borderDash: [3,1],
			pointRadius: 0,
			data: covid_prediction["d_mean"],
			fill: false,
		},
		{
			label: 'Total Death Prediction',
			backgroundColor: 'rgba(255, 0,210, 1)',
			pointRadius: 0,
			borderColor: 'rgba(255, 0,210, 1)',
			data: covid_prediction["t_mean"],
			fill: false,
		},
		{
			label: 'Daily Death Lower Bound',
			backgroundColor: '#ff0000',
			borderColor: '#ffcccc',
			borderWidth: 0,
			pointRadius: 0,
			data: covid_prediction['d_lower'],
			fill: true,
		},
		{
			label: 'Daily Death Upper Bound',
			backgroundColor: 'rgba(255, 100,100, 0.2)',
			pointRadius: 0,
			borderColor: 'rgba(255, 100, 100, 0.2)',
			data: covid_prediction["d_upper"],
			fill: '-1',
		},
		{
			label: 'Total Death Lower Bound',
			backgroundColor: 'rgba(255, 0,210, 0.2)',
			pointRadius: 0,
			borderColor: 'rgba(255, 0,210, 0.2)',
			data: covid_prediction["t_lower"],
			fill: false,
		},
		{
			label: 'Total Death Upper Bound',
			backgroundColor: 'rgba(255, 0,210, 0.2)',
			pointRadius: 0,
			borderColor: 'rgba(255, 0,210, 0.2)',
			data: covid_prediction["t_upper"],
			fill: '-1',
		}

	];
	window.myLine.update();
};

window.onload = function() {
	var ctx = document.getElementById('canvas').getContext('2d');
	window.myLine = new Chart(ctx, chart_config);
	chart_update();
};

