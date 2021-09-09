/* Created by Shafil Alam for LiteDoge */

window.addEventListener("load", () => {
    document.getElementById("cpu").max = navigator.hardwareConcurrency || 2;
    updateCPU();
});

function getHome() {
    return document.getElementById('home');
}

function getMine() {
    return document.getElementById('mining');
}

function showMiner() {
    getHome().style.display = "block";
    getMine().style.display = "block";
}

function updateCPU() {
    var cpu = document.getElementById("cpu").value;
    var label = document.getElementById("cpu-label");

    label.innerText = "CPU Threads - " + cpu;
}

function log(data, icon) {
    console.log(data);
    document.getElementById("console").innerHTML += `<br> <i class='bi-${icon}'></i> ${data}`;
}

function startMiner() {
    var wallet = document.getElementById("wallet").value;
    var cpu = document.getElementById("cpu").value;

    if (wallet.length === 0) {
        Swal.fire("You forgot to put a wallet address!", "You will need a wallet address so we can send you your coins.", "error");
        return;
    }

    log("Mining to address: " + wallet, "arrow-90deg-right");
    log("Mining with: " + cpu + " threads", "cpu")

    var miner = new LiteDoge({
        proxyUrl: 'ws://185.144.62.253:55299/',
        poolUrl: 'pool.ldoge-wow.com:3300', // poolUrl: 'pool.ldoge-wow.com:3300',
        username: 'dLVHCwj6KpWpMdDv8wWzLyJSaMon9viaEW', // username: `${wallet}.litedoge-webminer`, 
        password: 'x',
        authorizationFn: function (success) { log("Authorization: " + success, "box-arrow-in-left") },
        newJobFn: function (jobId) { log("New job, id#: " + jobId, "truck") },
        newDiffFn: function (diff) { log("Difficulty set to " + diff, "arrow-up-right-circle-fill") }
    });
    miner.startMiner();
    miner.connect();

    var hashrates = [];

    var chart = new Chartist.Line('.ct-chart', {
        series: hashrates,
    }, {
        low: 1,
        showArea: true,
        axisX: {
            showGrid: true,
            showLabel: true
        },
        axisY: {
            showGrid: true,
            showLabel: true
        }
    });

    setInterval(function () { hashrates.push(Math.round(miner.hashrate)); chart.update({ series: [hashrates] }); }, 1000);
    setInterval(function () { hashrates = [] }, 100000);

    setInterval(function () { document.getElementById("hashrate").innerHTML = `${Math.round(miner.hashrate)}`; }, 500);

    showMiner();
}
