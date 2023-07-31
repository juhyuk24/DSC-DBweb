// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

var ctx = document.getElementById("myBarChart2");
var myBarChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ["value1", "value2", "value3", "value4", "value5", "value6"],
        datasets: [{
            label: "Revenue",
            backgroundColor: "#4e73df",
            hoverBackgroundColor: "#2e59d9",
            borderColor: "#4e73df",
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
                    unit: 'month'
                },
                gridLines: {
                    display: false,
                    drawBorder: false
                },
                ticks: {
                    maxTicksLimit: 6
                },
                maxBarThickness: 25,
            }],
            yAxes: [{
                ticks: {
                    min: 0,
                    max: 100,
                    maxTicksLimit: 5,
                    padding: 10,
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
            titleMarginBottom: 10,
            titleFontColor: '#6e707e',
            titleFontSize: 14,
            backgroundColor: "rgb(255,255,255)",
            bodyFontColor: "#858796",
            borderColor: '#dddfeb',
            borderWidth: 1,
            xPadding: 15,
            yPadding: 15,
            displayColors: false,
            caretPadding: 10,
        },
    }
});

let databarintervalID;
let databarintervalTime = document.getElementById('setInterval-databar').value * 1000;

databarintervalID = setInterval(() => {
    const newData = [getRandomNumber(70, 80), getRandomNumber(50, 60), getRandomNumber(30, 50), getRandomNumber(20, 30), getRandomNumber(10, 20), getRandomNumber(6, 14)];
    myBarChart.data.datasets[0].data = newData;
    myBarChart.update();
}, databarintervalTime);

function changeInterval_databar() {
    databarintervalTime = document.getElementById('setInterval-databar').value * 1000;
    if(databarintervalTime >= 1000) {
        clearInterval(databarintervalID);
        databarintervalID = setInterval(() => {
            const newData = [getRandomNumber(70, 80), getRandomNumber(50, 60), getRandomNumber(30, 50), getRandomNumber(20, 30), getRandomNumber(10, 20), getRandomNumber(6, 14)];
            myBarChart.data.datasets[0].data = newData;
            myBarChart.update();
        }, databarintervalTime);
    }
}