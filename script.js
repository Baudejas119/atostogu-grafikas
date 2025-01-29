document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Puslapis užkrautas.");
});

function loadData() {
    console.log("🔄 Kviečiama loadData()...");

    // PAKEISK ŠĮ URL SU TIKRUOJU TAVO JSON NUORODA!
    const url = "https://raw.githubusercontent.com/vartotojas119/atostogu-grafikas/main/data.json";

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("⚠️ Nepavyko pasiekti JSON failo");
            }
            return response.json();
        })
        .then(data => {
            console.log("✅ Duomenys įkelti!", data);
            const formattedData = data.map(row => [
                row.darbuotojas,
                new Date(row.pradzia),
                new Date(row.pabaiga)
            ]);
            drawChart(formattedData);
        })
        .catch(error => {
            console.error("❌ Klaida įkeliant duomenis:", error);
        });
}

function checkLogin() {
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

window.allowedUsers = ["arivag", "marzur", "dailub", "zilkun"];

google.charts.load('current', { packages: ['timeline'] });
google.charts.setOnLoadCallback(() => loadData());

function drawChart(data) {
    console.log("📊 Braižomas grafikas su duomenimis:", data);
    
    const container = document.getElementById("timeline");
    const chart = new google.visualization.Timeline(container);
    const dataTable = new google.visualization.DataTable();
    
    dataTable.addColumn({ type: 'string', id: 'Darbuotojas' });
    dataTable.addColumn({ type: 'date', id: 'Pradžia' });
    dataTable.addColumn({ type: 'date', id: 'Pabaiga' });

    data.forEach(row => dataTable.addRow(row));

    const options = {
        timeline: { groupByRowLabel: true },
        height: Math.max(data.length * 50, 400),
        width: '100%'
    };

    chart.draw(dataTable, options);
}
