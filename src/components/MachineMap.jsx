import React from "react";
import { MACHINE_LAYOUT } from "../constants";
// import { X } from "lucide-react"; // Nếu dùng icon, không bắt buộc

export default function MachineMap({ bookedMachines = [], onSelect, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-auto">
        {/* Header... */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-xl text-blue-700 tracking-tight">
            Chọn máy tính
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-red-100 transition"
            title="Đóng"
          >
            <span className="text-2xl text-red-500 font-bold">×</span>
          </button>
        </div>
        {/* Grid máy */}
        <div className="grid grid-cols-6 gap-2 sm:gap-3 px-2 py-2 bg-gradient-to-r from-blue-50 via-white to-cyan-50 rounded-xl">
          {MACHINE_LAYOUT.map((row, rowIdx) =>
            row.map((num, colIdx) =>
              num ? (
                <button
                  key={num}
                  className={
                    "flex flex-col items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-2xl font-semibold shadow-sm border-2 text-center text-base transition-all duration-100 mb-1 " +
                    (bookedMachines.includes(num)
                      ? "bg-red-200 border-red-400 text-red-600 cursor-not-allowed opacity-60"
                      : "bg-white border-blue-200 hover:border-blue-500 hover:bg-blue-100 cursor-pointer")
                  }
                  disabled={bookedMachines.includes(num)}
                  onClick={() => onSelect(num)}
                  tabIndex={num}
                >
                  <span className="text-lg sm:text-2xl mb-1">💻</span>
                  <span className="text-xs sm:text-sm">{num}</span>
                </button>
              ) : (
                <div
                  key={`empty-${rowIdx}-${colIdx}`}
                  className="w-12 h-12 sm:w-16 sm:h-16"
                />
              )
            )
          )}
        </div>
        <div className="mt-5 flex items-center justify-end">
          <span className="w-4 h-4 inline-block rounded bg-blue-100 border border-blue-300 mr-2"></span>
          <span className="text-sm mr-6">Máy trống</span>
          <span className="w-4 h-4 inline-block rounded bg-red-200 border border-red-400 mr-2"></span>
          <span className="text-sm">Đã được đặt</span>
        </div>
      </div>
    </div>
  );
}
