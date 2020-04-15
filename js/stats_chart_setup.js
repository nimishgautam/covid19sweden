		var countyPopData = {};	
		var active_region = "Sweden (official)";
		var chart_config = {
			type: 'line',
			data: {
				labels: covid_data['Statistikdatum'],
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
			//d3 stuff
			if( active_region == 'Sweden (official)' || active_region == 'Sweden (regional)'){
				d3.selectAll('[data-country="Sweden"]')
				.attr('fill',  function(d){ 
					return d3.select(this).attr('data-fill');
				})
				.attr('stroke', 'none');
			} else {
				d3.selectAll('[data-country="Sweden"]').attr('fill', '#f0f8ff').attr('stroke', 'none');
				d3.selectAll('[data-name="' + active_region+'"]')
				   .attr('fill', function(d){
					return d3.select(this).attr('data-fill');
					})
				  .attr('stroke', 'red');
			}

			//select
			$('#current_region_select').val(active_region);
			
			//chart
			chart_config.options.title.text = 'COVID-19 Deaths in ' + active_region;
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
				
				chart_config.data.datasets.push(	{
					label: 'Intensive Care',
					backgroundColor: '#66ff8f',
					borderColor: '#2f7341',
					borderWidth: 2,
					borderDash: [2,1],
					data: covid_data["Antal_intensivvardade"]["Sweden (official)"],
					fill: true,
				});

				chart_config.data.datasets.push(	{
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

				chart_config.options.annotation.annotations.push(
						{
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
			else {
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

		window.onload = function() {
			var ctx = document.getElementById('canvas').getContext('2d');
			window.myLine = new Chart(ctx, chart_config);
			chart_update();
		};

