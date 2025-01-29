document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Puslapis užkrautas.");

  // Vartotojų sąrašas
  window.allowedUsers = [
    "arivag", "marzur", "dailub", "zilkun", "svebli", "inebun", "astbuk",
    "inegol", "eglkav", "edilen", "marmel", "enrrag", "karsra", "ugnand",
    "emirus", "valser", "raisim", "rashag", "rasjau", "ilmnor", "greval",
    "simles", "kribos", "anggel", "jurbel", "virrut", "vaizar"
  ];
  console.log("📌 Vartotojų inicialai:", window.allowedUsers);

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
