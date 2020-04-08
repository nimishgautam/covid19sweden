		var config = {
			type: 'line',
			data: {
				labels: covid_data['Statistikdatum'],
				datasets: [
				{
					label: 'Deaths',
					backgroundColor: '#ff0000',
					borderColor: '#ffcccc',
					borderWidth: 2,
					borderDash: [2,1],
					data: covid_data["Antal_avlidna"],
					fill: true,
				},
				{
					label: 'Cumulative deaths',
					backgroundColor: '#ff6666',
					borderColor: '#ff6666',
					data: covid_data["Kumulativa_avlidna"],
					fill: false,
				},
				{
					label: 'Intensive Care',
					backgroundColor: '#66ff8f',
					borderColor: '#2f7341',
					borderWidth: 2,
					borderDash: [2,1],
					data: covid_data["Antal_intensivvardade"],
					fill: true,
				},
				{
					label: 'Cumulative Intensive Care',
					backgroundColor: '#66ff8f',
					borderColor: '#66ff8f',
					data: covid_data["Kumulativa_intensivvardade"],
					fill: false,
				}
				]
			},
			options: {
				annotation:{
					annotations:[
						{
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
						
						},
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
						},


					]
				},
				responsive: true,
				title: {
					display: true,
					text: 'COVID-19 Deaths in Sweden'
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

		window.onload = function() {
			var ctx = document.getElementById('canvas').getContext('2d');
			window.myLine = new Chart(ctx, config);
		};

