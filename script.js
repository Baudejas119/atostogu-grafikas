// script.js

document.addEventListener("DOMContentLoaded", () => {
  const allowedUsers = [
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
  google.charts.load("current", { packages: ["timeline"], language: "lt" });
});

function checkLogin() {
  const input = document.getElementById("user-input").value.trim().toLowerCase();
  if (allowedUsers.includes(input)) {
    document.getElementById("login-container").classList.add("hidden");
    document.getElementById("main-content").classList.remove("hidden");
    google.charts.setOnLoadCallback(loadData);
  } else {
    document.getElementById("error-message").classList.remove("hidden");
  }
}

function loadData() {
  console.log("loadData() kviečiama...");
  const section = document.getElementById("section-select").value;
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

function filterByMonth(month) {
  console.log("Filtruojamas mėnuo:", month);
  let filteredData;
  let monthStart, monthEnd;

  if (month === 'all') {
    filteredData = originalData;
    monthStart = new Date(new Date().getFullYear(), 0, 1);
    monthEnd = new Date(new Date().getFullYear(), 11, 31);
  } else {
    const year = new Date().getFullYear();
    monthStart = new Date(year, month, 1);
    monthEnd = new Date(year, month + 1, 0);
    filteredData = originalData.filter(row => {
      const start = row[1];
      const end = row[2];
      return (
        (start >= monthStart && start <= monthEnd) ||
        (end >= monthStart && end <= monthEnd) ||
        (start <= monthStart && end >= monthEnd)
      );
    });
  }

  drawChart(filteredData, monthStart, monthEnd);
}

function drawChart(data, monthStart, monthEnd) {
  const container = document.getElementById('timeline');
  const chart = new google.visualization.Timeline(container);
  const dataTable = new google.visualization.DataTable();

  dataTable.addColumn({ type: 'string', id: 'Darbuotojas' });
  dataTable.addColumn({ type: 'date', id: 'Pradžia' });
  dataTable.addColumn({ type: 'date', id: 'Pabaiga' });

  data.forEach(row => dataTable.addRow(row));

  const options = {
    timeline: { groupByRowLabel: true },
    height: Math.max(data.length * 50, 400),
    width: '100%',
    hAxis: {
      minValue: monthStart,
      maxValue: monthEnd,
    }
  };

  chart.draw(dataTable, options);
}
