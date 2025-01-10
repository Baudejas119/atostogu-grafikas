google.charts.load("current", { packages: ["timeline"], language: "lt" });
google.charts.setOnLoadCallback(() => loadData("PTDS"));

const sectionUrls = {
  PTDS: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRRaaILMyXpOFmATf6QC7JnJVYwRPKOjXZkL8jOgMeZI64aulzlnk7f-cbpNmog90kmLefeLN3E3tiT/pub?gid=0&output=csv",
  PDS: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRRaaILMyXpOFmATf6QC7JnJVYwRPKOjXZkL8jOgMeZI64aulzlnk7f-cbpNmog90kmLefeLN3E3tiT/pub?gid=1629487051&output=csv",
  Krizes: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRRaaILMyXpOFmATf6QC7JnJVYwRPKOjXZkL8jOgMeZI64aulzlnk7f-cbpNmog90kmLefeLN3E3tiT/pub?gid=1394934574&output=csv",
  Poumis: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRRaaILMyXpOFmATf6QC7JnJVYwRPKOjXZkL8jOgMeZI64aulzlnk7f-cbpNmog90kmLefeLN3E3tiT/pub?gid=1919414918&output=csv",
  Geronto: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRRaaILMyXpOFmATf6QC7JnJVYwRPKOjXZkL8jOgMeZI64aulzlnk7f-cbpNmog90kmLefeLN3E3tiT/pub?gid=817893722&output=csv",
  UmusII: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRRaaILMyXpOFmATf6QC7JnJVYwRPKOjXZkL8jOgMeZI64aulzlnk7f-cbpNmog90kmLefeLN3E3tiT/pub?gid=780455392&output=csv",
  UmusIII: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRRaaILMyXpOFmATf6QC7JnJVYwRPKOjXZkL8jOgMeZI64aulzlnk7f-cbpNmog90kmLefeLN3E3tiT/pub?gid=1192833202&output=csv"
};

let originalData = [];

function loadData() {
  const section = document.getElementById("section-select").value;
  const url = sectionUrls[section];

  Papa.parse(url, {
    download: true,
    header: true,
    complete: function(results) {
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
    error: function(error) {
      console.error("Klaida įkeliant duomenis:", error);
    }
  });
}

function filterByMonth(month) {
  const filteredData = month === 'all' ? originalData : originalData.filter(row => {
    const startMonth = row[1].getMonth();
    const endMonth = row[2].getMonth();
    return startMonth <= month && endMonth >= month;
  });
  drawChart(filteredData);
}

function drawChart(data) {
  const container = document.getElementById('timeline');
  const chart = new google.visualization.Timeline(container);
  const dataTable = new google.visualization.DataTable();

  dataTable.addColumn({ type: 'string', id: 'Darbuotojas' });
  dataTable.addColumn({ type: 'date', id: 'Pradžia' });
  dataTable.addColumn({ type: 'date', id: 'Pabaiga' });

  const yearStart = new Date(new Date().getFullYear(), 0, 1);
  const yearEnd = new Date(new Date().getFullYear(), 11, 31);

  data.forEach(row => dataTable.addRow(row));

  const options = {
    timeline: { groupByRowLabel: true },
    height: Math.max(data.length * 50, 400),
    width: '100%',
    hAxis: {
      minValue: yearStart,
      maxValue: yearEnd
    }
  };

  chart.draw(dataTable, options);
}
