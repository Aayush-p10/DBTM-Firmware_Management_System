"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  HelpCircle,
  Download,
  Info,
  Loader2,
  ChevronLeft,
  ChevronRight,
  FileText,
  AlertCircle
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

interface OtherResource {
  id: string;
  name: string;
  version: string;
  description: string;
  fileSize: string;
  fileName: string;
}

export default function DownloadsPage() {
  const [activeTab, setActiveTab] = useState<"firmware" | "resources">("firmware");
  const [history, setHistory] = useState<FirmwareRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Other Resources Static Data
  const otherResources: OtherResource[] = [
    {
      id: "r1",
      name: "DBTM Desktop Configurator (macOS)",
      version: "V2.4.1",
      description: "Desktop utility tool to program and view diagnostics for the DBTM device.",
      fileSize: "14.8 MB",
      fileName: "dbtm_configurator_mac.zip"
    },
    {
      id: "r2",
      name: "DBTM Desktop Configurator (Windows)",
      version: "V2.4.1",
      description: "Desktop utility tool to program and view diagnostics for the DBTM device.",
      fileSize: "18.2 MB",
      fileName: "dbtm_configurator_win.zip"
    },
    {
      id: "r3",
      name: "CH340 USB Serial Driver (macOS)",
      version: "V1.5.0",
      description: "Serial communication driver for DBTM microchips on macOS.",
      fileSize: "1.2 MB",
      fileName: "ch340_driver_mac.pkg"
    },
    {
      id: "r4",
      name: "CH340 USB Serial Driver (Windows)",
      version: "V3.8.2",
      description: "Serial communication driver for DBTM microchips on Windows.",
      fileSize: "2.1 MB",
      fileName: "ch340_driver_win.zip"
    },
    {
      id: "r5",
      name: "DBTM Modbus Register Maps",
      version: "V1.0.0",
      description: "Excel datasheet mapping all registers and telemetry payloads.",
      fileSize: "450 KB",
      fileName: "dbtm_register_map.xlsx"
    }
  ];

  // Fetch firmware
  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/firmware");
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
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

  // Reset pagination when tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  // Pagination math for Firmware
  const totalEntries = history.length;
  const totalPages = Math.ceil(totalEntries / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalEntries);
  const currentFirmwareEntries = history.slice(startIndex, endIndex);

  return (
    <div className="p-8">
      {/* Top Header */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">Downloads</h1>
        </div>
        <Link
          href="/manual"
          className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors text-sm font-medium"
        >
          <HelpCircle className="w-5 h-5" />
          <span>Help</span>
        </Link>
      </header>

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-200 mb-6">
        <button
          onClick={() => setActiveTab("firmware")}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "firmware"
              ? "border-brand-blue text-brand-blue"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          Firmware
        </button>
        <button
          onClick={() => setActiveTab("resources")}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "resources"
              ? "border-brand-blue text-brand-blue"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          Other Resources
        </button>
      </div>

      {/* Info Alert Callout */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-blue-900 mb-6 shadow-sm">
        <Info className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
        <p className="text-xs leading-relaxed font-medium">
          {activeTab === "firmware"
            ? "Download previously uploaded firmware versions. Firmware binaries can be flashed using the DBTM Configurator Tool."
            : "Download hardware drivers, desktop installation configurators, and register documentation guides to manage your DBTM unit."}
        </p>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {activeTab === "firmware" ? (
          /* FIRMWARE TAB */
          isLoading ? (
            <div className="py-24 flex flex-col justify-center items-center text-slate-400 gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
              <span className="text-sm font-medium">Loading firmware list...</span>
            </div>
          ) : totalEntries === 0 ? (
            <div className="py-24 text-center text-slate-400 text-sm font-medium flex flex-col items-center justify-center gap-2">
              <AlertCircle className="w-8 h-8 text-slate-300" />
              <span>No firmware versions available for download.</span>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 font-semibold text-xs">
                      <th className="py-3 px-6">Version</th>
                      <th className="py-3 px-6">Upload Date & Time</th>
                      <th className="py-3 px-6 w-1/2">Comments</th>
                      <th className="py-3 px-6">File Size</th>
                      <th className="py-3 px-6 text-center">Download</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {currentFirmwareEntries.map((record) => (
                      <tr key={record.id} className="hover:bg-slate-50/30 transition-colors">
                        <td className="py-4 px-6 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800">{record.version}</span>
                            {record.isLatest && (
                              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-100">
                                Latest
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6 font-medium text-slate-600 whitespace-nowrap">
                          {record.date}
                        </td>
                        <td className="py-4 px-6 text-slate-500 leading-normal">
                          {record.comments}
                        </td>
                        <td className="py-4 px-6 font-medium text-slate-700 whitespace-nowrap">
                          {record.fileSize}
                        </td>
                        <td className="py-4 px-6 text-center whitespace-nowrap">
                          <a
                            href={`/uploads/${record.fileName}`}
                            download={record.fileName}
                            className="inline-flex items-center justify-center p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-all shadow-sm"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="border-t border-slate-100 px-6 py-4 flex items-center justify-between text-xs font-medium text-slate-500 bg-slate-50/30">
                  <span>
                    Showing <span className="font-bold text-slate-800">{startIndex + 1}</span> to{" "}
                    <span className="font-bold text-slate-800">{endIndex}</span> of{" "}
                    <span className="font-bold text-slate-800">{totalEntries}</span> entries
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-1.5 border border-slate-200 rounded hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1.5 rounded border transition-all cursor-pointer ${
                          currentPage === page
                            ? "bg-brand-blue border-brand-blue text-white font-bold"
                            : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-1.5 border border-slate-200 rounded hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )
        ) : (
          /* OTHER RESOURCES TAB */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 font-semibold text-xs">
                  <th className="py-3 px-6">Resource Name</th>
                  <th className="py-3 px-6">Version</th>
                  <th className="py-3 px-6 w-1/2">Description</th>
                  <th className="py-3 px-6">File Size</th>
                  <th className="py-3 px-6 text-center">Download</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {otherResources.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="py-4 px-6 whitespace-nowrap font-bold text-slate-800">
                      {res.name}
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-600 whitespace-nowrap">
                      {res.version}
                    </td>
                    <td className="py-4 px-6 text-slate-500 leading-normal">
                      {res.description}
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-700 whitespace-nowrap">
                      {res.fileSize}
                    </td>
                    <td className="py-4 px-6 text-center whitespace-nowrap">
                      <button
                        onClick={() => {
                          // Simple file generator trigger for mock resources
                          const element = document.createElement("a");
                          const file = new Blob([`Mock resource binary content for ${res.name}`], {
                            type: "text/plain"
                          });
                          element.href = URL.createObjectURL(file);
                          element.download = res.fileName;
                          document.body.appendChild(element);
                          element.click();
                          document.body.removeChild(element);
                        }}
                        className="inline-flex items-center justify-center p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-all shadow-sm cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
