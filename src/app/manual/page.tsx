"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  ChevronRight,
  ChevronDown,
  Info,
  Download,
  BookOpen,
  FileText
} from "lucide-react";

interface ManualSection {
  id: string;
  title: string;
  parentId?: string;
  content: React.ReactNode;
}

export default function ManualPage() {
  const [activeSectionId, setActiveSectionId] = useState("2.2");
  const [expandedParents, setExpandedParents] = useState<Record<string, boolean>>({
    "2": true
  });

  const toggleParent = (parentId: string) => {
    setExpandedParents((prev) => ({
      ...prev,
      [parentId]: !prev[parentId]
    }));
  };

  // Content for each manual section
  const manualSections: Record<string, { title: string; subtitle?: string; content: React.ReactNode }> = {
    "1": {
      title: "1. Overview",
      subtitle: "Introduction to Powered Sports Tech Firmware Management",
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed">
            The Powered Sports Tech Firmware Management module is designed to allow administrators and developers to safely upgrade, manage, and verify firmware updates across all deployed DBTM telemetry units.
          </p>
          <p className="leading-relaxed">
            This documentation provides a comprehensive guide to completing upgrades, rolling back in case of system bugs, and general hardware troubleshooting parameters.
          </p>
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mt-6">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">Key Hardware Specifications</h4>
            <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
              <li>Compatible models: DBTM-v3, DBTM-v4, DBTM-Lite</li>
              <li>Connection interface: Type-C USB (Serial CDC)</li>
              <li>Default baud rate: 115200 bps</li>
            </ul>
          </div>
        </div>
      )
    },
    "2.1": {
      title: "2.1 Prerequisites",
      subtitle: "Required items before executing a firmware upload",
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed">
            Before attempting to upload a new firmware release to the DBTM device, ensure you have gathered all necessary materials and met the following conditions:
          </p>
          <ul className="space-y-3 mt-4">
            <li className="flex gap-3 items-start">
              <span className="bg-blue-100 text-brand-blue rounded-full p-1 shrink-0 mt-0.5">
                <CheckIcon className="w-3.5 h-3.5" />
              </span>
              <div>
                <strong className="text-slate-800 font-bold block text-sm">USB Type-C Cable</strong>
                <span className="text-xs text-slate-500">Ensure the cable is rated for data transfer, not just power delivery.</span>
              </div>
            </li>
            <li className="flex gap-3 items-start">
              <span className="bg-blue-100 text-brand-blue rounded-full p-1 shrink-0 mt-0.5">
                <CheckIcon className="w-3.5 h-3.5" />
              </span>
              <div>
                <strong className="text-slate-800 font-bold block text-sm">DBTM Configurator Software</strong>
                <span className="text-xs text-slate-500">Desktop application installed (v2.4 or higher recommended).</span>
              </div>
            </li>
            <li className="flex gap-3 items-start">
              <span className="bg-blue-100 text-brand-blue rounded-full p-1 shrink-0 mt-0.5">
                <CheckIcon className="w-3.5 h-3.5" />
              </span>
              <div>
                <strong className="text-slate-800 font-bold block text-sm">Binary File (.bin)</strong>
                <span className="text-xs text-slate-500">The compiled binary downloaded from this portal. Verify file size matches.</span>
              </div>
            </li>
          </ul>
        </div>
      )
    },
    "2.2": {
      title: "2.2 Step-by-Step Procedure",
      subtitle: "Follow the steps below to upload firmware to the DBTM device.",
      content: (
        <div className="space-y-6">
          <div className="space-y-6">
            <div className="flex items-start gap-4 relative">
              <div className="flex flex-col items-center shrink-0 relative">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-blue text-white font-bold text-xs z-10 shadow-sm">
                  1
                </span>
                <div className="absolute top-4 bottom-[-40px] w-0.5 bg-slate-200 z-0"></div>
              </div>
              <p className="text-sm text-slate-800 font-medium pt-1.5">
                Connect the DBTM device to your computer using USB cable.
              </p>
            </div>
            
            <div className="flex items-start gap-4 relative">
              <div className="flex flex-col items-center shrink-0 relative">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-blue text-white font-bold text-xs z-10 shadow-sm">
                  2
                </span>
                <div className="absolute top-4 bottom-[-40px] w-0.5 bg-slate-200 z-0"></div>
              </div>
              <p className="text-sm text-slate-800 font-medium pt-1.5">
                Power on the device.
              </p>
            </div>

            <div className="flex items-start gap-4 relative">
              <div className="flex flex-col items-center shrink-0 relative">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-blue text-white font-bold text-xs z-10 shadow-sm">
                  3
                </span>
                <div className="absolute top-4 bottom-[-40px] w-0.5 bg-slate-200 z-0"></div>
              </div>
              <p className="text-sm text-slate-800 font-medium pt-1.5">
                Open the DBTM configuration tool.
              </p>
            </div>

            <div className="flex items-start gap-4 relative">
              <div className="flex flex-col items-center shrink-0 relative">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-blue text-white font-bold text-xs z-10 shadow-sm">
                  4
                </span>
                <div className="absolute top-4 bottom-[-40px] w-0.5 bg-slate-200 z-0"></div>
              </div>
              <p className="text-sm text-slate-800 font-medium pt-1.5">
                Go to the "Firmware Upload" section.
              </p>
            </div>

            <div className="flex items-start gap-4 relative">
              <div className="flex flex-col items-center shrink-0 relative">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-blue text-white font-bold text-xs z-10 shadow-sm">
                  5
                </span>
                <div className="absolute top-4 bottom-[-40px] w-0.5 bg-slate-200 z-0"></div>
              </div>
              <p className="text-sm text-slate-800 font-medium pt-1.5">
                Select the firmware file (.bin) and click on "Upload Firmware".
              </p>
            </div>

            <div className="flex items-start gap-4 relative">
              <div className="flex flex-col items-center shrink-0 relative">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-blue text-white font-bold text-xs z-10 shadow-sm">
                  6
                </span>
              </div>
              <p className="text-sm text-slate-800 font-medium pt-1.5">
                Wait for the upload to complete and the device to restart.
              </p>
            </div>
          </div>

          {/* Alert Notice */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-blue-900 mt-4 shadow-sm">
            <Info className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              Do not disconnect the device or power off during the upload process. Once completed, verify the firmware version in the device info section.
            </div>
          </div>
        </div>
      )
    },
    "2.3": {
      title: "2.3 Verification",
      subtitle: "Ensure the upgrade was successful",
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed">
            After the device reboots, you must verify the firmware installation to ensure the unit does not encounter runtime loops.
          </p>
          <ol className="list-decimal pl-5 space-y-2 mt-4 text-sm text-slate-600">
            <li>Check the Status LED: A solid green LED indicates standard operations. A blinking red LED indicates boot failure.</li>
            <li>In the Configurator Software, click "Get Device Status" to verify the version code matches the newly flashed version.</li>
            <li>Verify diagnostic log outputs: check that no `NullPointerExceptions` or boot loops are reported in the serial stream.</li>
          </ol>
        </div>
      )
    },
    "3": {
      title: "3. Rollback to Previous Version",
      subtitle: "Downgrading firmware version in safety mode",
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed">
            If a new firmware version shows unstable behavior or interferes with remote telemetry, you can rollback to a previous version.
          </p>
          <h4 className="font-bold text-sm text-slate-800 mt-4">Safe Mode Downgrade Steps:</h4>
          <ol className="list-decimal pl-5 space-y-2 text-sm text-slate-600">
            <li>Power off the unit completely.</li>
            <li>Hold the boot button on the hardware motherboard using a pin.</li>
            <li>Connect USB cable and power on. The status light should blink amber, showing Safe Boot Mode.</li>
            <li>Proceed to flash the previous stable version (e.g. V1.0 or V1.1) from the downloads library.</li>
          </ol>
        </div>
      )
    },
    "4": {
      title: "4. Troubleshooting",
      subtitle: "Solutions to common upload errors",
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed">
            Reference the table below for handling common errors during the flashing phase:
          </p>
          <div className="overflow-hidden border border-slate-200 rounded-lg mt-4">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                <tr>
                  <th className="py-2.5 px-4">Symptom</th>
                  <th className="py-2.5 px-4">Possible Cause</th>
                  <th className="py-2.5 px-4">Solution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-600">
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-800">"COM Port Not Found"</td>
                  <td className="py-3 px-4">Missing CH340 or FTDI drivers.</td>
                  <td className="py-3 px-4">Download and install drivers from the downloads page.</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-800">"Flash Timed Out"</td>
                  <td className="py-3 px-4">High baudrate on unstable cable.</td>
                  <td className="py-3 px-4">Lower baudrate to 9600 bps in configurator.</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-800">Blinking Red LED</td>
                  <td className="py-3 px-4">Corrupt binary or checksum mismatch.</td>
                  <td className="py-3 px-4">Perform a rollback to a stable version.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )
    },
    "5": {
      title: "5. FAQ",
      subtitle: "Frequently asked questions",
      content: (
        <div className="space-y-4">
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">Can I upload firmware wirelessly over the air (OTA)?</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Yes. Version 1.1 introduced OTA support. However, the device must have a stable Cellular/Wi-Fi connection, and we recommend a hardwired USB flash for major releases.
            </p>
          </div>
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h4 className="font-bold text-slate-900 text-sm">What happens if the device loses power during flash?</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              The bootloader will remain intact but the main program will be corrupted. The device will fail to boot (red blinking LED). You must execute the manual rollback procedure to fix this.
            </p>
          </div>
        </div>
      )
    }
  };

  // Build text to download full manual
  const downloadFullManual = () => {
    let text = "==================================================\n";
    text += "   POWERED SPORTS TECH FIRMWARE MANUAL & PROCEDURE\n";
    text += "==================================================\n\n";

    text += "1. OVERVIEW\n";
    text += "The Powered Sports Tech Firmware Management module allows administrators to upgrade firmware\n";
    text += "across telemetry devices using USB CDC. Compatible models: DBTM-v3, DBTM-v4.\n\n";

    text += "2. FIRMWARE UPLOAD TO DEVICE\n";
    text += "2.1 Prerequisites:\n";
    text += "- USB Type-C Cable\n";
    text += "- DBTM Configurator Software\n";
    text += "- Binary Firmware File (.bin)\n\n";

    text += "2.2 Step-by-Step Procedure:\n";
    text += "1. Connect the DBTM device to your computer via USB.\n";
    text += "2. Power on the device.\n";
    text += "3. Open the configurator tool.\n";
    text += "4. Go to 'Firmware Upload' tab.\n";
    text += "5. Select the firmware file and start flash.\n";
    text += "6. Wait for restart. Do not unplug during the upload.\n\n";

    text += "2.3 Verification:\n";
    text += "- Verify status LED (solid green).\n";
    text += "- Verify firmware code matches in 'Get Device Status'.\n\n";

    text += "3. ROLLBACK TO PREVIOUS VERSION\n";
    text += "Hold motherboard boot button during power up. Unit enters Bootloader safe mode.\n";
    text += "Flash previous stable release.\n\n";

    text += "4. TROUBLESHOOTING\n";
    text += "- COM Port Not Found -> Install CH340 serial drivers.\n";
    text += "- Flash Timeout -> Decrease baudrate to 9600 bps.\n\n";

    text += "5. FAQ\n";
    text += "- Can I flash OTA? Yes, OTA is supported from v1.1 onwards.\n";
    text += "- Power loss? Corrupts flash. Enter bootloader safe mode to restore.\n";

    const element = document.createElement("a");
    const file = new Blob([text], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "dbtm_device_manual.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const activeSection = manualSections[activeSectionId] || manualSections["1"];

  return (
    <div className="p-8">
      {/* Top Header */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">Device Manual</h1>
        </div>
        <Link
          href="/manual"
          className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors text-sm font-medium"
        >
          <HelpCircle className="w-5 h-5" />
          <span>Help</span>
        </Link>
      </header>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: contents tree */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm lg:col-span-4 flex flex-col">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-4">
            <BookOpen className="w-4 h-4 text-brand-blue" />
            <h2 className="text-sm font-bold text-slate-950 uppercase tracking-wide">Manual Contents</h2>
          </div>

          <nav className="space-y-1 text-xs">
            {/* Section 1 */}
            <button
              onClick={() => setActiveSectionId("1")}
              className={`w-full text-left px-3 py-2.5 rounded-lg font-medium transition-all ${
                activeSectionId === "1"
                  ? "bg-blue-50/70 text-brand-blue font-semibold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              1. Overview
            </button>

            {/* Section 2 Parent */}
            <div>
              <button
                onClick={() => toggleParent("2")}
                className="w-full text-left px-3 py-2.5 rounded-lg font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-800 flex items-center justify-between transition-all"
              >
                <span>2. Firmware Upload to Device</span>
                {expandedParents["2"] ? (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {/* Sub-items */}
              {expandedParents["2"] && (
                <div className="pl-4 mt-0.5 space-y-0.5 border-l border-slate-100 ml-4.5">
                  <button
                    onClick={() => setActiveSectionId("2.1")}
                    className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-all ${
                      activeSectionId === "2.1"
                        ? "bg-blue-50/70 text-brand-blue font-semibold"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                    }`}
                  >
                    2.1 Prerequisites
                  </button>
                  <button
                    onClick={() => setActiveSectionId("2.2")}
                    className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-all ${
                      activeSectionId === "2.2"
                        ? "bg-blue-50/70 text-brand-blue font-semibold"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                    }`}
                  >
                    2.2 Step-by-Step Procedure
                  </button>
                  <button
                    onClick={() => setActiveSectionId("2.3")}
                    className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-all ${
                      activeSectionId === "2.3"
                        ? "bg-blue-50/70 text-brand-blue font-semibold"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                    }`}
                  >
                    2.3 Verification
                  </button>
                </div>
              )}
            </div>

            {/* Section 3 */}
            <button
              onClick={() => setActiveSectionId("3")}
              className={`w-full text-left px-3 py-2.5 rounded-lg font-medium transition-all ${
                activeSectionId === "3"
                  ? "bg-blue-50/70 text-brand-blue font-semibold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              3. Rollback to Previous Version
            </button>

            {/* Section 4 */}
            <button
              onClick={() => setActiveSectionId("4")}
              className={`w-full text-left px-3 py-2.5 rounded-lg font-medium transition-all ${
                activeSectionId === "4"
                  ? "bg-blue-50/70 text-brand-blue font-semibold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              4. Troubleshooting
            </button>

            {/* Section 5 */}
            <button
              onClick={() => setActiveSectionId("5")}
              className={`w-full text-left px-3 py-2.5 rounded-lg font-medium transition-all ${
                activeSectionId === "5"
                  ? "bg-blue-50/70 text-brand-blue font-semibold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              5. FAQ
            </button>
          </nav>
        </div>

        {/* Right column: reading content pane */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 lg:col-span-8 shadow-sm flex flex-col justify-between min-h-[480px]">
          <div>
            <header className="border-b border-slate-100 pb-4 mb-6">
              <h2 className="text-xl font-bold text-slate-900">{activeSection.title}</h2>
              {activeSection.subtitle && (
                <p className="text-xs text-slate-400 mt-1 font-semibold">{activeSection.subtitle}</p>
              )}
            </header>

            <div className="text-sm text-slate-700 leading-relaxed">
              {activeSection.content}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
            <button
              onClick={downloadFullManual}
              className="bg-white border border-brand-blue hover:bg-brand-blue/5 text-brand-blue px-4 py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Download Full Manual</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Inline icons
function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={3}
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  );
}
