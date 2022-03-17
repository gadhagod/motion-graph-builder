const massInput = document.getElementById("mass-input")
const velocityInput = document.getElementById("velocity-input");
const timeInput = document.getElementById("time-input");
const addButton = document.getElementById("add-data-input");
const resetButton = document.getElementById("reset-btn");

const onKeyUp = (event) => {
    if (event.keyCode === 13) {
        event.preventDefault();
        addButton.click();
    }
}

const calculateAcceleration = (newV, lastV, newT, lastT) => {
    return (newV - lastV) / (newT - lastT);
}

const calculateNetForce = (mass, acceleration) => {
    return mass * acceleration;
}

const calculateMomentum = (mass, velocity) => {
    return mass * velocity;
}

const calculateKineticEnergy = (mass, velocity) => {
    return mass * Math.pow(velocity, 2);
}

const graphConfig = {
    type: "line",
    showLine: true,
    data: {
        datasets: [{
            borderColor: "rgba(0, 0, 0, 0.5)",
            pointBackgroundColor: "rgba(0, 0, 0, 0.5)",
            data: [],
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            yAxes: {
                ticks: {
                    beginAtZero: true
                },
                type: "linear",
                grid: {
                    borderColor: "rgba(0, 0, 0, 1)",
                },
                ticks: {
                    color: "black"
                }
            },
            xAxes: {
                type: "linear",
                grid: {
                    borderColor: "rgba(0, 0, 0, 1)",
                },
                ticks: {
                    color: "black"
                }
            }
        },
        plugins: {
            title: {
                display: true,
                color: "rgba(0, 0, 0, 1)"
            }
        }
    }
}

var vtGraphConfig = JSON.parse(JSON.stringify(graphConfig));
vtGraphConfig.options.plugins.title.text = "Velocity VS Time";
vtGraphConfig.data.datasets[0].label = "velocity";
vtGraphConfig.options.scales.yAxes.text = "v";
var vtGraph = new Chart(document.getElementById("vt-graph"), vtGraphConfig);

var atGraphConfig = JSON.parse(JSON.stringify(graphConfig));
atGraphConfig.options.plugins.title.text = "Acceleration VS Time";
atGraphConfig.data.datasets[0].label = "acceleration";
atGraphConfig.options.scales.yAxes.text = "a";
var atGraph = new Chart(document.getElementById("at-graph"), atGraphConfig);

var ftGraphConfig = JSON.parse(JSON.stringify(graphConfig));
ftGraphConfig.options.plugins.title.text = "Net Force VS Time";
ftGraphConfig.data.datasets[0].label = "net force";
ftGraphConfig.options.scales.yAxes.text = "ΣF";
var ftGraph = new Chart(document.getElementById("ft-graph"), ftGraphConfig);

var ptGraphConfig = JSON.parse(JSON.stringify(graphConfig));
ptGraphConfig.options.plugins.title.text = "Momentum VS Time";
ptGraphConfig.data.datasets[0].label = "momentum";
ptGraphConfig.options.scales.yAxes.text = "p";
var ptGraph = new Chart(document.getElementById("pt-graph"), ptGraphConfig);

var ektGraphConfig = JSON.parse(JSON.stringify(graphConfig));
ektGraphConfig.options.plugins.title.text = "Kinetic energy VS Time";
ektGraphConfig.data.datasets[0].label = "kinetic energy";
ektGraphConfig.options.scales.yAxes.text = "ek";
var ektGraph = new Chart(document.getElementById("ek-graph"), ektGraphConfig);

var hiddenGraph = JSON.parse(JSON.stringify(graphConfig));
document.getElementById("hidden-graph").style.display = "none";


const addData = (time, velocity) => {
    if(!time || !velocity) {
        return;
    }

    vtGraph.data.datasets[0].data.push({x: time, y: velocity});
    vtGraph.update();

    ptGraph.data.datasets[0].data.push({x: time, y: calculateMomentum(
        massInput.value,
        vtGraph.data.datasets[0].data[vtGraph.data.datasets[0].data.length-1].y
    )});
    ptGraph.update();

    ektGraph.data.datasets[0].data.push({x: time, y: calculateKineticEnergy(
        massInput.value,
        vtGraph.data.datasets[0].data[vtGraph.data.datasets[0].data.length-1].y
    )});
    ektGraph.update();

    if(vtGraph.data.datasets[0].data.length > 1) {
        atGraph.data.datasets[0].data.push({x: time, y: calculateAcceleration(
            vtGraph.data.datasets[0].data[vtGraph.data.datasets[0].data.length-1].y,
            vtGraph.data.datasets[0].data[vtGraph.data.datasets[0].data.length-2].y,
            vtGraph.data.datasets[0].data[vtGraph.data.datasets[0].data.length-1].x,
            vtGraph.data.datasets[0].data[vtGraph.data.datasets[0].data.length-2].x
        )});
        atGraph.update();

        ftGraph.data.datasets[0].data.push({x: time, y: calculateNetForce(
            massInput.value,
            atGraph.data.datasets[0].data[atGraph.data.datasets[0].data.length-1].y
        )});
        ftGraph.update();
    }
};

addButton.addEventListener("click", () => {
    addData(timeInput.value, velocityInput.value);
});
massInput.addEventListener("keyup", onKeyUp)
velocityInput.addEventListener("keyup", onKeyUp);
timeInput.addEventListener("keyup", onKeyUp); 
resetButton.addEventListener("click", () => {
    vtGraph.data.datasets[0].data = [];
    vtGraph.update();
    atGraph.data.datasets[0].data = [];
    atGraph.update();
    ftGraph.data.datasets[0].data = [];
    ftGraph.update();
    ptGraph.data.datasets[0].data = [];
    ptGraph.update();
    ektGraph.data.datasets[0].data = [];
    ektGraph.update();
})
