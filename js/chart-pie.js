Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

var ctx = document.getElementById("myPieChart");
var myPieChart = new Chart(ctx, {
    type: 'pie',
    data: {
        datasets: [{
            backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#79FFCE', '#E1FFE1', '#FFBBC6', '#FAFAB4'],
            hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf', '#dda20a', '#6FFFC4', '#DCFFDC', '#FFB6C1', '#FAFAAA'],
            hoverBorderColor: "rgba(234, 236, 244, 1)",
        }],
    },
    options: {
        maintainAspectRatio: false,
        tooltips: {
            backgroundColor: "rgb(255,255,255)",
            bodyFontColor: "#858796",
            borderColor: '#dddfeb',
            borderWidth: 1,
            xPadding: 15,
            yPadding: 15,
            displayColors: false,
            caretPadding: 10,
        },
        legend: {
            display: true
        },
    },
});

let pieintervalID;
let pieintervalTime = document.getElementById('setInterval-bar').value * 1000;
fetchData();

pieintervalID = setInterval(() => {
    fetchData();
}, pieintervalTime);

function changeInterval_pie() {
    pieintervalTime = document.getElementById('setInterval-pie').value * 1000;
    if(pieintervalTime >= 1000) {
        clearInterval(pieintervalID);
        pieintervalID = setInterval(() => {
            fetchData();
        }, pieintervalTime);
    }
}

function fetchData() {
    let newLabels = [];
    let newDatas = [];

    fetch('/query/dbUsage')
        .then((response) => response.json())
        .then((data) => {
            for(let i=0;i<data.data.length;i++){
                switch (data.data[i].size.slice(-2)) {
                    case "kB":
                        newDatas.push(data.data[i].size.slice(0, -2));
                        break;
                    case "MB":
                        newDatas.push(data.data[i].size.slice(0, -2) * 1024 );
                        break;
                }
                newLabels.push(data.data[i].datname);
            }
            myPieChart.data.labels = newLabels;
            myPieChart.data.datasets[0].data = newDatas;
            myPieChart.update();
        })
        .catch((error) => {
            console.error('pie chart 오류 발생:', error);
        });
}