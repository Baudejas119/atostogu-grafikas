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

// ✅ Užtikriname, kad loadData() yra funkcija ir pasiekiama visur
function loadData() {
    console.log("🔄 Kviečiama loadData()...");
    const section = document.getElementById("section-select").value;

    // Patikriname, ar sectionUrls yra apibrėžtas
    if (!window.sectionUrls || !window.sectionUrls[section]) {
        console.error("⚠️ Nepavyko rasti duomenų šaltinio.");
        alert("Nepavyko rasti duomenų šaltinio. Patikrinkite, ar Google Sheets nuoroda teisinga.");
        return;
    }

    const url = window.sectionUrls[section];

    // ✅ Pridedame testavimą, ar Google Sheets URL egzistuoja
    fetch(url, { method: 'HEAD' })
        .then(response => {
            if (!response.ok) {
                console.error(`⚠️ Google Sheets URL neveikia: ${url}`);
                alert("Google Sheets URL neveikia! Patikrinkite, ar failas yra viešas ir ar nuoroda teisinga.");
                return;
            }
            
            // Jei URL veikia, pradedame duomenų parsisiuntimą
            console.log(`✅ Google Sheets pasiekiamas: ${url}`);
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
        })
        .catch(error => {
            console.error(`❌ Nepavyko pasiekti Google Sheets: ${error}`);
            alert("Nepavyko pasiekti Google Sheets. Patikrinkite savo interneto ryšį arba failo prieigos nustatymus.");
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
  PTDS: "https://docs.google.com/spreadsheets/d/e/YOUR_SPREADSHEET_ID/pub?output=csv",
  PDS: "https://docs.google.com/spreadsheets/d/e/YOUR_SPREADSHEET_ID/pub?output=csv",
  Krizes: "https://docs.google.com/spreadsheets/d/e/YOUR_SPREADSHEET_ID/pub?output=csv",
  Poumis: "https://docs.google.com/spreadsheets/d/e/YOUR_SPREADSHEET_ID/pub?output=csv",
  Geronto: "https://docs.google.com/spreadsheets/d/e/YOUR_SPREADSHEET_ID/pub?output=csv",
  UmusII: "https://docs.google.com/spreadsheets/d/e/YOUR_SPREADSHEET_ID/pub?output=csv",
  UmusIII: "https://docs.google.com/spreadsheets/d/e/YOUR_SPREADSHEET_ID/pub?output=csv"
};
