// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';


var ctx = document.getElementById("myAreaChart");
var myLineChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
        datasets: [{
            fill: 'start',
            lineTension: 0.3,
            backgroundColor: "rgba(78, 115, 223, 0.05)",
            borderColor: "rgba(78, 115, 223, 1)",
            pointRadius: 3,
            pointBackgroundColor: "rgba(78, 115, 223, 1)",
            pointBorderColor: "rgba(78, 115, 223, 1)",
            pointHoverRadius: 3,
            pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
            pointHoverBorderColor: "rgba(78, 115, 223, 1)",
            pointHitRadius: 10,
            pointBorderWidth: 2,
            data: [0, 10, 50, 15, 10, 20, 15, 25, 20, 30, 25, 40],
        }],
    },
    options: {
        maintainAspectRatio: false,
        layout: {
            padding: {
                left: 10,
                right: 25,
                top: 25,
                bottom: 0
            }
        },
        scales: {
            xAxes: [{
                time: {
                    unit: 'date'
                },
                gridLines: {
                    display: true,
                    drawBorder: true
                },
                ticks: {
                    maxTicksLimit: 20
                }
            }],
            yAxes: [{
                ticks: {
                    maxTicksLimit: 10,
                    padding: 10
                },
                gridLines: {
                    color: "rgb(234, 236, 244)",
                    zeroLineColor: "rgb(234, 236, 244)",
                    drawBorder: false,
                    borderDash: [2],
                    zeroLineBorderDash: [2]
                }
            }],
        },
        legend: {
            display: false
        },
        tooltips: {
            backgroundColor: "rgb(255,255,255)",
            bodyFontColor: "#858796",
            titleMarginBottom: 10,
            titleFontColor: '#6e707e',
            titleFontSize: 14,
            borderColor: '#dddfeb',
            borderWidth: 1,
            xPadding: 15,
            yPadding: 15,
            displayColors: false,
            intersect: false,
            mode: 'index',
            caretPadding: 10
        }
    }
});

let i = 13;
let areaintervalID;
let areaintervalTime = document.getElementById('setInterval-area').value * 1000;

areaintervalID = setInterval(() => {
    const newData = Math.floor(Math.random() * 100);
    const dataValues = myLineChart.data.datasets[0].data;
    const labels = myLineChart.data.labels;

    dataValues.shift();
    labels.shift();

    dataValues.push(newData);
    labels.push(i++);

    myLineChart.data.labels = labels;
    myLineChart.data.datasets[0].data = dataValues;
    myLineChart.update();
}, areaintervalTime);

function changeInterval_area() {
    areaintervalTime = document.getElementById('setInterval-area').value * 1000;
    if(areaintervalTime >= 1000) {
        clearInterval(areaintervalID);
        areaintervalID = setInterval(() => {
            const newData = Math.floor(Math.random() * 100);
            const dataValues = myLineChart.data.datasets[0].data;
            const labels = myLineChart.data.labels;

            dataValues.shift();
            labels.shift();

            dataValues.push(newData);
            labels.push(i++);

            myLineChart.data.labels = labels;
            myLineChart.data.datasets[0].data = dataValues;
            myLineChart.update();
        }, areaintervalTime);
    }
}