"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  HelpCircle,
  CloudUpload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Info,
  Download,
  Eye,
  Loader2
} from "lucide-react";

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

export default function UploadPage() {
  // Form State
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [baseVersion, setBaseVersion] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Status & List State
  const [history, setHistory] = useState<FirmwareRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch firmware history
  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/firmware");
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
        // Default base version to the latest version in database
        if (data.length > 0 && !baseVersion) {
          const latest = data.find((item: FirmwareRecord) => item.isLatest) || data[0];
          setBaseVersion(latest.version);
        } else if (data.length === 0) {
          setBaseVersion("V1.0"); // Fallback default
        }
      }
    } catch (error) {
      console.error("Failed to load firmware history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Handle Drag & Drop
  const [dragActive, setDragActive] = useState(false);
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setIsSuccess(false);
      setErrorMsg("");
    }
  };

  // Handle File Change from input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setIsSuccess(false);
      setErrorMsg("");
    }
  };

  // Trigger input click
  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Format bytes for UI
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Submit Upload
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !description.trim() || !baseVersion) return;

    setIsUploading(true);
    setErrorMsg("");
    setIsSuccess(false);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("comments", description);
    formData.append("baseVersion", baseVersion);

    try {
      const res = await fetch("/api/firmware", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setIsSuccess(true);
        setFile(null);
        setDescription("");
        // Reset baseVersion to the new latest will happen automatically after fetch
        await fetchHistory();
      } else {
        const errorData = await res.json();
        setErrorMsg(errorData.error || "Failed to upload firmware.");
      }
    } catch (err) {
      setErrorMsg("An error occurred while uploading. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Helper to preview next version
  const getNextVersionPreview = (version: string) => {
    if (!version) return "";
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
  };

  const isFormValid = file !== null && description.trim().length > 0 && baseVersion !== "";

  return (
    <div className="p-8">
      {/* Top Header */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">Firmware Upload</h1>
        </div>
        <Link
          href="/manual"
          className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors text-sm font-medium"
        >
          <HelpCircle className="w-5 h-5" />
          <span>Help</span>
        </Link>
      </header>

      {/* Main Upload Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-8">
        {/* Card 1: Upload Firmware File */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col xl:col-span-1.5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-800 mb-4">1. Upload Firmware File</h2>
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors flex-1 ${
              dragActive
                ? "border-brand-blue bg-blue-50/50"
                : file
                ? "border-emerald-300 bg-emerald-50/10"
                : "border-slate-300 hover:border-slate-400 bg-slate-50/30"
            }`}
            onClick={onButtonClick}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept=".bin,.hex,.zip,.txt"
            />
            <CloudUpload className={`w-12 h-12 mb-3 ${file ? "text-emerald-500" : "text-brand-blue"}`} />
            <p className="text-sm text-slate-700 font-medium">
              Drag and drop your file here
            </p>
            <p className="text-xs text-slate-400 my-2">or</p>
            <button
              type="button"
              className="px-4 py-2 border border-brand-blue text-brand-blue rounded-lg text-xs font-semibold hover:bg-brand-blue hover:text-white transition-all shadow-sm"
              onClick={(e) => {
                e.stopPropagation();
                onButtonClick();
              }}
            >
              Browse Files
            </button>
          </div>

          {/* Staged File Info */}
          {file && (
            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3 overflow-hidden">
                <FileText className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="truncate text-left">
                  <p className="text-xs font-medium text-emerald-950 truncate">{file.name}</p>
                  <p className="text-[10px] text-emerald-600">{formatBytes(file.size)}</p>
                </div>
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            </div>
          )}

          {isSuccess && (
            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <p className="text-xs font-medium text-emerald-700">File successfully uploaded</p>
            </div>
          )}

          {errorMsg && (
            <div className="mt-4 p-3 bg-rose-50 border border-rose-100 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <p className="text-xs font-medium text-rose-700">{errorMsg}</p>
            </div>
          )}
        </div>

        {/* Card 2: Description */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col xl:col-span-1.5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-800 mb-4">2. Description (Version Changes / Updates)</h2>
          <div className="flex-1 flex flex-col">
            <textarea
              className="w-full flex-1 min-h-[140px] xl:min-h-0 border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue resize-none leading-relaxed text-slate-800 placeholder-slate-400"
              placeholder="e.g.&#10;- Added Bluetooth connectivity support&#10;- Improved battery management&#10;- Resolved minor stability issues"
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 500))}
            />
            <div className="flex justify-between items-center mt-2 text-xs">
              <span className="text-slate-400 font-medium">
                {description.length} / 500
              </span>
            </div>
          </div>

          {/* Description Status */}
          <div className="mt-4">
            {description.trim().length > 0 ? (
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-xs font-semibold">Info updated</span>
              </div>
            ) : (
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg flex items-center gap-2 text-slate-500">
                <AlertCircle className="w-4 h-4" />
                <span className="text-xs font-semibold">Info not added to description</span>
              </div>
            )}
          </div>
        </div>

        {/* Card 3 & 4 Right Container */}
        <div className="grid grid-cols-1 gap-6 xl:col-span-1">
          {/* Card 3: Select Base Version */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-4">
                <h2 className="text-sm font-semibold text-slate-800">3. Select Base Version</h2>
                <div className="group relative">
                  <HelpCircle className="w-4 h-4 text-slate-400 cursor-pointer" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 hidden group-hover:block bg-slate-900 text-white text-[10px] rounded p-2 z-10 leading-normal shadow-lg">
                    Select the version you are building upon. The new firmware will be incremented from this base version.
                  </div>
                </div>
              </div>
              <select
                className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue bg-white font-medium text-slate-800"
                value={baseVersion}
                onChange={(e) => setBaseVersion(e.target.value)}
              >
                <option value="" disabled>Select Version</option>
                {history.map((item) => (
                  <option key={item.id} value={item.version}>
                    {item.version} {item.isLatest ? "(Latest)" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg text-blue-900">
              <p className="text-[11px] font-medium leading-relaxed">
                Every upload change the version name +1<br />
                <span className="font-semibold text-brand-blue">
                  {baseVersion ? `Eg. ${baseVersion}, ${getNextVersionPreview(baseVersion)}` : "Eg. V1.1, V1.2"}
                </span>
              </p>
            </div>
          </div>

          {/* Card 4: Upload Button Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-end">
            <h2 className="text-sm font-semibold text-slate-800 mb-4">4. Upload</h2>
            <button
              onClick={handleUpload}
              disabled={!isFormValid || isUploading}
              className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 text-sm font-bold shadow-md transition-all ${
                isFormValid && !isUploading
                  ? "bg-brand-blue hover:bg-brand-blue-hover text-white shadow-blue-500/10 cursor-pointer"
                  : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none"
              }`}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <CloudUpload className="w-5 h-5" />
                  <span>Upload Firmware</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Manual Redirect Banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-slate-900">Firmware Upload to Device Procedure</h3>
            <p className="text-xs text-slate-500 mt-1">Please refer to the manual for step-by-step instructions.</p>
          </div>
        </div>
        <Link
          href="/manual"
          className="bg-white border border-brand-blue hover:bg-brand-blue/5 text-brand-blue px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 text-center shadow-sm flex items-center justify-center gap-1.5"
        >
          <FileText className="w-4 h-4" />
          <span>View Procedure Manual</span>
        </Link>
      </div>

      {/* History Table Container */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Firmware Upload History</h2>
        
        {isLoading ? (
          <div className="py-12 flex justify-center items-center text-slate-400 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-brand-blue" />
            <span className="text-sm">Loading history...</span>
          </div>
        ) : history.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-sm">
            No firmware versions uploaded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500 font-semibold text-xs">
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Version</th>
                  <th className="py-3 px-4 w-1/3">Comments</th>
                  <th className="py-3 px-4">Test Status</th>
                  <th className="py-3 px-4">Test Comments</th>
                  <th className="py-3 px-4">File</th>
                  <th className="py-3 px-4 text-center">Manual</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {history.slice(0, 5).map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-slate-700 whitespace-nowrap">
                      {record.date}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{record.version}</span>
                        {record.isLatest && (
                          <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-100">
                            Latest
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 leading-normal">
                      {record.comments}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {record.testStatus === "Tested" ? (
                        <span className="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2.5 py-1 rounded-full border border-emerald-100">
                          Tested
                        </span>
                      ) : (
                        <span className="bg-amber-50 text-amber-700 text-[11px] font-bold px-2.5 py-1 rounded-full border border-amber-100">
                          Yet to test
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 leading-normal">
                      {record.testComments}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <a
                        href={`/uploads/${record.fileName}`}
                        download={record.fileName}
                        className="inline-flex items-center gap-1 text-brand-blue hover:text-brand-blue-hover font-semibold transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </a>
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <Link
                        href="/manual"
                        className="inline-flex items-center gap-1 text-brand-blue hover:text-brand-blue-hover font-semibold transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* View all button if list is long */}
        {history.length > 5 && (
          <div className="mt-4 text-right">
            <Link
              href="/history"
              className="text-xs text-brand-blue hover:text-brand-blue-hover font-bold inline-flex items-center gap-1"
            >
              <span>View All History ({history.length} releases)</span>
              <span>&rarr;</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
