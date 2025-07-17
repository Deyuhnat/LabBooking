import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
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

// Cấu hình API backend
const API_URL = "http://localhost:3001/api";

function getStartOfWeek(date) {
  return dayjs(date).startOf("week");
}

function exportBookingsToExcel(bookings) {
  // Ẩn các field _id, __v khi export
  const exportData = bookings.map((b, i) => ({
    STT: i + 1,
    Ngày: b.date,
    "Khung giờ": b.slot,
    Máy: b.machineNumber,
    "Họ tên": b.fullname,
    Email: b.email,
    Lớp: b.teacherClass,
  }));
  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Bookings");
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  saveAs(
    new Blob([excelBuffer], { type: "application/octet-stream" }),
    "booking-report.xlsx"
  );
}

// const defaultScheduleData = Array(7)
//   .fill(0)
//   .map(() =>
//     Array(9)
//       .fill(0)
//       .map(() => ({
//         free: Math.floor(Math.random() * 61),
//         booked: Math.floor(Math.random() * 61),
//       }))
//   );

function App() {
  const [weekStartDate, setWeekStartDate] = useState(
    getStartOfWeek(new Date())
  );
  // const [scheduleData, setScheduleData] = useState(defaultScheduleData);
  const [showMap, setShowMap] = useState(false);
  const [selectedDayIdx, setSelectedDayIdx] = useState(null);
  const [selectedSlotIdx, setSelectedSlotIdx] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [bookingList, setBookingList] = useState([]); // Đã kết nối backend
  const [showManager, setShowManager] = useState(false);
  const [showPwModal, setShowPwModal] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const ADMIN_PASSWORD = "123456";

  const weekDates = useMemo(
    () =>
      Array.from({ length: 7 }).map((_, i) =>
        dayjs(weekStartDate).add(i, "day")
      ),
    [weekStartDate]
  );

  const scheduleData = useMemo(() => {
    // Tạo mảng 7 ngày x 9 slot
    const data = Array(7)
      .fill(0)
      .map(() =>
        Array(9)
          .fill(0)
          .map(() => ({
            free: 60,
            booked: 0,
          }))
      );
    bookingList.forEach((b) => {
      // Xác định ngày và slot
      const dayIdx = weekDates.findIndex(
        (d) => d.format("DD/MM/YYYY") === b.date
      );
      const slotIdx = TIME_SLOTS.findIndex((t) => t === b.slot);
      if (dayIdx !== -1 && slotIdx !== -1) {
        data[dayIdx][slotIdx].booked += 1;
        data[dayIdx][slotIdx].free -= 1;
      }
    });
    return data;
  }, [bookingList, weekDates]);

  // --- 1. Lấy bookings từ backend (chạy khi load trang)
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/bookings`);
      setBookingList(res.data);
    } catch (e) {
      alert("Không tải được danh sách booking từ server!");
    }
    setLoading(false);
  };

  // --- 2. Thêm booking mới (GỌI API POST)
  const handleAddBooking = async (formData) => {
    try {
      // Bổ sung thông tin ngày/slot nếu cần
      formData.date = weekDates[selectedDayIdx].format("DD/MM/YYYY");
      formData.slot = TIME_SLOTS[selectedSlotIdx];
      setLoading(true);
      const res = await axios.post(`${API_URL}/bookings`, formData);
      setBookingList((prev) => [...prev, res.data]);
      alert("Đăng ký thành công!");
      handleCloseBookingForm();
    } catch (e) {
      alert("Lỗi khi đăng ký máy!");
    }
    setLoading(false);
  };

  // --- 3. Sửa booking (GỌI API PUT)
  const handleEditBookingSubmit = async (formData) => {
    try {
      const id = bookingList[editIdx]._id;
      setLoading(true);
      const res = await axios.put(`${API_URL}/bookings/${id}`, formData);
      setBookingList((prev) =>
        prev.map((b, i) => (i === editIdx ? res.data : b))
      );
      setShowEditForm(false);
      setEditIdx(null);
      alert("Đã lưu chỉnh sửa!");
    } catch (e) {
      alert("Lỗi khi lưu chỉnh sửa!");
    }
    setLoading(false);
  };

  // --- 4. Xoá booking (GỌI API DELETE)
  const handleDeleteBooking = async (idx) => {
    const id = bookingList[idx]._id;
    if (!window.confirm("Bạn có chắc chắn muốn xoá booking này?")) return;
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/bookings/${id}`);
      setBookingList((prev) => prev.filter((_, i) => i !== idx));
    } catch (e) {
      alert("Lỗi khi xoá booking!");
    }
    setLoading(false);
  };

  // --- 5. Hiện form sửa booking (chỉnh sửa ở chỗ này để gọi đúng hàm)
  const handleEditBooking = (idx) => {
    setEditIdx(idx);
    setShowEditForm(true);
    setShowManager(false);
  };

  // --- 6. Chọn slot -> hiện map chọn máy
  const handleSelectSlot = (dayIdx, slotIdx) => {
    setSelectedDayIdx(dayIdx);
    setSelectedSlotIdx(slotIdx);
    setShowMap(true);
  };

  // --- 7. Chọn máy để đăng ký
  const handleSelectMachine = (num) => {
    setSelectedMachine(num);
    setShowBookingForm(true);
  };

  // --- 8. Đóng form đăng ký
  const handleCloseBookingForm = () => {
    setShowBookingForm(false);
    setSelectedMachine(null);
    setShowMap(false);
  };

  // --- 9. Danh sách máy đã bị book cho đúng ngày/slot
  // (Bạn có thể điều chỉnh logic này tuỳ backend)
  const bookedMachines = bookingList
    .filter(
      (b) =>
        b.date === weekDates[selectedDayIdx]?.format("DD/MM/YYYY") &&
        b.slot === TIME_SLOTS[selectedSlotIdx]
    )
    .map((b) => b.machineNumber);

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
      {loading && (
        <div className="mb-3 text-center text-gray-500">Đang xử lý...</div>
      )}
      <LabDatePicker
        weekStartDate={weekStartDate}
        onChangeWeek={(date) => setWeekStartDate(date.startOf("day").toDate())}
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
          onSubmit={handleAddBooking}
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
          onEdit={handleEditBooking}
          onDelete={handleDeleteBooking}
        />
      )}

      {/* Form sửa booking */}
      {showEditForm && (
        <BookingForm
          machineNumber={bookingList[editIdx]?.machineNumber}
          initialData={bookingList[editIdx]}
          mode="edit"
          onSubmit={handleEditBookingSubmit}
          onCancel={() => {
            setShowEditForm(false);
            setEditIdx(null);
          }}
        />
      )}
    </div>
  );
}

export default App;
