function drawChart(data) {
    if (!google.visualization) {
        console.error("⚠️ Google Charts neįkeltas.");
        return;
    }

    console.log("📊 Braižomas grafikas su duomenimis:", data);
    
    const container = document.getElementById("timeline");

    // 🛠️ Pilnai išvalome seną grafiką ir priverstinai nustatome dydį
    container.innerHTML = "";
    container.style.width = "100%";
    container.style.height = "500px";  // Fiksuotas aukštis, kad nesiplėstų

    const chart = new google.visualization.Timeline(container);
    const dataTable = new google.visualization.DataTable();
    
    dataTable.addColumn({ type: 'string', id: 'Darbuotojas' });
    dataTable.addColumn({ type: 'date', id: 'Pradžia' });
    dataTable.addColumn({ type: 'date', id: 'Pabaiga' });

    data.forEach(row => dataTable.addRow(row));

    const options = {
        timeline: { groupByRowLabel: true },
        height: 500,  // 🔹 Fiksuotas aukštis
        width: '100%', // 🔹 Plotis fiksuotas prie puslapio
        minWidth: 1200, 
        avoidOverlappingGridLines: false
    };

    chart.draw(dataTable, options);

    // 🔹 Užtikriname, kad grafikas neturėtų perteklinio aukščio
    setTimeout(() => {
        if (container.firstChild) {
            container.firstChild.style.height = "500px";
        }
    }, 100);
}
