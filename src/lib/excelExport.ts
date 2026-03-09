/**
 * Excel export utilities using ExcelJS (replaces vulnerable xlsx package)
 */
import ExcelJS from "exceljs";

/**
 * Export JSON data to an Excel file (simple single-sheet)
 */
export async function exportJsonToExcel(
  data: Record<string, unknown>[],
  sheetName: string,
  filename: string
) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(sheetName.substring(0, 31));

  if (data.length === 0) return;

  // Add headers
  const headers = Object.keys(data[0]);
  sheet.addRow(headers);

  // Style header row
  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF323232" },
  };
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };

  // Add data rows
  data.forEach((row) => {
    sheet.addRow(headers.map((h) => row[h] ?? ""));
  });

  // Auto-width columns
  headers.forEach((_, i) => {
    const col = sheet.getColumn(i + 1);
    let maxLen = headers[i].length;
    data.forEach((row) => {
      const val = String(row[headers[i]] ?? "");
      if (val.length > maxLen) maxLen = val.length;
    });
    col.width = Math.min(maxLen + 2, 40);
  });

  // Download
  const buffer = await workbook.xlsx.writeBuffer();
  downloadBuffer(buffer as ArrayBuffer, filename);
}

/**
 * Export array-of-arrays data to Excel with multiple sheets
 */
export async function exportAoaToExcel(
  sheets: {
    name: string;
    data: (string | number)[][];
  }[],
  filename: string
) {
  const workbook = new ExcelJS.Workbook();

  sheets.forEach((s) => {
    const sheet = workbook.addWorksheet(
      s.name.substring(0, 31).replace(/[\\/*?[\]:]/g, "") || "Hoja"
    );
    s.data.forEach((row) => {
      sheet.addRow(row);
    });

    // Auto-width
    if (s.data.length > 0) {
      const maxCols = Math.max(...s.data.map((r) => r.length));
      for (let i = 0; i < maxCols; i++) {
        let maxLen = 10;
        s.data.forEach((row) => {
          const val = String(row[i] ?? "");
          if (val.length > maxLen) maxLen = val.length;
        });
        sheet.getColumn(i + 1).width = Math.min(maxLen + 2, 40);
      }
    }
  });

  const buffer = await workbook.xlsx.writeBuffer();
  downloadBuffer(buffer as ArrayBuffer, filename);
}

/**
 * Export JSON data to CSV string
 */
export function jsonToCsv(data: Record<string, unknown>[]): string {
  if (data.length === 0) return "";
  const headers = Object.keys(data[0]);
  const rows = data.map((row) =>
    headers.map((h) => {
      const val = String(row[h] ?? "");
      return val.includes(",") || val.includes('"')
        ? `"${val.replace(/"/g, '""')}"`
        : val;
    }).join(",")
  );
  return [headers.join(","), ...rows].join("\n");
}

function downloadBuffer(buffer: ArrayBuffer, filename: string) {
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
