"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  HelpCircle,
  Search,
  Download,
  MoreVertical,
  Eye,
  Trash2,
  Edit3,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
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

export default function HistoryPage() {
  const [history, setHistory] = useState<FirmwareRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Actions menu state
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Edit Modal State
  const [editingRecord, setEditingRecord] = useState<FirmwareRecord | null>(null);
  const [editStatus, setEditStatus] = useState("Yet to test");
  const [editComments, setEditComments] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Fetch history list
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

  // Close kebab menu on clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle Export
  const handleExport = () => {
    window.open("/api/firmware/export", "_blank");
  };

  // Handle Delete
  const handleDelete = async (id: string, version: string) => {
    if (!confirm(`Are you sure you want to delete version ${version}?`)) return;

    try {
      const res = await fetch(`/api/firmware?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setOpenMenuId(null);
        await fetchHistory();
      } else {
        alert("Failed to delete firmware version.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during deletion.");
    }
  };

  // Open Edit Modal
  const openEditModal = (record: FirmwareRecord) => {
    setEditingRecord(record);
    setEditStatus(record.testStatus);
    setEditComments(record.testComments === "-" ? "" : record.testComments);
    setOpenMenuId(null);
  };

  // Submit Edit Status
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;

    setIsSaving(true);
    try {
      const res = await fetch("/api/firmware", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingRecord.id,
          testStatus: editStatus,
          testComments: editComments.trim() || "-",
        }),
      });

      if (res.ok) {
        setEditingRecord(null);
        await fetchHistory();
      } else {
        alert("Failed to update status.");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating status.");
    } finally {
      setIsSaving(false);
    }
  };

  // Filter Data
  const filteredData = history.filter((item) => {
    const matchesSearch =
      item.version.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.comments.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.testComments.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || item.testStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination math
  const totalEntries = filteredData.length;
  const totalPages = Math.ceil(totalEntries / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalEntries);
  const currentEntries = filteredData.slice(startIndex, endIndex);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  return (
    <div className="p-8">
      {/* Top Header */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">Firmware History</h1>
        </div>
        <Link
          href="/manual"
          className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors text-sm font-medium"
        >
          <HelpCircle className="w-5 h-5" />
          <span>Help</span>
        </Link>
      </header>

      {/* Filter and Control Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-1 flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search version or comments..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50/50 focus:outline-none focus:ring-1 focus:ring-brand-blue text-slate-800 placeholder-slate-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Test Status Filter */}
          <div className="w-full md:w-48">
            <select
              className="w-full border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue bg-white font-medium text-slate-700"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">Test Status: All</option>
              <option value="Yet to test">Yet to test</option>
              <option value="Tested">Tested</option>
            </select>
          </div>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExport}
          className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Export</span>
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        {isLoading ? (
          <div className="py-24 flex flex-col justify-center items-center text-slate-400 gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
            <span className="text-sm font-medium">Loading history records...</span>
          </div>
        ) : totalEntries === 0 ? (
          <div className="py-24 text-center text-slate-400 text-sm font-medium flex flex-col items-center justify-center gap-2">
            <AlertCircle className="w-8 h-8 text-slate-300" />
            <span>No firmware records found matching filters.</span>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 font-semibold text-xs">
                    <th className="py-3 px-6">Date & Time</th>
                    <th className="py-3 px-6">Version</th>
                    <th className="py-3 px-6 w-1/3">Comments</th>
                    <th className="py-3 px-6">Test Status</th>
                    <th className="py-3 px-6">Test Comments</th>
                    <th className="py-3 px-6">File</th>
                    <th className="py-3 px-6 text-center">Manual</th>
                    <th className="py-3 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentEntries.map((record) => (
                    <tr key={record.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="py-4 px-6 font-medium text-slate-700 whitespace-nowrap">
                        {record.date}
                      </td>
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
                      <td className="py-4 px-6 text-slate-500 leading-normal">
                        {record.comments}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
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
                      <td className="py-4 px-6 text-slate-500 leading-normal">
                        {record.testComments}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <a
                          href={`/uploads/${record.fileName}`}
                          download={record.fileName}
                          className="inline-flex items-center gap-1 text-brand-blue hover:text-brand-blue-hover font-semibold transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download</span>
                        </a>
                      </td>
                      <td className="py-4 px-6 text-center whitespace-nowrap">
                        <Link
                          href="/manual"
                          className="inline-flex items-center gap-1 text-brand-blue hover:text-brand-blue-hover font-semibold transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </Link>
                      </td>
                      <td className="py-4 px-6 text-center whitespace-nowrap relative">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === record.id ? null : record.id)}
                          className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800 transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {/* Dropdown Action Menu */}
                        {openMenuId === record.id && (
                          <div
                            ref={menuRef}
                            className="absolute right-6 mt-1 w-44 bg-white border border-slate-200 rounded-lg shadow-lg py-1.5 z-30 text-left"
                          >
                            <button
                              onClick={() => openEditModal(record)}
                              className="w-full px-4 py-2 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-2"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Update Test Status</span>
                            </button>
                            <button
                              onClick={() => handleDelete(record.id, record.version)}
                              className="w-full px-4 py-2 hover:bg-rose-50 text-xs font-semibold text-rose-600 flex items-center gap-2"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete Release</span>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
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
        )}
      </div>

      {/* Edit Test Status Modal */}
      {editingRecord && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[1px] flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl border border-slate-200 max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h3 className="text-sm font-bold text-slate-950">Update Test Status</h3>
                <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                  Version: {editingRecord.version}
                </p>
              </div>
              <button
                onClick={() => setEditingRecord(null)}
                className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              {/* Test Status select */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Test Status
                </label>
                <select
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue bg-white font-medium text-slate-800"
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                >
                  <option value="Yet to test">Yet to test</option>
                  <option value="Tested">Tested</option>
                </select>
              </div>

              {/* Test Comments textarea */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Test Comments
                </label>
                <textarea
                  className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue resize-none h-24 leading-normal text-slate-800 placeholder-slate-400"
                  placeholder="e.g. All test cases passed, working as expected."
                  value={editComments}
                  onChange={(e) => setEditComments(e.target.value)}
                  required={editStatus === "Tested"} // comment is required if status is Tested
                />
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingRecord(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 bg-brand-blue hover:bg-brand-blue-hover text-white rounded-lg text-xs font-semibold transition-all shadow-md shadow-blue-500/10 cursor-pointer flex items-center gap-1.5"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
