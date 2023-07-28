function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var ctx = document.getElementById("myPieChart");
var myPieChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ["DM 데이터베이스", "TM 데이터베이스", "SI 데이터베이스", "MS 데이터베이스"],
        datasets: [{
            data: [55, 30, 15, 20],
            backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e'],
            hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf', '#dda20a'],
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

setInterval(() => {
    const newData = [getRandomNumber(15, 30), getRandomNumber(15, 30), getRandomNumber(15, 30), getRandomNumber(15, 30)];
    myPieChart.data.datasets[0].data = newData;
    myPieChart.update();
}, 1000);