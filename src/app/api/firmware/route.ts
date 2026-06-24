import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_FILE_PATH = path.join(process.cwd(), "src/data/firmware.json");
const UPLOAD_DIR = path.join(process.cwd(), "public/uploads");

// Helper to ensure files and directories exist
async function initStorage() {
  try {
    await fs.mkdir(path.dirname(DATA_FILE_PATH), { recursive: true });
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  } catch (error) {
    console.error("Storage initialization error:", error);
  }
}

// Helper to format file size
function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

// Helper to increment version name (e.g. V1.1 -> V1.2, V0.9 -> V1.0)
function incrementVersion(version: string): string {
  const match = version.match(/^V(\d+)\.(\d+)$/i);
  if (match) {
    const major = parseInt(match[1], 10);
    const minor = parseInt(match[2], 10);
    if (minor === 9) {
      return `V${major + 1}.0`;
    } else {
      return `V${major}.${minor + 1}`;
    }
  }
  return version + ".1";
}

// Helper to format date like "20 May 2024, 10:30 AM"
function formatCurrentDate() {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const strHours = String(hours).padStart(2, "0");
  
  return `${day} ${month} ${year}, ${strHours}:${minutes} ${ampm}`;
}

interface FirmwareRecord {
  id: string;
  date: string;
  version: string;
  comments: string;
  testStatus: string;
  testComments: string;
  fileName: string;
  fileSize: string;
  isLatest: boolean;
}

// GET handler: fetch list of firmware releases
export async function GET() {
  await initStorage();
  try {
    const fileData = await fs.readFile(DATA_FILE_PATH, "utf-8");
    const data: FirmwareRecord[] = JSON.parse(fileData);
    // Sort descending by date or version to make sure latest is first
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json([], { status: 200 });
  }
}

// POST handler: handle firmware file upload
export async function POST(request: NextRequest) {
  await initStorage();
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const comments = formData.get("comments") as string | null;
    const baseVersion = formData.get("baseVersion") as string | null;

    if (!file || !comments || !baseVersion) {
      return NextResponse.json(
        { error: "Missing required fields (file, comments, baseVersion)" },
        { status: 400 }
      );
    }

    // Read current database
    let database: FirmwareRecord[] = [];
    try {
      const fileData = await fs.readFile(DATA_FILE_PATH, "utf-8");
      database = JSON.parse(fileData);
    } catch (e) {
      // Empty db
    }

    // Calculate new version
    const newVersionName = incrementVersion(baseVersion);

    // Verify it doesn't already exist
    if (database.some((item) => item.version === newVersionName)) {
      return NextResponse.json(
        { error: `Version ${newVersionName} already exists.` },
        { status: 400 }
      );
    }

    // Define unique filename or keep original name but sanitize
    const extension = path.extname(file.name) || ".bin";
    const sanitizedFileName = `dbtm_firmware_${newVersionName.toLowerCase().replace(".", "_")}${extension}`;
    const filePath = path.join(UPLOAD_DIR, sanitizedFileName);

    // Save the file to public/uploads
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await fs.writeFile(filePath, buffer);

    // Create new record
    const newRecord: FirmwareRecord = {
      id: String(Date.now()),
      date: formatCurrentDate(),
      version: newVersionName,
      comments: comments,
      testStatus: "Yet to test",
      testComments: "-",
      fileName: sanitizedFileName,
      fileSize: formatBytes(file.size),
      isLatest: true
    };

    // Mark previous releases as not latest
    database = database.map((item) => ({ ...item, isLatest: false }));

    // Add new release at the top of the array
    database.unshift(newRecord);

    // Save back to JSON file
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(database, null, 2), "utf-8");

    return NextResponse.json({ success: true, record: newRecord });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message || "Failed to upload firmware" }, { status: 500 });
  }
}

// PUT handler: update test status or comments
export async function PUT(request: NextRequest) {
  await initStorage();
  try {
    const body = await request.json();
    const { id, testStatus, testComments } = body;

    if (!id || !testStatus) {
      return NextResponse.json(
        { error: "Missing required fields (id, testStatus)" },
        { status: 400 }
      );
    }

    // Read current database
    const fileData = await fs.readFile(DATA_FILE_PATH, "utf-8");
    let database: FirmwareRecord[] = JSON.parse(fileData);

    // Update matching record
    let updated = false;
    database = database.map((item) => {
      if (item.id === id) {
        updated = true;
        return {
          ...item,
          testStatus,
          testComments: testComments || "-"
        };
      }
      return item;
    });

    if (!updated) {
      return NextResponse.json({ error: "Firmware record not found" }, { status: 404 });
    }

    // Save back to JSON file
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(database, null, 2), "utf-8");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update record" }, { status: 500 });
  }
}

// DELETE handler: delete a firmware release
export async function DELETE(request: NextRequest) {
  await initStorage();
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing firmware id" }, { status: 400 });
    }

    // Read current database
    const fileData = await fs.readFile(DATA_FILE_PATH, "utf-8");
    let database: FirmwareRecord[] = JSON.parse(fileData);

    const recordToDelete = database.find((item) => item.id === id);
    if (!recordToDelete) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    // Delete file if exists
    try {
      const filePath = path.join(UPLOAD_DIR, recordToDelete.fileName);
      await fs.unlink(filePath);
    } catch (e) {
      // File might not exist physically, ignore
    }

    // Filter database
    database = database.filter((item) => item.id !== id);

    // Check if we deleted the latest one, and reset latest flag to the top one
    if (recordToDelete.isLatest && database.length > 0) {
      database[0].isLatest = true;
    }

    // Save back to JSON file
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(database, null, 2), "utf-8");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete record" }, { status: 500 });
  }
}
