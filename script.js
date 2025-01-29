<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="styles.css">
  <script src="https://www.gstatic.com/charts/loader.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.2/papaparse.min.js"></script>
  <script src="script.js" defer></script>
</head>
<body>
  <div id="login-container">
    <h1>Prisijungimas</h1>
    <p>Įveskite savo inicialus (pirmas 3 vardo ir pirmas 3 pavardės raides, be lietuviškų raidžių)</p>
    <input type="text" id="user-input" placeholder="pvz., arivag">
    <button onclick="checkLogin()">Prisijungti</button>
    <p id="error-message" class="hidden">Neteisingi inicialai!</p>
  </div>

  <div id="main-content" class="hidden">
    <h1>Specialistų atostogų grafikas</h1>
    <div id="controls">
      <label for="section-select">Pasirinkite skyrių:</label>
      <select id="section-select" onchange="loadData()">
        <option value="PTDS">PTDS</option>
        <option value="PDS">PDS</option>
        <option value="Krizes">Krizės</option>
        <option value="Poumis">Poūmis</option>
        <option value="Geronto">Geronto</option>
        <option value="UmusII">Ūmus II</option>
        <option value="UmusIII">Ūmus III</option>
      </select>
      <div>
        <button onclick="filterByMonth('all')">Visi metai</button>
        <button onclick="filterByMonth(0)">Sausis</button>
        <button onclick="filterByMonth(1)">Vasaris</button>
        <button onclick="filterByMonth(2)">Kovas</button>
        <button onclick="filterByMonth(3)">Balandis</button>
        <button onclick="filterByMonth(4)">Gegužė</button>
        <button onclick="filterByMonth(5)">Birželis</button>
        <button onclick="filterByMonth(6)">Liepa</button>
        <button onclick="filterByMonth(7)">Rugpjūtis</button>
        <button onclick="filterByMonth(8)">Rugsėjis</button>
        <button onclick="filterByMonth(9)">Spalis</button>
        <button onclick="filterByMonth(10)">Lapkritis</button>
        <button onclick="filterByMonth(11)">Gruodis</button>
      </div>
    </div>
    <div id="timeline-frame">
      <div id="timeline"></div>
    </div>
  </div>
  <script>
    const allowedUsers = [
      "arivag", "marzur", "dailub", "zilkun", "svebli", "inebun", "astbuk",
      "inegol", "eglkav", "edilen", "marmel", "enrrag", "karsra", "ugnand",
      "emirus", "valser", "raisim", "rashag", "rasjau", "ilmnor", "greval",
      "simles", "kribos", "anggel", "jurbel", "virrut", "vaizar"
    ];

    function checkLogin() {
      const input = document.getElementById("user-input").value.trim().toLowerCase();
      if (allowedUsers.includes(input)) {
        document.getElementById("login-container").classList.add("hidden");
        document.getElementById("main-content").classList.remove("hidden");
      } else {
        document.getElementById("error-message").classList.remove("hidden");
      }
    }
  </script>
</body>
</html>
