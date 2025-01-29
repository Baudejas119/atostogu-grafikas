document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Puslapis užkrautas.");

  // ✅ Užtikriname, kad vartotojai matomi globaliai
  window.allowedUsers = [
    "arivag", "marzur", "dailub", "zilkun", "svebli", "inebun", "astbuk",
    "inegol", "eglkav", "edilen", "marmel", "enrrag", "karsra", "ugnand",
    "emirus", "valser", "raisim", "rashag", "rasjau", "ilmnor", "greval",
    "simles", "kribos", "anggel", "jurbel", "virrut", "vaizar"
  ];
  console.log("📌 Vartotojų inicialai:", window.allowedUsers);
});

// ✅ Užtikriname, kad loadData() yra funkcija ir pasiekiama visur
function loadData() {
    console.log("🔄 Kviečiama loadData()...");
    const section = document.getElementById("section-select").value;

    // Jei nėra sekcijos duomenų, išmetame klaidą
    if (!window.sectionUrls || !window.sectionUrls[section]) {
        console.error("⚠️ Nepavyko rasti duomenų šaltinio.");
        return;
    }

    const url = window.sectionUrls[section];

    Papa.parse(url, {
        download: true,
        header: true,
        complete: function (results) {
            console.log("✅ Duomenys įkelti!");
            window.originalData = results.data.map(row => {
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
            drawChart(window.originalData);
        },
        error: function (error) {
            console.error("❌ Klaida įkeliant duomenis:", error);
        }
    });
}

// ✅ Užtikriname, kad prisijungimo funkcija gali pasiekti loadData()
function checkLogin() {
  console.log("🟡 Vykdoma checkLogin() funkcija...");
  
  const input = document.getElementById("user-input").value.trim().toLowerCase();
  console.log("🟡 Tikrinami inicialai:", input);
  
  if (window.allowedUsers.includes(input)) {
    console.log("✅ Prisijungimas sėkmingas!");
    
    document.getElementById("login-container").classList.add("hidden");
    document.getElementById("main-content").classList.remove("hidden");

    // ✅ Užkrauname Google Charts ir loadData() tik po prisijungimo
    google.charts.load("current", { packages: ["timeline"], language: "lt" });
    google.charts.setOnLoadCallback(loadData);
  } else {
    console.warn("❌ Neteisingi inicialai.");
    document.getElementById("error-message").classList.remove("hidden");
  }
}

// ✅ Užtikriname, kad `sectionUrls` yra globalus objektas
window.sectionUrls = {
  PTDS: "https://docs.google.com/spreadsheets/d/e/.../output=csv",
  PDS: "https://docs.google.com/spreadsheets/d/e/.../output=csv",
  Krizes: "https://docs.google.com/spreadsheets/d/e/.../output=csv",
  Poumis: "https://docs.google.com/spreadsheets/d/e/.../output=csv",
  Geronto: "https://docs.google.com/spreadsheets/d/e/.../output=csv",
  UmusII: "https://docs.google.com/spreadsheets/d/e/.../output=csv",
  UmusIII: "https://docs.google.com/spreadsheets/d/e/.../output=csv"
};
