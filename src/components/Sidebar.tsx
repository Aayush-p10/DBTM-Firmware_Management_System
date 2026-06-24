"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CloudUpload, History, BookOpen, Download } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Firmware Upload",
      href: "/",
      icon: CloudUpload,
    },
    {
      name: "Firmware History",
      href: "/history",
      icon: History,
    },
    {
      name: "Device Manual",
      href: "/manual",
      icon: BookOpen,
    },
    {
      name: "Downloads",
      href: "/downloads",
      icon: Download,
    },
  ];

  return (
    <aside className="w-64 bg-sidebar-bg text-white flex flex-col h-screen fixed left-0 top-0 border-r border-[#1a2e4c] z-20">
      {/* Brand Header */}
      <div className="p-6 text-center border-b border-[#1a2e4c]">
        <h1 className="text-2xl font-bold tracking-wider text-white">DBTM</h1>
        <p className="text-xs text-slate-400 mt-1 font-medium leading-relaxed">
          Firmware Management<br />Module
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-brand-blue text-white shadow-md shadow-blue-900/20"
                  : "text-slate-400 hover:bg-[#12223c] hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-6 text-center border-t border-[#1a2e4c]">
        <p className="text-xs text-slate-500 font-medium">
          &copy; 2026 DBTM.<br />All rights reserved.
        </p>
      </div>
    </aside>
  );
}
