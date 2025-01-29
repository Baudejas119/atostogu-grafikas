// Patikriname, ar dokumentas pilnai užkrautas
document.addEventListener("DOMContentLoaded", () => {
  console.log("Puslapis užkrautas.");

  // Vartotojų sąrašas
  window.allowedUsers = [
    "arivag", "marzur", "dailub", "zilkun", "svebli", "inebun", "astbuk",
    "inegol", "eglkav", "edilen", "marmel", "enrrag", "karsra", "ugnand",
    "emirus", "valser", "raisim", "rashag", "rasjau", "ilmnor", "greval",
    "simles", "kribos", "anggel", "jurbel", "virrut", "vaizar"
  ];

  document.getElementById("user-input").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      checkLogin();
    }
  });

  document.getElementById("error-message").classList.add("hidden");
});

// Prisijungimo tikrinimas
function checkLogin() {
  const input = document.getElementById("user-input").value.trim().toLowerCase();
  console.log("Tikrinami inicialai:", input);

  if (window.allowedUsers.includes(input)) {
    document.getElementById("login-container").classList.add("hidden");
    document.getElementById("main-content").classList.remove("hidden");

    console.log("Vartotojas patvirtintas, įkeliami duomenys...");
    google.charts.load("current", { packages: ["timeline"], language: "lt" });
    google.charts.setOnLoadCallback(loadData);
  } else {
    document.getElementById("error-message").classList.remove("hidden");
    console.warn("Neteisingi inicialai.");
  }
}

// URL sąrašas (būtinai reikia!)
const sectionUrls = {
  PTDS: "https://docs.google.com/spreadsheets/d/e/.../output=csv",
  PDS: "https://docs.google.com/spreadsheets/d/e/.../output=csv",
  Krizes: "https://docs.google.com/spreadsheets/d/e/.../output=csv",
  Poumis: "https://docs.google.com/spreadsheets/d/e/.../output=csv",
  Geronto: "https://docs.google.com/spreadsheets/d/e/.../output=csv",
  UmusII: "https://docs.google.com/spreadsheets/d/e/.../output=csv",
  UmusIII: "https://docs.google.com/spreadsheets/d/e/.../output=csv"
};

// Duomenų užkrovimo funkcija
function loadData() {
  console.log("loadData() kviečiama...");
  const section = document.getElementById("section-select").value;
  if (!sectionUrls[section]) {
    console.error("Nepavyko rasti duomenų šaltinio.");
    return;
  }
  const url = sectionUrls[section];

  Papa.parse(url, {
    download: true,
    header: true,
    complete: function (results) {
      originalData = results.data.map(row => {
        if (row["Darbuotojas"] && row["Pradžia"] && row["Pabaiga"]) {
          return [
            row["Darbuotojas"],
            new Date(row["Pradžia"]),
            new Date(row["Pabaiga"])
          ];
        } else {
          console.warn("Praleistas įrašas dėl trūkstamų duomenų:", row);
          return null;
        }
      }).filter(row => row !== null);
      drawChart(originalData);
    },
    error: function (error) {
      console.error("Klaida įkeliant duomenis:", error);
    }
  });
}
