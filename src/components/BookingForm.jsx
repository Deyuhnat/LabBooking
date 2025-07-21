import React, { useState, useEffect } from "react";

export default function BookingForm({
  machineNumber,
  onSubmit,
  onCancel,
  initialData = null,
  mode = "add",
}) {
  const [fullname, setFullname] = useState(initialData?.fullname || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [teacherClass, setTeacherClass] = useState(
    initialData?.teacherClass || ""
  );
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setFullname(initialData.fullname || "");
      setEmail(initialData.email || "");
      setTeacherClass(initialData.teacherClass || "");
    }
  }, [initialData]);

  // Regex: chỉ cho chữ cái (có dấu) và khoảng trắng
  const nameRegex = /^[a-zA-ZÀ-ỹ\s]+$/;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nameRegex.test(fullname.trim())) {
      setError("Họ và tên chỉ được chứa chữ cái và khoảng trắng.");
      return;
    }
    setError("");
    onSubmit({ fullname: fullname.trim(), email, teacherClass, machineNumber });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form
        className="bg-white rounded-xl p-6 shadow-lg w-full max-w-xs sm:max-w-sm pb-3 relative"
        onSubmit={handleSubmit}
      >
        <div className="mb-4 flex justify-between items-center">
          <h3 className="font-bold text-lg text-blue-700">
            {mode === "edit"
              ? "Chỉnh sửa booking"
              : `Đăng ký máy số ${machineNumber}`}
          </h3>
          <button
            type="button"
            className="text-red-500 text-2xl font-bold -mr-2 hover:bg-red-100 rounded-full w-8 h-8 flex items-center justify-center"
            onClick={onCancel}
            tabIndex={-1}
          >
            ×
          </button>
        </div>
        <div className="mb-3">
          <label className="block text-sm mb-1 font-medium text-gray-700">
            Họ và tên
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded focus:outline-blue-400"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            required
            autoFocus
            placeholder="Nhập họ tên (không số, không ký tự đặc biệt)"
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm mb-1 font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            className="w-full px-3 py-2 border rounded focus:outline-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-5">
          <label className="block text-sm mb-1 font-medium text-gray-700">
            Lớp của thầy
          </label>
          <select
            className="w-full px-3 py-2 border rounded focus:outline-blue-400"
            value={teacherClass}
            onChange={(e) => setTeacherClass(e.target.value)}
            required
          >
            <option value="">-- Chọn lớp --</option>
            <option value="Lớp của thầy Phil">Lớp của thầy Phil</option>
            <option value="Lớp của thầy Long">Lớp của thầy Long</option>
          </select>
        </div>
        {error && <div className="text-red-600 mb-2 text-sm">{error}</div>}
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold"
            onClick={onCancel}
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-1 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow"
          >
            {mode === "edit" ? "Lưu" : "Xác nhận"}
          </button>
        </div>

        {/* Nội quy chuyển xuống đây */}
        <div className="mt-4 px-2 py-2 bg-gray-50 rounded text-xs text-gray-500 text-center border border-gray-200">
          <div>
            <b>Lưu ý:</b> Khi nhấn <b>Xác nhận</b> sẽ <b>KHÔNG thay đổi</b> được
            thông tin.
            <br />
            Nếu <b>KHÔNG dùng máy</b> trong <b>1 tiếng</b> thì máy sẽ tự động
            tắt.
            <br />
            Vui lòng <b>tuân thủ nội quy phòng LAB</b>.
          </div>
        </div>
      </form>
    </div>
  );
}
