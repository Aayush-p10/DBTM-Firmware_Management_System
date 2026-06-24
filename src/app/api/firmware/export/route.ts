import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_FILE_PATH = path.join(process.cwd(), "src/data/firmware.json");

export async function GET() {
  try {
    const fileExists = await fs.stat(DATA_FILE_PATH).then(() => true).catch(() => false);
    if (!fileExists) {
      return new Response("No data to export", { status: 404 });
    }

    const fileData = await fs.readFile(DATA_FILE_PATH, "utf-8");
    const data = JSON.parse(fileData);

    // CSV Headers
    let csvContent = "Date & Time,Version,Comments,Test Status,Test Comments,File Name,File Size\n";

    // Escape CSV values
    const escapeCsv = (str: string) => {
      if (str === undefined || str === null) return "";
      const escaped = str.replace(/"/g, '""');
      if (escaped.includes(",") || escaped.includes('"') || escaped.includes("\n") || escaped.includes("\r")) {
        return `"${escaped}"`;
      }
      return escaped;
    };

    // Build rows
    for (const record of data) {
      csvContent += `${escapeCsv(record.date)},${escapeCsv(record.version)},${escapeCsv(
        record.comments
      )},${escapeCsv(record.testStatus)},${escapeCsv(record.testComments)},${escapeCsv(
        record.fileName
      )},${escapeCsv(record.fileSize)}\n`;
    }

    // Return CSV file download response
    return new Response(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": "attachment; filename=firmware_upload_history.csv"
      }
    });
  } catch (error: any) {
    console.error("CSV Export error:", error);
    return new Response("Internal server error during CSV export", { status: 500 });
  }
}
