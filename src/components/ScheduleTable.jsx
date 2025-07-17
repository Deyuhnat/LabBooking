import React from "react";
import { TIME_SLOTS, DAYS } from "../constants";

export default function ScheduleTable({
  scheduleData,
  onSelectSlot,
  weekDates,
}) {
  return (
    <div className="overflow-x-auto shadow rounded-lg border border-gray-200 bg-white">
      <table className="min-w-full text-center table-fixed">
        <thead>
          <tr className=" text-gray-700">
            <th className="w-28 py-3 font-medium text-sm border-b border-gray-200 sticky left-0 bg-inherit z-10"></th>
            {DAYS.map((day, i) => (
              <th
                key={i}
                className="py-1 font-medium text-xs border-b border-gray-200"
              >
                <div className="flex flex-col items-center">
                  <span>{day}</span>
                  <span
                    className={
                      "text-base font-medium mt-1 rounded-full w-8 h-8 flex items-center justify-center" +
                      (weekDates?.[i]?.isSame(new Date(), "date")
                        ? " bg-red-500 text-white ring-2 ring-red-400"
                        : " bg-blue-50 text-black ")
                    }
                  >
                    {weekDates?.[i]?.date()}
                  </span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TIME_SLOTS.map((slot, slotIdx) => (
            <tr key={slot} className="hover:bg-blue-50 transition">
              <td className="text-xs font-medium border-b border-gray-100 sticky left-0 bg-white/90 z-10">
                {slot}
              </td>
              {DAYS.map((_, dayIdx) => {
                const slotData = scheduleData[dayIdx]?.[slotIdx] || {
                  free: 60,
                  booked: 0,
                };
                const busy = slotData.booked > 0;
                return (
                  <td
                    key={dayIdx}
                    className={
                      "p-0 align-top border-b border-gray-100 group " +
                      (busy ? "bg-red-50" : "")
                    }
                  >
                    <div className="h-20 flex flex-col items-center justify-center relative">
                      <div className="text-xs mb-1">
                        <span className="text-green-700 font-medium">
                          Trống: {slotData.free}
                        </span>
                        <span className="mx-1">|</span>
                        <span className="text-red-500 font-medium">
                          Bận: {slotData.booked}
                        </span>
                      </div>
                      <button
                        onClick={() => onSelectSlot(dayIdx, slotIdx)}
                        className="opacity-90 bg-blue-500 text-white text-xs px-2 py-1 rounded shadow transition hover:bg-blue-600 hover:scale-105 active:scale-95"
                      >
                        Chọn máy
                      </button>
                      <span className="absolute inset-0 border-2 border-transparent group-hover:border-blue-400 rounded pointer-events-none transition"></span>
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
