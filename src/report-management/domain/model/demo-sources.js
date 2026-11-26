export const reportSources = ['Consulta Vehicular', 'SOAT', 'SBS Accidentes'];

export function demoFindings(plate, date = new Date().toISOString().slice(0, 10)) {
  return [
    {source: reportSources[0], dateChecked: date, result: 'Vehículo registrado', summary: `Placa ${plate}. Marca Toyota, modelo Hiace, año 2022. `, evidence: 'Ficha vehicular', simulated: true},
    {source: reportSources[1], dateChecked: date, result: 'SOAT vigente', summary: 'Póliza 2026-0142. Vigencia hasta 31/12/2026.', evidence: 'Certificado SOAT', simulated: true},
    {source: reportSources[2], dateChecked: date, result: 'Sin accidentes registrados', summary: 'No se encontraron eventos en el historial de esta placa.', evidence: 'Historial SBS', simulated: true}
  ];
}

export function findingsForReport(report) {
  const fallback = demoFindings(report.plate, report.requestedAt?.slice(0, 10) || undefined);
  return reportSources.map((source, index) => report.findings.find(item => item.source === source) || fallback[index]);
}
