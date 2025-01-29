document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Puslapis užkrautas.");

  window.allowedUsers = [
    "arivag", "marzur", "dailub", "zilkun", "svebli", "inebun", "astbuk",
    "inegol", "eglkav", "edilen", "marmel", "enrrag", "karsra", "ugnand",
    "emirus", "valser", "raisim", "rashag", "rasjau", "ilmnor", "greval",
    "simles", "kribos", "anggel", "jurbel", "virrut", "vaizar"
  ];
  console.log("📌 Vartotojų inicialai:", window.allowedUsers);
});

// ✅ Užtikriname, kad loadData() būtų globali funkcija
function loadData() {
    console.log("🔄 Kviečiama loadData()...");
    const section = document.getElementById("section-select").value;
    if (!sectionUrls[section]) {
        console.error("⚠️ Nepavyko rasti duomenų šaltinio.");
        return;
    }
    const url = sectionUrls[section];

    Papa.parse(url, {
        download: true,
        header: true,
        complete: function (results) {
            console.log("✅ Duomenys įkelti!");
            originalData = results.data.map(row => {
                if (row["Darbuotojas"] && row["Pradžia"] && row["Pabaiga"]) {
                    return [
                        row["Darbuotojas"],
                        new Date(row["Pradžia"]),
                        new Date(row["Pabaiga"])
                    ];
                } else {
                    console.warn("⚠️ Praleistas įrašas dėl trūkstamų duomenų:", row);
                    return null;
                }
            }).filter(row => row !== null);
            drawChart(originalData);
        },
        error: function (error) {
            console.error("❌ Klaida įkeliant duomenis:", error);
        }
    });
}

// ✅ Patikriname, ar checkLogin() kviečia loadData() teisingai
function checkLogin() {
  console.log("🟡 Vykdoma checkLogin() funkcija...");
  
  const input = document.getElementById("user-input").value.trim().toLowerCase();
  console.log("🟡 Tikrinami inicialai:", input);
  
  if (window.allowedUsers.includes(input)) {
    console.log("✅ Prisijungimas sėkmingas!");
    
    document.getElementById("login-container").classList.add("hidden");
    document.getElementById("main-content").classList.remove("hidden");

    google.charts.load("current", { packages: ["timeline"], language: "lt" });
    google.charts.setOnLoadCallback(loadData);
  } else {
    console.warn("❌ Neteisingi inicialai.");
    document.getElementById("error-message").classList.remove("hidden");
  }
}
