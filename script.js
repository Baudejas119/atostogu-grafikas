document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ Puslapis užkrautas.");

    // Enter klavišo palaikymas prisijungimo laukelyje
    document.getElementById("user-input").addEventListener("keyup", function(event) {
        if (event.key === "Enter") {
            checkLogin();
        }
    });
});

// Google Sheets nuorodos kiekvienam skyriui
window.sectionUrls = {
    PTDS: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRRaaILMyXpOFmATf6QC7JnJVYwRPKOjXZkL8jOgMeZI64aulzlnk7f-cbpNmog90kmLefeLN3E3tiT/pub?gid=0&output=csv",
    PDS: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRRaaILMyXpOFmATf6QC7JnJVYwRPKOjXZkL8jOgMeZI64aulzlnk7f-cbpNmog90kmLefeLN3E3tiT/pub?gid=1629487051&output=csv",
    Krizes: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRRaaILMyXpOFmATf6QC7JnJVYwRPKOjXZkL8jOgMeZI64aulzlnk7f-cbpNmog90kmLefeLN3E3tiT/pub?gid=1394934574&output=csv",
    Poumis: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRRaaILMyXpOFmATf6QC7JnJVYwRPKOjXZkL8jOgMeZI64aulzlnk7f-cbpNmog90kmLefeLN3E3tiT/pub?gid=1919414918&output=csv",
    Geronto: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRRaaILMyXpOFmATf6QC7JnJVYwRPKOjXZkL8jOgMeZI64aulzlnk7f-cbpNmog90kmLefeLN3E3tiT/pub?gid=817893722&output=csv",
    UmusII: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRRaaILMyXpOFmATf6QC7JnJVYwRPKOjXZkL8jOgMeZI64aulzlnk7f-cbpNmog90kmLefeLN3E3tiT/pub?gid=780455392&output=csv",
    UmusIII: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRRaaILMyXpOFmATf6QC7JnJVYwRPKOjXZkL8jOgMeZI64aulzlnk7f-cbpNmog90kmLefeLN3E3tiT/pub?gid=1192833202&output=csv"
};

window.checkLogin = function checkLogin() {
    console.log("🟡 Vykdoma checkLogin() funkcija...");
    document.getElementById("login-container").classList.add("hidden");
    document.getElementById("main-content").classList.remove("hidden");

    google.charts.load('current', { packages: ['timeline'] });
    google.charts.setOnLoadCallback(() => loadData());
};

window.loadData = function loadData() {
    console.log("🔄 Kviečiama loadData()...");
    const section = document.getElementById("section-select").value;
    const url = window.sectionUrls[section];

    if (!url) {
        console.error("⚠️ Nėra duomenų šiam skyriui.");
        return;
    }

    Papa.parse(url, {
        download: true,
        header: true,
        complete: function (results) {
            window.originalData = results.data.map(row => row["Darbuotojas"] && row["Pradžia"] && row["Pabaiga"] ? [row["Darbuotojas"], new Date(row["Pradžia"]), new Date(row["Pabaiga"])] : null).filter(row => row);
            google.charts.setOnLoadCallback(() => drawChart(window.originalData));
        }
    });
};

window.filterByMonth = function filterByMonth(month) {
    const year = new Date().getFullYear();
    const filteredData = month === 'all' ? window.originalData : window.originalData.filter(row => (row[1].getMonth() == month || row[2].getMonth() == month));
    drawChart(filteredData);
};

window.drawChart = function drawChart(data) {
    const chart = new google.visualization.Timeline(document.getElementById("timeline"));
    const dataTable = new google.visualization.DataTable();
    dataTable.addColumn({ type: 'string', id: 'Darbuotojas' });
    dataTable.addColumn({ type: 'date', id: 'Pradžia' });
    dataTable.addColumn({ type: 'date', id: 'Pabaiga' });
    data.forEach(row => dataTable.addRow(row));
    chart.draw(dataTable, { timeline: { groupByRowLabel: true }, height: 500, width: '100%' });
};
