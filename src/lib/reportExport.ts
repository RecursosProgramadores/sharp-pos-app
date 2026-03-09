import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { exportAoaToExcel } from "@/lib/excelExport";

type TableData = { headers: string[]; rows: (string | number)[][] };
type Section = { title: string; tables: TableData[]; summary?: Record<string, string | number> };

const PERIOD_LABELS: Record<string, string> = {
  today: "Hoy",
  yesterday: "Ayer",
  week: "Esta semana",
  lastweek: "Semana pasada",
  month: "Este mes",
  lastmonth: "Mes pasado",
  quarter: "Últimos 3 meses",
  year: "Año actual",
};

// ── PDF Export ──
export function exportToPDF(title: string, sections: Section[], period: string) {
  const doc = new jsPDF({ orientation: "landscape" });
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFillColor(30, 30, 30);
  doc.rect(0, 0, pageWidth, 28, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(title, 14, 16);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Período: ${PERIOD_LABELS[period] || period} | Generado: ${new Date().toLocaleString("es-PE")}`, 14, 24);

  let y = 36;

  sections.forEach((section) => {
    // Check if we need a new page
    if (y > doc.internal.pageSize.getHeight() - 40) {
      doc.addPage();
      y = 20;
    }

    // Section title
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text(section.title, 14, y);
    y += 6;

    // Summary KPIs
    if (section.summary) {
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      const entries = Object.entries(section.summary);
      const cols = Math.min(entries.length, 4);
      const colW = (pageWidth - 28) / cols;
      entries.forEach(([key, val], i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        doc.setTextColor(120, 120, 120);
        doc.text(key, 14 + col * colW, y + row * 12);
        doc.setTextColor(30, 30, 30);
        doc.setFont("helvetica", "bold");
        doc.text(String(val), 14 + col * colW, y + row * 12 + 5);
        doc.setFont("helvetica", "normal");
      });
      y += Math.ceil(entries.length / cols) * 12 + 4;
    }

    // Tables
    section.tables.forEach((table) => {
      if (table.rows.length === 0) return;
      autoTable(doc, {
        startY: y,
        head: [table.headers],
        body: table.rows.map((r) => r.map(String)),
        theme: "grid",
        headStyles: { fillColor: [50, 50, 50], textColor: [255, 255, 255], fontSize: 8 },
        bodyStyles: { fontSize: 8 },
        styles: { cellPadding: 2 },
        margin: { left: 14, right: 14 },
      });
      y = (doc as any).lastAutoTable.finalY + 10;
    });
  });

  // Footer on each page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Página ${i} de ${pageCount}`, pageWidth - 40, doc.internal.pageSize.getHeight() - 8);
  }

  doc.save(`${title.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`);
}

