document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ Puslapis užkrautas.");
});

// Google Sheets nuorodos kiekvienam skyriui
window.sectionUrls = {
    PTDS: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRRaaILMyXpOFmATf6QC7JnJVYwRPKOjXZkL8jOgMeZI64aulzlnk7f-cbpNmog90kmLefeLN3E3tiT/pub?gid=0&output=csv",
    PDS: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRRaaILMyXpOFmATf6QC7JnJVYwRPKOjXZkL8jOgMeZI64aulzlnk7f-cbpNmog90kmLefeLN3E3tiT/pub?gid=1629487051&output=csv"
};

// ✅ Registruojame funkcijas globaliame `window` objekte
window.checkLogin = function checkLogin() {
    console.log("🟡 Vykdoma checkLogin() funkcija...");
    const input = document.getElementById("user-input").value.trim().toLowerCase();

    if (window.allowedUsers.includes(input)) {
        console.log("✅ Prisijungimas sėkmingas!");
        document.getElementById("login-container").classList.add("hidden");
        document.getElementById("main-content").classList.remove("hidden");

        google.charts.load('current', { packages: ['timeline'] });
        google.charts.setOnLoadCallback(() => loadData());
    } else {
        console.warn("❌ Neteisingi inicialai.");
        document.getElementById("error-message").classList.remove("hidden");
    }
}

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
            console.log("✅ Duomenys įkelti!", results.data);
            window.originalData = results.data.map(row => {
                if (row["Darbuotojas"] && row["Pradžia"] && row["Pabaiga"]) {
                    return [row["Darbuotojas"], new Date(row["Pradžia"]), new Date(row["Pabaiga"])];
                } else {
                    console.warn("⚠️ Praleistas įrašas dėl trūkstamų duomenų:", row);
                    return null;
                }
            }).filter(row => row !== null);

            google.charts.setOnLoadCallback(() => drawChart(window.originalData));
        },
        error: function (error) {
            console.error("❌ Klaida įkeliant duomenis:", error);
        }
    });
}

// ✅ Užtikriname, kad `drawChart()` irgi bus pasiekiamas HTML
window.drawChart = function drawChart(data) {
    if (!google.visualization) {
        console.error("⚠️ Google Charts neįkeltas.");
        return;
    }

    console.log("📊 Braižomas grafikas su duomenimis:", data);
    
    const container = document.getElementById("timeline");

    container.innerHTML = "";
    container.style.width = "100%";
    container.style.height = "500px";

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

    setTimeout(() => {
        if (container.firstChild) {
            container.firstChild.style.height = "500px";
        }
    }, 100);
}

window.allowedUsers = ["arivag", "marzur", "dailub", "zilkun"];
