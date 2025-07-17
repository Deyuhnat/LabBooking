import React, { useState } from "react";
import LabDatePicker from "./components/LabDatePicker";
import ScheduleTable from "./components/ScheduleTable";
import MachineMap from "./components/MachineMap";
import dayjs from "dayjs";
import { DAYS, TIME_SLOTS } from "./constants";

// Khởi tạo dữ liệu mẫu (sau này sẽ lấy từ backend)

function getStartOfWeek(date) {
  return dayjs(date).startOf("week");
}

const defaultScheduleData = Array(7)
  .fill(0)
  .map(() =>
    Array(9)
      .fill(0)
      .map(() => ({
        free: Math.floor(Math.random() * 61),
        booked: Math.floor(Math.random() * 61),
      }))
  );

function App() {
  const [weekStartDate, setWeekStartDate] = useState(
    getStartOfWeek(new Date())
  );
  const [scheduleData, setScheduleData] = useState(defaultScheduleData);
  const [showMap, setShowMap] = useState(false);
  const [selectedDayIdx, setSelectedDayIdx] = useState(null);
  const [selectedSlotIdx, setSelectedSlotIdx] = useState(null);

  // Giả lập danh sách máy đã bị book cho slot đang chọn
  // Sau này lấy từ API theo selectedDate và currentSlotIdx

  // Xử lý khi đổi ngày (sau này gọi API để lấy lịch theo ngày)
  const handleChangeWeek = (date) => {
    setWeekStartDate(date.startOf("day").toDate());
    // Gọi API lấy data mới nếu có
  };

  // Xử lý khi bấm chọn máy
  const handleSelectSlot = (dayIdx, slotIdx) => {
    setSelectedDayIdx(dayIdx);
    setSelectedSlotIdx(slotIdx);
    setShowMap(true);
  };

  const handleSelectMachine = (num) => {
    alert(
      `Bạn chọn máy số ${num} cho ${DAYS[selectedDayIdx]} - ${TIME_SLOTS[selectedSlotIdx]}`
    );
    setShowMap(false);
    // Tiếp tục: mở form nhập thông tin đăng ký máy
  };

  const weekDates = Array.from({ length: 7 }).map((_, i) =>
    dayjs(weekStartDate).add(i, "day")
  );

  // Danh sách máy đã bị book cho đúng ngày/slot
  const bookedMachines =
    scheduleData[selectedDayIdx]?.[selectedSlotIdx]?.bookedMachines || [];

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-blue-700 tracking-tight">
        Đặt máy phòng LAB
      </h1>
      <LabDatePicker
        weekStartDate={weekStartDate}
        onChangeWeek={handleChangeWeek}
      />
      <ScheduleTable
        scheduleData={scheduleData}
        onSelectSlot={handleSelectSlot}
        weekDates={weekDates}
      />
      {showMap && (
        <MachineMap
          bookedMachines={bookedMachines}
          onSelect={handleSelectMachine}
          onClose={() => setShowMap(false)}
        />
      )}
    </div>
  );
}

export default App;
