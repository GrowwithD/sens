"use client";

import { useState, useRef, useEffect } from "react";
import ExcelJS from "exceljs";
import { products } from "@/lib/data/products";

// ─── Tutorial ────────────────────────────────────────────────────────────────

const STEPS = [
  {
    icon: "📂",
    title: "Upload CSV Stockwiz",
    description:
      "Klik tombol Upload CSV di pojok kanan atas, lalu pilih file CSV yang diexport dari sistem Stockwiz. File harus berformat kolom: ItemId, Inci, Barcode, Item Name, Quantity, Price IDR.",
    highlight: "Format file: .csv dari Stockwiz",
  },
  {
    icon: "⚡",
    title: "Data Otomatis Terisi",
    description:
      "Setelah upload berhasil, kolom Price (Rp) dan Stockwiz (SW) akan otomatis terisi berdasarkan kode produk (Inci). Badge hijau di stats bar menunjukkan jumlah produk yang berhasil di-match.",
    highlight: "Cocokkan berdasarkan kode Inci",
  },
  {
    icon: "✏️",
    title: "Input Jumlah Riil",
    description:
      "Isi kolom Store dan Storage untuk setiap produk sesuai hasil hitung fisik di lapangan. Kolom Jumlah akan otomatis menjumlahkan keduanya. Data input tersimpan otomatis — tidak hilang walau refresh.",
    highlight: "Jumlah = Store + Storage",
  },
  {
    icon: "📊",
    title: "Lihat Total Selisih",
    description:
      "Kolom QTY menampilkan selisih antara Jumlah Riil vs Stockwiz. Kolom Value adalah selisih dikalikan harga. Status Minus artinya stok fisik kurang dari sistem, Plus artinya lebih.",
    highlight: "QTY = Jumlah Riil − Stockwiz",
  },
  {
    icon: "💾",
    title: "Export & Print",
    description:
      "Gunakan tombol CSV atau Excel untuk mengunduh hasil opname. Data Excel sudah diformat rapi dengan header kuning dan warna status. Tombol Print mencetak langsung ke kertas A4 landscape.",
    highlight: "Export CSV · Export Excel · Print",
  },
  {
    icon: "🔄",
    title: "Reset Data",
    description:
      "Jika ingin memulai sesi opname baru, klik tombol Reset. Akan muncul konfirmasi sebelum data benar-benar dihapus. Reset akan menghapus semua input Store/Storage dan data CSV yang ter-load.",
    highlight: "Data tersimpan di localStorage browser",
  },
];

function TutorialModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Top gradient bar */}
        <div className="h-1.5 bg-linear-to-r from-yellow-400 via-yellow-300 to-yellow-500" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-yellow-600 bg-yellow-50 border border-yellow-200 px-2 py-0.5 rounded-full">
              Tutorial
            </span>
            <span className="text-xs text-gray-400">
              {step + 1} / {STEPS.length}
            </span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-4">
          <div className="flex flex-col items-center text-center py-4">
            <div className="w-16 h-16 bg-yellow-50 border-2 border-yellow-200 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-sm">
              {current.icon}
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">{current.title}</h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">{current.description}</p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2">
              <span className="text-xs font-mono text-gray-500">{current.highlight}</span>
            </div>
          </div>
        </div>

        {/* Step dots */}
        <div className="flex justify-center gap-1.5 pb-4">
          {STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`rounded-full transition-all ${
                i === step
                  ? "w-5 h-2 bg-yellow-400"
                  : "w-2 h-2 bg-gray-200 hover:bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Sebelumnya
          </button>

          {isLast ? (
            <button
              onClick={onClose}
              className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-5 py-2 rounded-lg text-sm transition-colors"
            >
              Mulai Sekarang
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </button>
          ) : (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold px-5 py-2 rounded-lg text-sm transition-colors"
            >
              Selanjutnya
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

type CsvData = Record<string, { stockwiz: number; price: number }>;

type ParseResult = {
  data: CsvData;
  debug: { totalLines: number; firstLines: string[]; matched: number };
};

function parseCSV(text: string): ParseResult {
  const productCodes = new Set(products.map((p) => p.code));
  const cleaned = text.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const lines = cleaned.split("\n").map((l) => l.trim());
  const result: CsvData = {};

  for (const line of lines) {
    if (!line) continue;
    const parts = line.split(",");
    if (parts.length < 6) continue;
    const code = parts[1]?.trim();
    const qty = parseInt(parts[parts.length - 2]);
    const price = parseInt(parts[parts.length - 1]);
    if (code && productCodes.has(code) && !isNaN(qty) && !isNaN(price)) {
      result[code] = { stockwiz: qty, price };
    }
  }

  return {
    data: result,
    debug: { totalLines: lines.length, firstLines: lines.slice(0, 5), matched: Object.keys(result).length },
  };
}

export default function OpnamePage() {
  const [csvData, setCsvData] = useState<CsvData>({});
  const [fileName, setFileName] = useState<string>("");
  const [debug, setDebug] = useState<ParseResult["debug"] | null>(null);
  const [storeQty, setStoreQty] = useState<Record<string, number>>({});
  const [storageQty, setStorageQty] = useState<Record<string, number>>({});
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load dari localStorage saat pertama mount
  useEffect(() => {
    try {
      const savedStore = localStorage.getItem("opname_store");
      const savedStorage = localStorage.getItem("opname_storage");
      const savedCsv = localStorage.getItem("opname_csv");
      const savedFileName = localStorage.getItem("opname_filename");
      if (savedStore) setStoreQty(JSON.parse(savedStore));
      if (savedStorage) setStorageQty(JSON.parse(savedStorage));
      if (savedCsv) setCsvData(JSON.parse(savedCsv));
      if (savedFileName) setFileName(savedFileName);
    } catch {}
  }, []);

  // Simpan ke localStorage setiap ada perubahan
  useEffect(() => {
    localStorage.setItem("opname_store", JSON.stringify(storeQty));
  }, [storeQty]);

  useEffect(() => {
    localStorage.setItem("opname_storage", JSON.stringify(storageQty));
  }, [storageQty]);

  useEffect(() => {
    localStorage.setItem("opname_csv", JSON.stringify(csvData));
  }, [csvData]);

  useEffect(() => {
    if (fileName) localStorage.setItem("opname_filename", fileName);
  }, [fileName]);

  function handleReset() {
    setStoreQty({});
    setStorageQty({});
    setCsvData({});
    setFileName("");
    setDebug(null);
    setShowResetConfirm(false);
    localStorage.removeItem("opname_store");
    localStorage.removeItem("opname_storage");
    localStorage.removeItem("opname_csv");
    localStorage.removeItem("opname_filename");
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const parsed = parseCSV(text);
      setCsvData(parsed.data);
      setDebug(parsed.debug);
    };
    reader.readAsText(file);
  }

  const matchedCount = Object.keys(csvData).length;
  const totalProducts = products.length;
  const inputtedCount = Object.keys(storeQty).length + Object.keys(storageQty).length > 0
    ? products.filter(p => storeQty[p.code] !== undefined || storageQty[p.code] !== undefined).length
    : 0;

  function buildSummary() {
    const selisihRows = products.map((product) => {
      const filled = csvData[product.code];
      const sw = filled?.stockwiz;
      const price = filled?.price;
      const store = storeQty[product.code] ?? 0;
      const storage = storageQty[product.code] ?? 0;
      const hasInput = storeQty[product.code] !== undefined || storageQty[product.code] !== undefined;
      const jumlahRiil = store + storage;
      const selisihQty = hasInput && sw !== undefined ? jumlahRiil - sw : undefined;
      const selisihValue = selisihQty !== undefined && price !== undefined && price > 1 ? selisihQty * price : undefined;
      const status = selisihQty === undefined ? "" : selisihQty < 0 ? "Minus" : selisihQty > 0 ? "Plus" : "OK";
      return { product, sw, price, store, storage, jumlahRiil, selisihQty, selisihValue, status };
    }).filter(r => r.selisihQty !== undefined && r.selisihQty !== 0);

    const totalMinusQty = selisihRows.filter(r => r.selisihQty! < 0).reduce((s, r) => s + r.selisihQty!, 0);
    const totalPlusQty  = selisihRows.filter(r => r.selisihQty! > 0).reduce((s, r) => s + r.selisihQty!, 0);
    const totalMinusVal = selisihRows.filter(r => r.selisihValue !== undefined && r.selisihValue < 0).reduce((s, r) => s + r.selisihValue!, 0);
    const totalPlusVal  = selisihRows.filter(r => r.selisihValue !== undefined && r.selisihValue > 0).reduce((s, r) => s + r.selisihValue!, 0);
    return {
      selisihRows,
      totalMinusQty,
      totalPlusQty,
      totalMinusVal,
      totalPlusVal,
      netQty: totalPlusQty + totalMinusQty,
      netValue: totalPlusVal + totalMinusVal,
    };
  }

  function buildRows() {
    return products.map((product, index) => {
      const filled = csvData[product.code];
      const sw = filled?.stockwiz;
      const price = filled?.price;
      const store = storeQty[product.code] ?? 0;
      const storage = storageQty[product.code] ?? 0;
      const hasInput = storeQty[product.code] !== undefined || storageQty[product.code] !== undefined;
      const jumlahRiil = store + storage;
      const selisihQty = hasInput && sw !== undefined ? jumlahRiil - sw : undefined;
      const selisihValue = selisihQty !== undefined && price !== undefined && price > 1 ? selisihQty * price : undefined;
      const status = selisihQty === undefined ? "" : selisihQty < 0 ? "Minus" : selisihQty > 0 ? "Plus" : "OK";

      return {
        "No.": index + 1,
        "Kode (Inci)": product.code,
        "Nama Produk": product.name,
        "Price (Rp)": price ?? "",
        "Stockwiz (SW)": sw ?? "",
        Store: storeQty[product.code] ?? "",
        Storage: storageQty[product.code] ?? "",
        "Jumlah Riil": hasInput ? jumlahRiil : "",
        "Selisih QTY": selisihQty ?? "",
        "Selisih Value": selisihValue ?? "",
        Status: status,
      };
    });
  }

  function exportCSV() {
    const rows = buildRows();
    const { selisihRows, totalMinusQty, totalPlusQty, totalMinusVal, totalPlusVal, netQty, netValue } = buildSummary();
    const headers = ["No.", "Kode (Inci)", "Nama Produk", "Price (Rp)", "Stockwiz (SW)", "Store", "Storage", "Jumlah Riil", "Selisih QTY", "Selisih Value", "Status"];
    const esc = (v: string) => v.includes(",") ? `"${v}"` : v;

    const csvLines: string[] = [
      "STOCK OPNAME — SENSATIA BOTANICALS",
      `Tanggal Export,${new Date().toLocaleDateString("id-ID")}`,
      "",
      // Main table
      headers.join(","),
      ...rows.map((row) => headers.map((h) => esc(String(row[h as keyof typeof row] ?? ""))).join(",")),
      "",
      // Summary aggregates
      "=== RINGKASAN SELISIH ===",
      `Produk Selisih,${selisihRows.length} dari ${totalProducts} SKU`,
      `Total Minus,${totalMinusQty} pcs,${totalMinusVal}`,
      `Total Plus,${totalPlusQty} pcs,${totalPlusVal}`,
      `Net Selisih,${netQty} pcs,${netValue}`,
      "",
      // Summary detail
      "Kode (Inci),Nama Produk,SW,Store,Storage,Jumlah,Selisih QTY,Selisih Value,Status",
      ...selisihRows.map(r => [
        r.product.code,
        esc(r.product.name),
        r.sw ?? "",
        r.store,
        r.storage,
        r.jumlahRiil,
        r.selisihQty ?? "",
        r.selisihValue ?? "",
        r.status,
      ].join(",")),
      `TOTAL,,,,,,${netQty},${netValue},`,
    ];

    const blob = new Blob(["\uFEFF" + csvLines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `opname-sensatia-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function exportExcel() {
    const rows = buildRows();
    const { selisihRows, totalMinusQty, totalPlusQty, totalMinusVal, totalPlusVal, netQty, netValue } = buildSummary();
    const wb = new ExcelJS.Workbook();

    const YELLOW = "FFFDD835";
    const BLACK = "FF000000";
    const RED = "FFCC0000";
    const GREEN = "FF2E7D32";
    const LIGHT_RED = "FFFFEBEE";
    const LIGHT_GREEN = "FFE8F5E9";
    const GRAY = "FFF5F5F5";

    const headerStyle = (): Partial<ExcelJS.Style> => ({
      fill: { type: "pattern", pattern: "solid", fgColor: { argb: YELLOW } },
      font: { bold: true, color: { argb: BLACK }, size: 9 },
      alignment: { horizontal: "center", vertical: "middle", wrapText: true },
      border: {
        top: { style: "thin", color: { argb: BLACK } },
        bottom: { style: "thin", color: { argb: BLACK } },
        left: { style: "thin", color: { argb: BLACK } },
        right: { style: "thin", color: { argb: BLACK } },
      },
    });

    const thinBorder: Partial<ExcelJS.Style> = {
      border: {
        top: { style: "thin", color: { argb: "FFCCCCCC" } },
        bottom: { style: "thin", color: { argb: "FFCCCCCC" } },
        left: { style: "thin", color: { argb: "FFCCCCCC" } },
        right: { style: "thin", color: { argb: "FFCCCCCC" } },
      },
      font: { size: 9 },
      alignment: { vertical: "middle" },
    };

    // ── Sheet 1: Stock Opname (full table) ──────────────────────
    const ws = wb.addWorksheet("Stock Opname");

    ws.addRow(["Unit Kerja", ": Sensatia"]);
    ws.addRow(["Tanggal Audit", ":"]);
    ws.addRow(["Pukul", ": WITA"]);
    ws.addRow([]);
    ws.addRow([]);
    ws.addRow([]);

    const h1 = ws.getRow(5);
    h1.height = 22;
    ["A5","B5","C5","D5","E5","F5","G5","H5","I5","J5","K5"].forEach((addr) => Object.assign(ws.getCell(addr).style, headerStyle()));
    ws.getCell("A5").value = "No.";
    ws.getCell("B5").value = "Kode";
    ws.getCell("C5").value = "Nama Produk";
    ws.getCell("D5").value = "Price";
    ws.getCell("E5").value = "Stockwiz";
    ws.getCell("F5").value = "Jumlah Riil";
    ws.getCell("I5").value = "Total Selisih";
    ws.getCell("K5").value = "Status";
    ws.mergeCells("A5:A6"); ws.mergeCells("C5:C6"); ws.mergeCells("F5:H5"); ws.mergeCells("I5:J5"); ws.mergeCells("K5:K6");

    const h2 = ws.getRow(6);
    h2.height = 18;
    ["A6","B6","C6","D6","E6","F6","G6","H6","I6","J6","K6"].forEach((addr) => Object.assign(ws.getCell(addr).style, headerStyle()));
    ws.getCell("B6").value = "(Inci)"; ws.getCell("D6").value = "(Rp)"; ws.getCell("E6").value = "(SW)";
    ws.getCell("F6").value = "Store"; ws.getCell("G6").value = "Storage"; ws.getCell("H6").value = "Jumlah";
    ws.getCell("I6").value = "QTY"; ws.getCell("J6").value = "Value"; ws.getCell("K6").value = "Ket.";

    rows.forEach((row) => {
      const r = ws.addRow([row["No."], row["Kode (Inci)"], row["Nama Produk"], row["Price (Rp)"], row["Stockwiz (SW)"], row["Store"], row["Storage"], row["Jumlah Riil"], row["Selisih QTY"], row["Selisih Value"], row["Status"]]);
      r.height = 15;
      r.eachCell((cell, colNum) => {
        Object.assign(cell.style, thinBorder);
        if ([1, 4, 5, 6, 7, 8, 9].includes(colNum)) cell.style.alignment = { ...cell.style.alignment, horizontal: "center" };
        if (colNum === 10) { cell.style.alignment = { ...cell.style.alignment, horizontal: "right" }; if (typeof cell.value === "number") cell.numFmt = "#,##0"; }
        if (colNum === 4 && typeof cell.value === "number") cell.numFmt = "#,##0";
      });
      const statusCell = r.getCell(11);
      if (row["Status"] === "Minus") statusCell.style = { ...statusCell.style, font: { bold: true, color: { argb: RED }, size: 9 }, alignment: { horizontal: "center", vertical: "middle" } };
      else if (row["Status"] === "Plus" || row["Status"] === "OK") statusCell.style = { ...statusCell.style, font: { bold: true, color: { argb: GREEN }, size: 9 }, alignment: { horizontal: "center", vertical: "middle" } };
      if ((row["No."] as number) % 2 === 0) r.eachCell((cell) => { if (!(cell.style.fill as ExcelJS.FillPattern)?.fgColor) cell.style.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF9F9F9" } }; });
    });

    ws.columns = [{ width: 5 }, { width: 16 }, { width: 48 }, { width: 12 }, { width: 10 }, { width: 10 }, { width: 10 }, { width: 10 }, { width: 10 }, { width: 16 }, { width: 10 }];
    ws.views = [{ state: "frozen", ySplit: 6 }];

    // ── Sheet 2: Summary Selisih ─────────────────────────────────
    const ws2 = wb.addWorksheet("Summary Selisih");
    ws2.columns = [{ width: 18 }, { width: 48 }, { width: 8 }, { width: 9 }, { width: 11 }, { width: 11 }, { width: 13 }, { width: 20 }, { width: 12 }];

    const setStyle = (cell: ExcelJS.Cell, style: Partial<ExcelJS.Style>) => { cell.style = style; };
    const hdrStyle = headerStyle();
    const dataStyle = (fill?: string, bold?: boolean, color?: string, align?: ExcelJS.Alignment["horizontal"], numFmt?: string): Partial<ExcelJS.Style> => ({
      border: { top: { style: "thin", color: { argb: "FFCCCCCC" } }, bottom: { style: "thin", color: { argb: "FFCCCCCC" } }, left: { style: "thin", color: { argb: "FFCCCCCC" } }, right: { style: "thin", color: { argb: "FFCCCCCC" } } },
      fill: fill ? { type: "pattern", pattern: "solid", fgColor: { argb: fill } } : { type: "pattern", pattern: "none" },
      font: { bold: !!bold, size: 9, color: { argb: color ?? BLACK } },
      alignment: { horizontal: align ?? "left", vertical: "middle" },
      ...(numFmt ? { numFmt } : {}),
    });

    // Title rows
    const r1 = ws2.addRow(["RINGKASAN SELISIH — STOCK OPNAME SENSATIA"]);
    r1.height = 20;
    setStyle(r1.getCell(1), { font: { bold: true, size: 13, color: { argb: BLACK } }, alignment: { vertical: "middle" } });

    const r2 = ws2.addRow([`Tanggal Export: ${new Date().toLocaleDateString("id-ID")}`]);
    setStyle(r2.getCell(1), { font: { size: 9, color: { argb: "FF888888" } } });

    ws2.addRow([]);

    // Aggregate header
    const ah = ws2.addRow(["Metrik", "QTY", "Nilai (Rp)", "", "", "", "", "", ""]);
    ah.height = 18;
    [1, 2, 3].forEach(c => setStyle(ah.getCell(c), hdrStyle));

    // Aggregate data
    const aggItems: [string, number | string, number | string, boolean][] = [
      ["Produk Selisih", `${selisihRows.length} dari ${totalProducts} SKU`, "", false],
      ["Total Minus", totalMinusQty, totalMinusVal, false],
      ["Total Plus", `+${totalPlusQty}`, totalPlusVal > 0 ? `+${totalPlusVal.toLocaleString("id-ID")}` : totalPlusVal, false],
      ["Net Selisih", netQty > 0 ? `+${netQty}` : netQty, netValue, true],
    ];
    aggItems.forEach(([label, qty, val, isNet]) => {
      const row = ws2.addRow([label, qty, val]);
      row.height = 17;
      const color = isNet ? (netQty < 0 ? RED : GREEN) : BLACK;
      setStyle(row.getCell(1), dataStyle("FFFFFFFF", isNet, color));
      setStyle(row.getCell(2), dataStyle("FFFFFFFF", isNet, color, "right"));
      setStyle(row.getCell(3), dataStyle("FFFFFFFF", isNet, color, "right"));
    });

    ws2.addRow([]);
    ws2.addRow([]);

    // Detail header
    const dh = ws2.addRow(["Kode (Inci)", "Nama Produk", "SW", "Store", "Storage", "Jumlah", "Selisih QTY", "Selisih Value (Rp)", "Status"]);
    dh.height = 18;
    [1,2,3,4,5,6,7,8,9].forEach(c => setStyle(dh.getCell(c), hdrStyle));

    // Detail rows
    selisihRows.forEach((r, i) => {
      const isMinus = r.status === "Minus";
      const rowColor = i % 2 === 0 ? (isMinus ? LIGHT_RED : LIGHT_GREEN) : (isMinus ? "FFFFCDD2" : "FFC8E6C9");
      const textColor = isMinus ? RED : GREEN;
      const row = ws2.addRow([r.product.code, r.product.name, r.sw ?? "", r.store, r.storage, r.jumlahRiil, r.selisihQty ?? 0, r.selisihValue ?? 0, r.status]);
      row.height = 15;
      setStyle(row.getCell(1), dataStyle(rowColor, true, "FF3949AB"));        // code indigo bold
      setStyle(row.getCell(2), dataStyle(rowColor, false, BLACK));             // name
      setStyle(row.getCell(3), dataStyle(rowColor, false, BLACK, "center"));   // sw
      setStyle(row.getCell(4), dataStyle(rowColor, false, BLACK, "center"));   // store
      setStyle(row.getCell(5), dataStyle(rowColor, false, BLACK, "center"));   // storage
      setStyle(row.getCell(6), dataStyle(rowColor, true, BLACK, "center"));    // jumlah
      setStyle(row.getCell(7), dataStyle(rowColor, true, textColor, "center")); // selisih qty
      setStyle(row.getCell(8), { ...dataStyle(rowColor, true, textColor, "right", "#,##0") }); // selisih value
      setStyle(row.getCell(9), dataStyle(rowColor, true, textColor, "center")); // status
    });

    // Footer total
    const totalRow = ws2.addRow(["TOTAL", "", "", "", "", "", netQty, netValue, ""]);
    totalRow.height = 18;
    const netColor = netQty < 0 ? RED : GREEN;
    [1,2,3,4,5,6].forEach(c => setStyle(totalRow.getCell(c), dataStyle(GRAY, true, BLACK)));
    setStyle(totalRow.getCell(7), dataStyle(GRAY, true, netColor, "center"));
    setStyle(totalRow.getCell(8), { ...dataStyle(GRAY, true, netColor, "right", "#,##0") });
    setStyle(totalRow.getCell(9), dataStyle(GRAY, true, BLACK));

    const buf = await wb.xlsx.writeBuffer();
    const blob = new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `opname-sensatia-${new Date().toISOString().slice(0, 10)}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const progressPct = totalProducts > 0 ? Math.round((inputtedCount / totalProducts) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#F5F6FA] font-sans">
      {showTutorial && <TutorialModal onClose={() => setShowTutorial(false)} />}

      {/* ── Navbar ─────────────────────────────────────────────── */}
      <header className="bg-[#1A1D2E] text-white print:hidden">
        <div className="px-6 py-3 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-yellow-400 flex items-center justify-center">
              <span className="text-[#1A1D2E] font-black text-sm">S</span>
            </div>
            <div>
              <p className="text-[11px] text-white/50 leading-none">Sensatia Botanicals</p>
              <p className="text-sm font-bold leading-tight">Stock Opname</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Tutorial */}
            <button onClick={() => setShowTutorial(true)} title="Panduan"
              className="w-8 h-8 rounded-full border border-white/20 hover:border-yellow-400/60 hover:bg-yellow-400/10 text-white/50 hover:text-yellow-400 font-bold text-sm flex items-center justify-center transition-all">
              ?
            </button>

            <div className="w-px h-5 bg-white/10 mx-1" />

            {/* Upload */}
            <button onClick={() => inputRef.current?.click()}
              className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-[#1A1D2E] font-bold px-4 py-2 rounded-lg text-xs transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M8 12l4-4m0 0l4 4m-4-4v9" />
              </svg>
              Upload CSV
            </button>
            <input ref={inputRef} type="file" accept=".csv,.txt,.tsv" className="hidden" onChange={handleFileUpload} />

            <div className="w-px h-5 bg-white/10 mx-1" />

            {/* Export */}
            <button onClick={exportCSV}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white/80 hover:text-white px-3 py-2 rounded-lg text-xs font-medium transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12v6m0 0l-3-3m3 3l3-3M12 3v9" />
              </svg>
              CSV
            </button>
            <button onClick={() => exportExcel()}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white/80 hover:text-white px-3 py-2 rounded-lg text-xs font-medium transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-6h6v6M9 11V5h6v6M3 3h18v18H3z" />
              </svg>
              Excel
            </button>

            <div className="w-px h-5 bg-white/10 mx-1" />

            {/* Reset */}
            {!showResetConfirm ? (
              <button onClick={() => setShowResetConfirm(true)}
                className="flex items-center gap-1.5 bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/40 text-white/40 hover:text-red-400 px-3 py-2 rounded-lg text-xs font-medium transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-red-900/40 border border-red-500/40 px-3 py-1.5 rounded-lg">
                <span className="text-[11px] text-red-300 font-medium">Yakin reset?</span>
                <button onClick={handleReset} className="text-[11px] bg-red-500 hover:bg-red-600 text-white font-bold px-2 py-0.5 rounded">Ya</button>
                <button onClick={() => setShowResetConfirm(false)} className="text-[11px] text-white/40 hover:text-white/70">Batal</button>
              </div>
            )}

            <div className="w-px h-5 bg-white/10 mx-1" />

            {/* Print */}
            <button onClick={() => window.print()}
              className="flex items-center gap-1.5 bg-white hover:bg-gray-100 text-[#1A1D2E] font-bold px-3 py-2 rounded-lg text-xs transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6v-8z" />
              </svg>
              Print
            </button>
          </div>
        </div>
      </header>

      {/* ── Stats Cards ─────────────────────────────────────────── */}
      <div className="px-6 py-4 grid grid-cols-4 gap-3 print:hidden">
        {/* Total SKU */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#1A1D2E]/5 flex items-center justify-center text-[#1A1D2E]">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Total SKU</p>
            <p className="text-xl font-black text-gray-900">{totalProducts}</p>
          </div>
        </div>

        {/* Stockwiz */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${matchedCount > 0 ? "bg-emerald-50 text-emerald-600" : "bg-gray-50 text-gray-400"}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Stockwiz Loaded</p>
            <p className={`text-xl font-black ${matchedCount > 0 ? "text-emerald-600" : "text-gray-300"}`}>{matchedCount}</p>
          </div>
        </div>

        {/* Sudah Input */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${inputtedCount > 0 ? "bg-yellow-50 text-yellow-600" : "bg-gray-50 text-gray-400"}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Sudah Diinput</p>
            <p className="text-xl font-black text-gray-900">{inputtedCount}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Progress</p>
            <p className="text-xs font-black text-gray-900">{progressPct}%</p>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="text-[10px] text-gray-400 mt-1.5">{inputtedCount} dari {totalProducts} produk</p>
        </div>
      </div>

      {/* File info & debug */}
      {fileName && (
        <div className="px-6 pb-2 print:hidden">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="italic">{fileName}</span>
          </div>
        </div>
      )}
      {debug && matchedCount === 0 && (
        <div className="mx-6 mb-3 bg-red-50 border border-red-200 rounded-xl p-3 text-xs font-mono text-red-600 print:hidden">
          <p className="font-bold mb-1">⚠ 0 produk ter-match — {debug.totalLines} baris. 5 baris pertama:</p>
          {debug.firstLines.map((l, i) => <p key={i} className="truncate">[{i}]: {JSON.stringify(l)}</p>)}
        </div>
      )}

      {/* ── Print Header + Summary ──────────────────────────────── */}
      <div className="hidden print:block px-6 pt-4 pb-2 text-xs">
        <p className="font-bold text-base mb-2">Stock Opname — Sensatia Botanicals</p>
        <div className="flex gap-8 mb-3">
          <span><b>Unit Kerja</b> : Sensatia</span>
          <span><b>Tanggal Audit</b> :</span>
          <span><b>Pukul</b> : WITA</span>
        </div>

        {/* Print summary aggregates */}
        {(() => {
          const { selisihRows, totalMinusQty, totalPlusQty, totalMinusVal, totalPlusVal, netQty, netValue } = buildSummary();
          if (selisihRows.length === 0) return <hr className="my-3" />;
          return (
            <>
              <hr className="my-3" />
              <p className="font-bold text-sm mb-2">Ringkasan Selisih</p>
              <table style={{ width: "auto", borderCollapse: "collapse", marginBottom: "8px" }}>
                <thead>
                  <tr style={{ backgroundColor: "#FDD835" }}>
                    <th style={{ border: "1px solid #999", padding: "2px 8px" }}>Metrik</th>
                    <th style={{ border: "1px solid #999", padding: "2px 8px" }}>QTY</th>
                    <th style={{ border: "1px solid #999", padding: "2px 8px" }}>Nilai (Rp)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td style={{ border: "1px solid #ccc", padding: "2px 8px" }}>Produk Selisih</td><td style={{ border: "1px solid #ccc", padding: "2px 8px", textAlign: "right" }}>{selisihRows.length}</td><td style={{ border: "1px solid #ccc", padding: "2px 8px" }}></td></tr>
                  <tr><td style={{ border: "1px solid #ccc", padding: "2px 8px" }}>Total Minus</td><td style={{ border: "1px solid #ccc", padding: "2px 8px", textAlign: "right", color: "#cc0000", fontWeight: "bold" }}>{totalMinusQty}</td><td style={{ border: "1px solid #ccc", padding: "2px 8px", textAlign: "right", color: "#cc0000", fontWeight: "bold" }}>{totalMinusVal.toLocaleString("id-ID")}</td></tr>
                  <tr><td style={{ border: "1px solid #ccc", padding: "2px 8px" }}>Total Plus</td><td style={{ border: "1px solid #ccc", padding: "2px 8px", textAlign: "right", color: "#2e7d32", fontWeight: "bold" }}>+{totalPlusQty}</td><td style={{ border: "1px solid #ccc", padding: "2px 8px", textAlign: "right", color: "#2e7d32", fontWeight: "bold" }}>+{totalPlusVal.toLocaleString("id-ID")}</td></tr>
                  <tr style={{ backgroundColor: "#f5f5f5", fontWeight: "bold" }}><td style={{ border: "1px solid #999", padding: "2px 8px" }}>Net Selisih</td><td style={{ border: "1px solid #999", padding: "2px 8px", textAlign: "right", color: netQty < 0 ? "#cc0000" : "#2e7d32" }}>{netQty > 0 ? "+" : ""}{netQty}</td><td style={{ border: "1px solid #999", padding: "2px 8px", textAlign: "right", color: netValue < 0 ? "#cc0000" : "#2e7d32" }}>{netValue > 0 ? "+" : ""}{netValue.toLocaleString("id-ID")}</td></tr>
                </tbody>
              </table>

              <p className="font-bold text-sm mb-1">Daftar Produk Selisih ({selisihRows.length} produk)</p>
              <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "12px" }}>
                <thead>
                  <tr style={{ backgroundColor: "#FDD835" }}>
                    {["Kode","Nama Produk","SW","Store","Storage","Jumlah","Selisih QTY","Selisih Value","Status"].map(h => (
                      <th key={h} style={{ border: "1px solid #999", padding: "2px 4px" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {selisihRows.map(r => (
                    <tr key={r.product.code} style={{ backgroundColor: r.status === "Minus" ? "#fff8f8" : "#f0fff4" }}>
                      <td style={{ border: "1px solid #ccc", padding: "2px 4px", fontFamily: "monospace" }}>{r.product.code}</td>
                      <td style={{ border: "1px solid #ccc", padding: "2px 4px" }}>{r.product.name}</td>
                      <td style={{ border: "1px solid #ccc", padding: "2px 4px", textAlign: "center" }}>{r.sw ?? ""}</td>
                      <td style={{ border: "1px solid #ccc", padding: "2px 4px", textAlign: "center" }}>{r.store}</td>
                      <td style={{ border: "1px solid #ccc", padding: "2px 4px", textAlign: "center" }}>{r.storage}</td>
                      <td style={{ border: "1px solid #ccc", padding: "2px 4px", textAlign: "center", fontWeight: "bold" }}>{r.jumlahRiil}</td>
                      <td style={{ border: "1px solid #ccc", padding: "2px 4px", textAlign: "center", fontWeight: "bold", color: r.selisihQty! < 0 ? "#cc0000" : "#2e7d32" }}>{r.selisihQty! > 0 ? "+" : ""}{r.selisihQty}</td>
                      <td style={{ border: "1px solid #ccc", padding: "2px 4px", textAlign: "right", color: r.selisihValue !== undefined && r.selisihValue < 0 ? "#cc0000" : "#2e7d32" }}>{r.selisihValue !== undefined ? (r.selisihValue > 0 ? "+" : "") + r.selisihValue.toLocaleString("id-ID") : ""}</td>
                      <td style={{ border: "1px solid #ccc", padding: "2px 4px", textAlign: "center", fontWeight: "bold", color: r.status === "Minus" ? "#cc0000" : "#2e7d32" }}>{r.status}</td>
                    </tr>
                  ))}
                  <tr style={{ backgroundColor: "#f5f5f5", fontWeight: "bold" }}>
                    <td colSpan={6} style={{ border: "1px solid #999", padding: "2px 4px" }}>TOTAL</td>
                    <td style={{ border: "1px solid #999", padding: "2px 4px", textAlign: "center", color: netQty < 0 ? "#cc0000" : "#2e7d32" }}>{netQty > 0 ? "+" : ""}{netQty}</td>
                    <td style={{ border: "1px solid #999", padding: "2px 4px", textAlign: "right", color: netValue < 0 ? "#cc0000" : "#2e7d32" }}>{netValue > 0 ? "+" : ""}{netValue.toLocaleString("id-ID")}</td>
                    <td style={{ border: "1px solid #999", padding: "2px 4px" }}></td>
                  </tr>
                </tbody>
              </table>
              <hr className="my-3" />
              <p className="font-bold text-sm mb-2">Detail Semua Produk</p>
            </>
          );
        })()}
      </div>

      {/* ── Summary Selisih ──────────────────────────────────────── */}
      {(() => {
        const selisihRows = products.map((product) => {
          const filled = csvData[product.code];
          const sw = filled?.stockwiz;
          const price = filled?.price;
          const store = storeQty[product.code] ?? 0;
          const storage = storageQty[product.code] ?? 0;
          const hasInput = storeQty[product.code] !== undefined || storageQty[product.code] !== undefined;
          const jumlahRiil = store + storage;
          const selisihQty = hasInput && sw !== undefined ? jumlahRiil - sw : undefined;
          const selisihValue = selisihQty !== undefined && price !== undefined && price > 1 ? selisihQty * price : undefined;
          const status = selisihQty === undefined ? "" : selisihQty < 0 ? "Minus" : selisihQty > 0 ? "Plus" : "OK";
          return { product, sw, price, store, storage, jumlahRiil, selisihQty, selisihValue, status };
        }).filter(r => r.selisihQty !== undefined && r.selisihQty !== 0);

        if (selisihRows.length === 0) return null;

        const totalMinusQty = selisihRows.filter(r => r.selisihQty! < 0).reduce((s, r) => s + r.selisihQty!, 0);
        const totalPlusQty  = selisihRows.filter(r => r.selisihQty! > 0).reduce((s, r) => s + r.selisihQty!, 0);
        const totalMinusVal = selisihRows.filter(r => r.selisihValue !== undefined && r.selisihValue < 0).reduce((s, r) => s + r.selisihValue!, 0);
        const totalPlusVal  = selisihRows.filter(r => r.selisihValue !== undefined && r.selisihValue > 0).reduce((s, r) => s + r.selisihValue!, 0);
        const netQty   = totalPlusQty + totalMinusQty;
        const netValue = totalPlusVal + totalMinusVal;

        return (
          <div className="px-6 pb-6 print:hidden">
            {/* Summary cards */}
            <div className="grid grid-cols-4 gap-3 mb-4">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3">
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-1">Produk Selisih</p>
                <p className="text-2xl font-black text-gray-900">{selisihRows.length}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">dari {totalProducts} SKU</p>
              </div>
              <div className="bg-white rounded-xl border border-red-100 shadow-sm px-4 py-3">
                <p className="text-[10px] text-red-400 font-medium uppercase tracking-wide mb-1">Total Minus</p>
                <p className="text-2xl font-black text-red-500">{totalMinusQty} pcs</p>
                <p className="text-[10px] text-red-400 mt-0.5">{totalMinusVal.toLocaleString("id-ID")} Rp</p>
              </div>
              <div className="bg-white rounded-xl border border-emerald-100 shadow-sm px-4 py-3">
                <p className="text-[10px] text-emerald-400 font-medium uppercase tracking-wide mb-1">Total Plus</p>
                <p className="text-2xl font-black text-emerald-600">+{totalPlusQty} pcs</p>
                <p className="text-[10px] text-emerald-500 mt-0.5">+{totalPlusVal.toLocaleString("id-ID")} Rp</p>
              </div>
              <div className={`bg-white rounded-xl border shadow-sm px-4 py-3 ${netValue < 0 ? "border-red-100" : netValue > 0 ? "border-emerald-100" : "border-gray-100"}`}>
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-1">Net Selisih</p>
                <p className={`text-2xl font-black ${netQty < 0 ? "text-red-500" : netQty > 0 ? "text-emerald-600" : "text-gray-700"}`}>
                  {netQty > 0 ? "+" : ""}{netQty} pcs
                </p>
                <p className={`text-[10px] mt-0.5 ${netValue < 0 ? "text-red-400" : netValue > 0 ? "text-emerald-500" : "text-gray-400"}`}>
                  {netValue > 0 ? "+" : ""}{netValue.toLocaleString("id-ID")} Rp
                </p>
              </div>
            </div>

            {/* Selisih table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-5 bg-yellow-400 rounded-full" />
                  <h3 className="text-sm font-bold text-gray-800">Daftar Produk Selisih</h3>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{selisihRows.length} produk</span>
                </div>
              </div>
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase tracking-wide">
                    <th className="px-4 py-2.5 text-left border-b border-gray-100">Kode</th>
                    <th className="px-4 py-2.5 text-left border-b border-gray-100">Nama Produk</th>
                    <th className="px-4 py-2.5 text-center border-b border-gray-100">SW</th>
                    <th className="px-4 py-2.5 text-center border-b border-gray-100">Store</th>
                    <th className="px-4 py-2.5 text-center border-b border-gray-100">Storage</th>
                    <th className="px-4 py-2.5 text-center border-b border-gray-100">Jumlah</th>
                    <th className="px-4 py-2.5 text-center border-b border-gray-100">Selisih QTY</th>
                    <th className="px-4 py-2.5 text-right border-b border-gray-100">Selisih Value</th>
                    <th className="px-4 py-2.5 text-center border-b border-gray-100">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {selisihRows.map(({ product, sw, store, storage, jumlahRiil, selisihQty, selisihValue, status }) => (
                    <tr key={product.code} className={`hover:bg-gray-50 transition-colors ${status === "Minus" ? "bg-red-50/30" : "bg-emerald-50/20"}`}>
                      <td className="px-4 py-3 font-mono text-sm font-bold text-indigo-600 whitespace-nowrap">{product.code}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-800">{product.name}</td>
                      <td className="px-4 py-3 text-center text-sm text-gray-600">{sw ?? "—"}</td>
                      <td className="px-4 py-3 text-center text-sm text-gray-600">{store}</td>
                      <td className="px-4 py-3 text-center text-sm text-gray-600">{storage}</td>
                      <td className="px-4 py-3 text-center text-sm font-bold text-gray-800">{jumlahRiil}</td>
                      <td className={`px-4 py-3 text-center text-sm font-black ${selisihQty! < 0 ? "text-red-500" : "text-emerald-600"}`}>
                        {selisihQty! > 0 ? "+" : ""}{selisihQty}
                      </td>
                      <td className={`px-4 py-3 text-right text-sm font-semibold whitespace-nowrap ${selisihValue !== undefined && selisihValue < 0 ? "text-red-500" : "text-emerald-600"}`}>
                        {selisihValue !== undefined ? (selisihValue > 0 ? "+" : "") + selisihValue.toLocaleString("id-ID") : "—"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {status === "Minus" && <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 border border-red-200 text-xs font-bold px-2.5 py-1 rounded-full">↓ Minus</span>}
                        {status === "Plus"  && <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-2.5 py-1 rounded-full">↑ Plus</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50 border-t-2 border-gray-200 font-bold text-sm">
                    <td colSpan={6} className="px-4 py-3 text-gray-700">Total</td>
                    <td className={`px-4 py-3 text-center font-black text-base ${netQty < 0 ? "text-red-500" : netQty > 0 ? "text-emerald-600" : "text-gray-700"}`}>
                      {netQty > 0 ? "+" : ""}{netQty}
                    </td>
                    <td className={`px-4 py-3 text-right font-black text-sm whitespace-nowrap ${netValue < 0 ? "text-red-500" : netValue > 0 ? "text-emerald-600" : "text-gray-700"}`}>
                      {netValue > 0 ? "+" : ""}{netValue.toLocaleString("id-ID")}
                    </td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        );
      })()}

      {/* ── Table ───────────────────────────────────────────────── */}
      <div className="px-6 pb-8 overflow-x-auto">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[#FDD835] text-[#1A1D2E] font-bold text-center text-sm">
                <th className="border-b-2 border-yellow-400 px-3 py-3.5" rowSpan={2}>No.</th>
                <th className="border-b border-yellow-400 px-3 py-3.5">Kode</th>
                <th className="border-b-2 border-yellow-400 px-4 py-3.5 text-left" rowSpan={2}>Nama Produk</th>
                <th className="border-b border-yellow-400 px-3 py-3.5">Price</th>
                <th className="border-b border-yellow-400 px-3 py-3.5">Stockwiz</th>
                <th className="border-b border-yellow-400 px-3 py-3.5" colSpan={3}>Jumlah Riil</th>
                <th className="border-b border-yellow-400 px-3 py-3.5" colSpan={2}>Total Selisih</th>
                <th className="border-b-2 border-yellow-400 px-3 py-3.5">Status</th>
              </tr>
              <tr className="bg-[#FDD835] text-[#1A1D2E]/70 font-semibold text-center text-xs">
                <th className="border-b-2 border-yellow-500 px-3 py-2.5">(Inci)</th>
                <th className="border-b-2 border-yellow-500 px-3 py-2.5">(Rp)</th>
                <th className="border-b-2 border-yellow-500 px-3 py-2.5">(SW)</th>
                <th className="border-b-2 border-yellow-500 px-3 py-2.5 bg-yellow-300/60">Store</th>
                <th className="border-b-2 border-yellow-500 px-3 py-2.5 bg-yellow-300/60">Storage</th>
                <th className="border-b-2 border-yellow-500 px-3 py-2.5">Jumlah</th>
                <th className="border-b-2 border-yellow-500 px-3 py-2.5">QTY</th>
                <th className="border-b-2 border-yellow-500 px-3 py-2.5">Value</th>
                <th className="border-b-2 border-yellow-500 px-3 py-2.5">Ket.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((product, index) => {
                const filled = csvData[product.code];
                const sw = filled?.stockwiz;
                const price = filled?.price;
                const store = storeQty[product.code] ?? 0;
                const storage = storageQty[product.code] ?? 0;
                const hasInput = storeQty[product.code] !== undefined || storageQty[product.code] !== undefined;
                const jumlahRiil = store + storage;
                const selisihQty = hasInput && sw !== undefined ? jumlahRiil - sw : undefined;
                const selisihValue = selisihQty !== undefined && price !== undefined && price > 1 ? selisihQty * price : undefined;
                const status = selisihQty === undefined ? "" : selisihQty < 0 ? "Minus" : selisihQty > 0 ? "Plus" : "OK";
                const isEven = index % 2 === 1;

                return (
                  <tr key={product.code}
                    className={`group transition-colors ${
                      hasInput ? "bg-yellow-50/70 hover:bg-yellow-50" :
                      filled ? isEven ? "bg-blue-50/30 hover:bg-blue-50/60" : "bg-white hover:bg-blue-50/30" :
                      isEven ? "bg-gray-50/60 hover:bg-gray-100/60" : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-3 py-2.5 text-center text-gray-300 text-xs font-medium border-r border-gray-100">
                      {index + 1}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-xs font-bold text-indigo-600 whitespace-nowrap border-r border-gray-100">
                      {product.code}
                    </td>
                    <td className="px-4 py-2.5 text-gray-800 text-sm font-semibold border-r border-gray-100">
                      {product.name}
                    </td>
                    <td className="px-3 py-2.5 text-right text-gray-600 whitespace-nowrap text-sm border-r border-gray-100">
                      {price !== undefined && price > 1 ? price.toLocaleString("id-ID") : ""}
                    </td>
                    <td className="px-3 py-2.5 text-center font-semibold text-gray-700 text-sm border-r border-gray-100">
                      {sw !== undefined ? sw : ""}
                    </td>

                    {/* Store input */}
                    <td className="px-2 py-1.5 border-r border-gray-100 bg-amber-50/40">
                      <input
                        type="number"
                        value={storeQty[product.code] ?? ""}
                        onChange={(e) => setStoreQty((prev) => ({ ...prev, [product.code]: e.target.value === "" ? undefined as unknown as number : parseInt(e.target.value) || 0 }))}
                        className="w-20 text-center text-sm font-medium outline-none bg-transparent placeholder-gray-300 focus:bg-yellow-100 rounded-md py-1 transition-colors"
                        placeholder="—"
                      />
                    </td>
                    {/* Storage input */}
                    <td className="px-2 py-1.5 border-r border-gray-100 bg-amber-50/40">
                      <input
                        type="number"
                        value={storageQty[product.code] ?? ""}
                        onChange={(e) => setStorageQty((prev) => ({ ...prev, [product.code]: e.target.value === "" ? undefined as unknown as number : parseInt(e.target.value) || 0 }))}
                        className="w-20 text-center text-sm font-medium outline-none bg-transparent placeholder-gray-300 focus:bg-yellow-100 rounded-md py-1 transition-colors"
                        placeholder="—"
                      />
                    </td>

                    {/* Jumlah */}
                    <td className="px-3 py-2.5 text-center font-bold text-gray-800 text-sm border-r border-gray-100">
                      {hasInput ? jumlahRiil : ""}
                    </td>
                    {/* Selisih QTY */}
                    <td className={`px-3 py-2.5 text-center font-bold text-sm border-r border-gray-100 ${
                      selisihQty !== undefined && selisihQty < 0 ? "text-red-500" :
                      selisihQty !== undefined && selisihQty > 0 ? "text-emerald-600" : "text-gray-500"}`}>
                      {selisihQty !== undefined ? selisihQty : ""}
                    </td>
                    {/* Selisih Value */}
                    <td className={`px-3 py-2.5 text-right font-medium whitespace-nowrap text-sm border-r border-gray-100 ${
                      selisihValue !== undefined && selisihValue < 0 ? "text-red-500" :
                      selisihValue !== undefined && selisihValue > 0 ? "text-emerald-600" : "text-gray-500"}`}>
                      {selisihValue !== undefined ? selisihValue.toLocaleString("id-ID") : ""}
                    </td>
                    {/* Status */}
                    <td className="px-2 py-2.5 text-center">
                      {status === "Minus" && <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 border border-red-100 text-xs font-bold px-2.5 py-0.5 rounded-full">↓ Minus</span>}
                      {status === "Plus"  && <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs font-bold px-2.5 py-0.5 rounded-full">↑ Plus</span>}
                      {status === "OK"    && <span className="inline-flex items-center gap-1 bg-gray-50 text-gray-500 border border-gray-100 text-xs font-bold px-2.5 py-0.5 rounded-full">✓ OK</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
