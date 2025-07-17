import React, { useState } from "react";
import LabDatePicker from "./components/LabDatePicker";
import ScheduleTable from "./components/ScheduleTable";
import MachineMap from "./components/MachineMap";
import dayjs from "dayjs";
import { DAYS, TIME_SLOTS } from "./constants";
import BookingForm from "./components/BookingForm";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import PasswordModal from "./components/PasswordModal";
import ManagerModal from "./components/ManagerModal";

// Khởi tạo dữ liệu mẫu (sau này sẽ lấy từ backend)

function getStartOfWeek(date) {
  return dayjs(date).startOf("week");
}

function exportBookingsToExcel(bookings) {
  const ws = XLSX.utils.json_to_sheet(bookings);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Bookings");
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  saveAs(
    new Blob([excelBuffer], { type: "application/octet-stream" }),
    "booking-report.xlsx"
  );
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
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [bookingList, setBookingList] = useState([]); // Danh sách các booking đã đăng ký
  const [showManager, setShowManager] = useState(false); // Modal quản lý
  const [showPwModal, setShowPwModal] = useState(false); // Modal nhập mật khẩu

  const ADMIN_PASSWORD = "123456"; // Mật khẩu ADMIN

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
    setSelectedMachine(num); // Ghi nhận máy vừa chọn
    setShowBookingForm(true); // Mở form đăng ký
    // setShowMap(false);            // Không cần tắt bản đồ, để form nổi lên trên map
  };

  const weekDates = Array.from({ length: 7 }).map((_, i) =>
    dayjs(weekStartDate).add(i, "day")
  );

  const handleCloseBookingForm = () => {
    setShowBookingForm(false);
    setSelectedMachine(null);
    setShowMap(false); // Đóng luôn bản đồ máy nếu cần
  };

  // Danh sách máy đã bị book cho đúng ngày/slot
  const bookedMachines =
    scheduleData[selectedDayIdx]?.[selectedSlotIdx]?.bookedMachines || [];

  return (
    <div className="max-w-5xl mx-auto p-6">
      <button
        className="float-right px-4 py-1 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600 shadow mb-4"
        onClick={() => setShowPwModal(true)}
      >
        Quản lý / Export báo cáo
      </button>
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

      {showBookingForm && (
        <BookingForm
          machineNumber={selectedMachine}
          onSubmit={(formData) => {
            setBookingList((prev) => [
              ...prev,
              {
                date: weekDates[selectedDayIdx].format("DD/MM/YYYY"),
                slot: TIME_SLOTS[selectedSlotIdx],
                machineNumber: formData.machineNumber,
                fullname: formData.fullname,
                email: formData.email,
                teacherClass: formData.teacherClass,
              },
            ]);
            alert(
              `Đăng ký thành công:\nHọ tên: ${formData.fullname}\nEmail: ${formData.email}\nLớp: ${formData.teacherClass}\nMáy: ${formData.machineNumber}`
            );
            handleCloseBookingForm();
          }}
          onCancel={handleCloseBookingForm}
        />
      )}

      {/* Modal nhập mật khẩu quản lý */}
      {showPwModal && (
        <PasswordModal
          onSubmit={(pw) => {
            if (pw === ADMIN_PASSWORD) {
              setShowManager(true);
              setShowPwModal(false);
            } else {
              alert("Sai mật khẩu!");
            }
          }}
          onCancel={() => setShowPwModal(false)}
        />
      )}
      {/* Modal quản lý bookings */}
      {showManager && (
        <ManagerModal
          bookings={bookingList}
          onExport={() => exportBookingsToExcel(bookingList)}
          onClose={() => setShowManager(false)}
          onDelete={(idx) => {
            setBookingList((list) => list.filter((_, i) => i !== idx));
          }}
        />
      )}
    </div>
  );
}

export default App;
