import React from "react";

export default function ManagerModal({
  bookings,
  onExport,
  onClose,
  onDelete,
  onEdit,
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-3xl w-full overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-blue-700">Quản lý booking</h2>
          <button onClick={onClose} className="text-red-500 text-2xl font-bold">
            ×
          </button>
        </div>
        {/* Table bookings */}
        <div className="mb-3 max-h-[60vh] overflow-y-auto">
          <table className="w-full text-center border">
            <thead className="bg-gray-100">
              <tr>
                <th>STT</th>
                <th>Ngày</th>
                <th>Khung giờ</th>
                <th>Máy</th>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Lớp</th>
                {/* Có thể thêm nút Xóa, Sửa tại đây */}
              </tr>
            </thead>
            <tbody>
              {bookings.map((b, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{b.date}</td>
                  <td>{b.slot}</td>
                  <td>{b.machineNumber}</td>
                  <td>{b.fullname}</td>
                  <td>{b.email}</td>
                  <td>{b.teacherClass}</td>
                  <td>
                    <button
                      className="px-2 py-1 rounded bg-yellow-400 text-white text-xs mr-1 hover:bg-yellow-500"
                      onClick={() => onEdit(idx)}
                    >
                      Sửa
                    </button>
                    <button
                      className="px-2 py-1 rounded bg-red-500 text-white text-xs hover:bg-red-600"
                      onClick={() => onDelete(idx)}
                    >
                      Xoá
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            className="px-4 py-1 rounded bg-green-600 text-white font-semibold hover:bg-green-700"
            onClick={onExport}
          >
            Xuất Excel
          </button>
          <button
            className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold"
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
