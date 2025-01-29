document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Puslapis užkrautas.");
});

function loadData() {
    console.log("🔄 Kviečiama loadData()...");

    // PAKEISTAS URL SU RAW VERSIJA
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

// Prisijungimas
function checkLogin() {
    console.log("🟡 Vykdoma checkLogin() funkcija...");
    const input = document.getElementById("user-input").value.trim().toLowerCase();
    
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

// ✅ Globalus vartotojų sąrašas (jei reikia)
window.allowedUsers = ["arivag", "marzur", "dailub", "zilkun"];
