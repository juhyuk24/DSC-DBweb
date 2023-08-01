Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

var ctx = document.getElementById("myPieChart");
var myPieChart = new Chart(ctx, {
    type: 'pie',
    data: {
        datasets: [{
            backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#4e73df', '#1cc88a', '#36b9cc', '#f6c23e'],
            hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf', '#dda20a', '#2e59d9', '#17a673', '#2c9faf', '#dda20a'],
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

fetch('/query/dbUsage')
    .then((response) => response.json())
    .then((data) => {
        for(let i=0;i<data.tables.length;i++){
            switch (data.tables[i].size.slice(-2)) {
                case "kB":
                    myPieChart.data.datasets[0].data.push(data.tables[i].size.slice(0, -2));
                    break;
                case "MB":
                    myPieChart.data.datasets[0].data.push(data.tables[i].size.slice(0, -2) * 1024 );
                    break;
            }
            myPieChart.data.labels.push(data.tables[i].datname);
        }
        myPieChart.update();
    })
    .catch((error) => {
        console.error('pie chart 오류 발생:', error);
    });

let pieintervalID;
let pieintervalTime = document.getElementById('setInterval-bar').value * 1000;

pieintervalID = setInterval(() => {
    let newLabels = [];
    var newDatas = [];

    fetch('/query/dbUsage')
        .then((response) => response.json())
        .then((data) => {
            for(let i=0;i<data.tables.length;i++){
                switch (data.tables[i].size.slice(-2)) {
                    case "kB":
                        newDatas.push(data.tables[i].size.slice(0, -2));
                        break;
                    case "MB":
                        newDatas.push(data.tables[i].size.slice(0, -2) * 1024 );
                        break;
                }
                newLabels.push(data.tables[i].datname);
            }
            myPieChart.data.labels = newLabels;
            myPieChart.data.datasets[0].data = newDatas;
            myPieChart.update();
        })
        .catch((error) => {
            console.error('pie chart 오류 발생:', error);
        });

}, pieintervalTime);

function changeInterval_pie() {
    pieintervalTime = document.getElementById('setInterval-pie').value * 1000;
    if(pieintervalTime >= 1000) {
        clearInterval(pieintervalID);
        pieintervalID = setInterval(() => {
            let newLabels = [];
            let newDatas = [];

            fetch('/query/dbUsage')
                .then((response) => response.json())
                .then((data) => {
                    const columns = Object.keys(data);
                    for(let i=0;i<data.tables.length;i++){
                        newLabels.push(data.tables[i].columns[0]);
                        switch (data.tables[i].columns[1].slice(-2)) {
                            case "kB":
                                newDatas.push(data.tables[i].columns[1].slice(0, -2));
                                break;
                            case "MB":
                                newDatas.push(data.tables[i].columns[1].slice(0, -2) * 1024 );
                                break;
                        }
                    }
                    myPieChart.data.labels = newLabels;
                    myPieChart.data.datasets[0].data = newDatas;
                    myPieChart.update();
                })
                .catch((error) => {
                    console.error('pie chart 오류 발생:', error);
                });

        }, pieintervalTime);
    }
}