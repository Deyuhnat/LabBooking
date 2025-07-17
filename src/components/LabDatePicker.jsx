import React from "react";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
dayjs.extend(isoWeek);

const WEEKDAYS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

export default function LabDatePicker({ weekStartDate, onChangeWeek }) {
  // Tính dãy ngày trong tuần để hiện đúng tháng/năm
  const weekDates = Array.from({ length: 7 }).map((_, i) =>
    dayjs(weekStartDate).add(i, "day")
  );
  const monthStr =
    weekDates[0].month() === weekDates[6].month()
      ? `Tháng ${weekDates[0].month() + 1} ${weekDates[0].year()}`
      : `Tháng ${weekDates[0].month() + 1} - Tháng ${
          weekDates[6].month() + 1
        }, ${weekDates[6].year()}`;
  return (
    <div className="flex items-center justify-between mb-2">
      <button
        onClick={() => onChangeWeek(dayjs(weekStartDate).subtract(1, "week"))}
        className="px-3 py-1 rounded bg-gray-100 hover:bg-blue-200 transition font-bold text-lg"
      >
        {"<"}
      </button>
      <span className="font-semibold text-lg">{monthStr}</span>
      <button
        onClick={() => onChangeWeek(dayjs(weekStartDate).add(1, "week"))}
        className="px-3 py-1 rounded bg-gray-100 hover:bg-blue-200 transition font-bold text-lg"
      >
        {">"}
      </button>
    </div>
  );
}
