google.charts.load("current", { packages: ["timeline", "calendar"], language: "lt" });

let originalData = [];
let dailyCounts = [];
let dataTable;
let chart;

google.charts.setOnLoadCallback(() => loadData('PTDS'));

function changeSection(section) {
  const selectedUrl = sectionUrls[section];
  if (selectedUrl) {
    loadData(section);
  } else {
    console.error('Nepavyko rasti skyriaus duomenų.');
  }
}

function loadData(section) {
  const spreadsheetUrl = sectionUrls[section];
  fetch(spreadsheetUrl)
    .then(response => response.text())
    .then(csvText => {
      parseAndRenderData(csvText);
    })
    .catch(error => {
      document.getElementById('timeline').innerHTML = '<p class="error-message">Nepavyko įkelti duomenų. Patikrinkite duomenų šaltinį.</p>';
      console.error('Klaida įkeliant duomenis iš Google Sheets:', error);
    });
}

function parseAndRenderData(csvText) {
  dataTable = new google.visualization.DataTable();
  dataTable.addColumn({ type: 'string', id: 'Darbuotojas' });
  dataTable.addColumn({ type: 'string', id: 'Atostogų laikotarpis' });
  dataTable.addColumn({ type: 'date', id: 'Pradžia' });
  dataTable.addColumn({ type: 'date', id: 'Pabaiga' });

  const rows = csvText.split('\n').slice(1).map(row => row.split(','));
  const allDates = {};

  originalData = [];
  rows.forEach(row => {
    if (row.length >= 3) {
      const employee = row[0].trim();
      const startDate = new Date(row[1].trim());
      const endDate = new Date(row[2].trim());
      if (!isNaN(startDate) && !isNaN(endDate)) {
        const startLabel = `${startDate.getMonth() + 1}.${startDate.getDate()}`;
        const endLabel = `${endDate.getMonth() + 1}.${endDate.getDate()}`;
        const periodLabel = `${startLabel}-${endLabel}`;
        dataTable.addRow([employee, periodLabel, startDate, endDate]);
        originalData.push([employee, periodLabel, startDate, endDate]);

        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
          const dateKey = d.toISOString().split('T')[0];
          allDates[dateKey] = (allDates[dateKey] || 0) + 1;
        }
      }
    }
  });

  dailyCounts = Object.entries(allDates).map(([date, count]) => [new Date(date), count]);
  drawChart('all');
  drawCalendar();
}

function drawChart(month) {
  chart = chart || new google.visualization.Timeline(document.getElementById('timeline'));
  const filteredData = new google.visualization.DataTable();

  filteredData.addColumn({ type: 'string', id: 'Darbuotojas' });
  filteredData.addColumn({ type: 'string', id: 'Atostogų laikotarpis' });
  filteredData.addColumn({ type: 'date', id: 'Pradžia' });
  filteredData.addColumn({ type: 'date', id: 'Pabaiga' });

  originalData.forEach(row => {
    const startDate = row[2];
    const endDate = row[3];
    if (month === 'all' || (startDate.getMonth() <= month && endDate.getMonth() >= month)) {
      filteredData.addRow(row);
    }
  });

  chart.draw(filteredData, {
    height: Math.min(originalData.length * 50, 600),
    timeline: { groupByRowLabel: true }
  });
}

function drawCalendar() {
  const calendar = new google.visualization.Calendar(document.getElementById('calendar'));
  const calendarData = new google.visualization.DataTable();
  calendarData.addColumn({ type: 'date', id: 'Date' });
  calendarData.addColumn({ type: 'number', id: 'Count' });

  calendarData.addRows(dailyCounts);

  calendar.draw(calendarData, {
    title: "Atostogų Intensyvumas",
    height: 350
  });
}