// ── Excel Export ──
export function exportToExcel(title: string, sections: Section[], period: string) {
  const wb = XLSX.utils.book_new();

  sections.forEach((section, idx) => {
    const sheetData: (string | number)[][] = [];

    // Header info
    sheetData.push([section.title]);
    sheetData.push([`Período: ${PERIOD_LABELS[period] || period}`, `Generado: ${new Date().toLocaleString("es-PE")}`]);
    sheetData.push([]);

    // Summary
    if (section.summary) {
      Object.entries(section.summary).forEach(([k, v]) => {
        sheetData.push([k, v]);
      });
      sheetData.push([]);
    }

    // Tables
    section.tables.forEach((table) => {
      sheetData.push(table.headers);
      table.rows.forEach((r) => sheetData.push(r));
      sheetData.push([]);
    });

    const sheetName = section.title.substring(0, 30).replace(/[\\/*?[\]:]/g, "");
    const ws = XLSX.utils.aoa_to_sheet(sheetData);

    // Auto-width columns
    const colWidths = (sheetData[0] || []).map((_, colIdx) => {
      const maxLen = sheetData.reduce((max, row) => {
        const cell = row[colIdx];
        return Math.max(max, cell != null ? String(cell).length : 0);
      }, 10);
      return { wch: Math.min(maxLen + 2, 40) };
    });
    ws["!cols"] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, sheetName || `Hoja${idx + 1}`);
  });

  XLSX.writeFile(wb, `${title.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.xlsx`);
}

// ── Report Data Formatters ──

export function buildExecutiveSections(data: any): Section[] {
  return [
    {
      title: "Resumen Ejecutivo",
      summary: {
        "Ingresos Totales": `S/ ${data.totalRevenue.toLocaleString()}`,
        "Total Ventas": data.totalSales,
        "Ticket Promedio": `S/ ${data.avgTicket.toFixed(0)}`,
        "Servicios": data.totalHaircuts,
        "Productos Vendidos": data.productsCount,
        "Nuevos Clientes": data.newClients,
      },
      tables: [
        {
          headers: ["#", "Barbero", "Ingresos", "Servicios"],
          rows: data.topBarbers.map((b: any, i: number) => [i + 1, b.nombre, `S/ ${b.ventas.toLocaleString()}`, b.servicios]),
        },
        {
          headers: ["#", "Servicio", "Cantidad", "Ingresos"],
          rows: data.topServices.map((s: any, i: number) => [i + 1, s.servicio, s.cantidad, `S/ ${s.ingresos.toLocaleString()}`]),
        },
        {
          headers: ["#", "Producto", "Cantidad", "Ingresos"],
          rows: data.topProducts.map((p: any, i: number) => [i + 1, p.producto, p.cantidad, `S/ ${p.ingresos.toLocaleString()}`]),
        },
      ],
    },
  ];
}

export function buildFinancialSections(data: any): Section[] {
  const c = data.current;
  return [
    {
      title: "Estado de Resultados",
      summary: {
        "Ingresos por Servicios": `S/ ${c.serviceRevenue.toLocaleString()}`,
        "Ingresos por Productos": `S/ ${c.productRevenue.toLocaleString()}`,
        "Total Ingresos": `S/ ${c.totalIngresos.toLocaleString()}`,
        "Total Costos": `S/ ${Math.round(c.totalCostos).toLocaleString()}`,
        "Utilidad Bruta": `S/ ${Math.round(c.utilidadBruta).toLocaleString()}`,
        "Margen de Utilidad": `${c.margenUtilidad}%`,
      },
      tables: [
        {
          headers: ["Método de Pago", "Transacciones", "Monto Total", "%"],
          rows: data.paymentMethods.map((m: any) => [m.metodo, m.transacciones, `S/ ${m.monto.toLocaleString()}`, `${m.porcentaje}%`]),
        },
        {
          headers: ["Producto", "Cantidad", "P. Costo", "P. Venta", "Margen %", "Utilidad"],
          rows: data.productProfitability.map((p: any) => [p.producto, p.vendido, `S/ ${p.costo}`, `S/ ${p.venta}`, `${p.margenP.toFixed(1)}%`, `S/ ${Math.round(p.utilidad)}`]),
        },
      ],
    },
  ];
}

export function buildServicesSections(data: any): Section[] {
  return [
    {
      title: "Análisis de Servicios",
      tables: [
        {
          headers: ["#", "Servicio", "Cantidad", "Ingresos", "Promedio", "% del Total"],
          rows: data.servicesRanking.map((s: any, i: number) => [i + 1, s.servicio, s.cantidad, `S/ ${s.ingresos.toLocaleString()}`, `S/ ${s.promedio}`, `${s.porcentaje}%`]),
        },
        {
          headers: ["Barbero", "Total Servicios", "Servicio Principal", "Promedio/Día"],
          rows: data.barberProductivity.map((b: any) => [b.barbero, b.total, b.principal, b.promedioDia]),
        },
      ],
    },
  ];
}

export function buildInventorySections(data: any): Section[] {
  return [
    {
      title: "Análisis de Inventario",
      summary: {
        "Valor Total Inventario": `S/ ${data.totalValue.toLocaleString()}`,
        "Unidades Totales": data.totalUnits,
        "Productos Clase A": data.classA,
        "Rotación Promedio": data.avgRotation,
      },
      tables: [
        {
          headers: ["Categoría", "Unidades", "Valor"],
          rows: data.inventoryByCategory.map((c: any) => [c.categoria, c.unidades, `S/ ${c.valor.toLocaleString()}`]),
        },
        {
          headers: ["Producto", "Stock", "Vendido (30d)", "Rotación", "Días Inv.", "Clase"],
          rows: data.productRotation.map((p: any) => [p.producto, p.stock, p.vendido, p.rotacion, p.diasInventario, p.clase]),
        },
        {
          headers: ["Producto", "Stock Actual", "Venta Diaria", "Días Restantes", "Urgencia"],
          rows: data.restockProjections.map((p: any) => [p.producto, p.stockActual, p.ventaDiaria, p.diasRestantes, p.urgencia]),
        },
      ],
    },
  ];
}

export function buildClientsSections(data: any): Section[] {
  return [
    {
      title: "Análisis de Clientes",
      summary: {
        "Total Clientes": data.totalClients,
        "Nuevos en Período": data.newClientsCount,
        "Tasa de Retención": `${data.retentionRate}%`,
        "Ticket Promedio": `S/ ${data.avgPerVisit}`,
        "Tasa de Abandono": `${data.churnRate}%`,
      },
      tables: [
        {
          headers: ["Cliente", "Última Visita (días)", "Frecuencia", "Valor Total", "Segmento"],
          rows: data.rfmAnalysis.map((c: any) => [c.cliente, c.ultimaVisita, c.frecuencia, `S/ ${c.valor.toLocaleString()}`, c.segmento]),
        },
        {
          headers: ["Cliente VIP", "Gasto Total", "Promedio/Visita", "Servicio Preferido"],
          rows: data.vipClients.map((c: any) => [c.nombre, `S/ ${c.gastoTotal.toLocaleString()}`, `S/ ${c.promedio}`, c.servicio]),
        },
      ],
    },
  ];
}

export function buildComparativeSections(data: any): Section[] {
  return [
    {
      title: "Análisis Comparativo",
      tables: [
        {
          headers: ["Métrica", "Período Anterior", "Período Actual", "Variación"],
          rows: data.metricsComparison.map((m: any) => {
            const diff = m.periodo2 - m.periodo1;
            const pct = m.periodo1 > 0 ? ((diff / m.periodo1) * 100).toFixed(1) : "N/A";
            return [m.metrica, `${m.unidad}${m.periodo1.toLocaleString()}`, `${m.unidad}${m.periodo2.toLocaleString()}`, `${diff >= 0 ? "+" : ""}${m.unidad}${diff.toLocaleString()} (${pct}%)`];
          }),
        },
        {
          headers: ["Barbero", "Cortes", "Ingresos", "Promedio"],
          rows: data.barberComparison.map((b: any) => [b.barbero, b.cortes, `S/ ${b.ingresos.toLocaleString()}`, `S/ ${b.promedio}`]),
        },
      ],
    },
  ];
}
