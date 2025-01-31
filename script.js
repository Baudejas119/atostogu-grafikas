document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ Puslapis užkrautas.");
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

// ✅ Prisijungimo funkcija
window.checkLogin = function checkLogin() {
    console.log("🟡 Vykdoma checkLogin() funkcija...");
    document.getElementById("login-container").classList.add("hidden");
    document.getElementById("main-content").classList.remove("hidden");

    google.charts.load('current', { packages: ['timeline'] });
    google.charts.setOnLoadCallback(() => loadData());
};

// ✅ Duomenų įkėlimo funkcija
window.loadData = function loadData() {
    console.log("🔄 Kviečiama loadData()...");
    const section = document.getElementById("section-select").value;
    const url = window.sectionUrls[section];

    console.log("🔗 Pasirinkto skyriaus URL:", url);

    if (!url) {
        console.error("⚠️ Nėra duomenų šiam skyriui.");
        return;
    }

    Papa.parse(url, {
        download: true,
        header: true,
        complete: function (results) {
            console.log("✅ Duomenys įkelti!", results.data);
            window.originalData = results.data.map(row => {
                if (row["Darbuotojas"] && row["Pradžia"] && row["Pabaiga"]) {
                    return [row["Darbuotojas"], new Date(row["Pradžia"]), new Date(row["Pabaiga"])];
                } else {
                    return null;
                }
            }).filter(row => row !== null);

            google.charts.setOnLoadCallback(() => drawChart(window.originalData));
        },
        error: function (error) {
            console.error("❌ Klaida įkeliant duomenis:", error);
        }
    });
};

// ✅ Grafiko braižymo funkcija
window.drawChart = function drawChart(data) {
    console.log("📊 Braižomas grafikas su duomenimis:", data);
    const container = document.getElementById("timeline");
    container.innerHTML = "";

    const chart = new google.visualization.Timeline(container);
    const dataTable = new google.visualization.DataTable();

    dataTable.addColumn({ type: 'string', id: 'Darbuotojas' });
    dataTable.addColumn({ type: 'date', id: 'Pradžia' });
    dataTable.addColumn({ type: 'date', id: 'Pabaiga' });

    data.forEach(row => dataTable.addRow(row));

    const options = {
        timeline: { groupByRowLabel: true },
        height: 500,
        width: '100%',
        minWidth: 1200,
        avoidOverlappingGridLines: false
    };

    chart.draw(dataTable, options);
};
