import React, { useState } from "react";

export default function PasswordModal({ onSubmit, onCancel }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!pw) return;
    setErr("");
    onSubmit(pw);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl p-6 shadow-lg w-full max-w-xs"
      >
        <div className="mb-3 flex justify-between items-center">
          <h3 className="font-bold text-lg text-blue-700">
            Nhập mật khẩu quản lý
          </h3>
          <button
            type="button"
            onClick={onCancel}
            className="text-red-500 text-2xl font-bold"
          >
            ×
          </button>
        </div>
        <input
          type="password"
          placeholder="Mật khẩu..."
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          className="w-full px-3 py-2 border rounded mb-2 focus:outline-blue-400"
        />
        {err && <div className="text-red-500 text-sm mb-2">{err}</div>}
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold"
            onClick={onCancel}
          >
            Huỷ
          </button>
          <button
            type="submit"
            className="px-4 py-1 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700"
          >
            Xác nhận
          </button>
        </div>
      </form>
    </div>
  );
}
