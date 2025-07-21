HỆ THỐNG QUẢN LÝ ĐẶT MÁY PHÒNG LAB DSAC
URL: https://dsaclab.onrender.com/
1. Mục tiêu chính
Phát triển một ứng dụng web đặt máy phòng LAB trực quan, giúp người dùng đặt, xem và quản lý lịch sử dụng máy tính tại phòng LAB DSAC – đảm bảo chủ động, tiết kiệm thời gian, tăng hiệu quả vận hành.

2. Tính năng nổi bật
a. Giao diện thời khóa biểu phòng lab
Hiển thị 9 khung giờ/ca trong ngày:

7h30 - 9h15

9h30 - 11h15

11h30 - 13h15

13h30 - 15h15

15h30 - 17h15

17h30 - 19h15

19h30 - 21h15

21h30 - 23h15

23h30 - 7h15 (sáng hôm sau)

Bảng trạng thái trực quan: số máy trống và số máy đã đặt cho từng khung giờ, từng ngày.

Nút chọn ca để mở popup chọn máy cụ thể.

b. Chọn ngày sử dụng
Datepicker/thanh lịch: Chọn nhanh ngày cần xem/đặt máy.

Chuyển ngày mượt mà: Dữ liệu cập nhật real-time theo ngày.

c. Bản đồ trạng thái 60 máy
Popup hiển thị 60 máy theo sơ đồ bố trí thật.

Máy trống: nền trắng, có thể chọn.

Máy đã đặt: nền đỏ, không thể chọn.

Chọn máy trống để mở form đăng ký (họ tên, email, lớp thầy).

d. Quản lý booking (cho admin)
Quản trị viên nhập mật khẩu đơn giản để truy cập:

Xem toàn bộ booking

Chỉnh sửa, xóa booking

Xuất báo cáo Excel nhanh chóng

e. Xuất báo cáo sử dụng máy
Báo cáo theo ngày/tuần/tháng, tải về dạng Excel (.xlsx)

Thông tin: STT, ngày, khung giờ, máy số, họ tên, email, lớp

f. Gửi email nhắc nhở tự động
Trước 15 phút của mỗi khung giờ đã có máy được đặt, hệ thống sẽ tự động gửi email đến quản trị viên (hoặc email chỉ định).

Email gồm: Khung giờ, ngày, danh sách số máy cần bật.

3. Công nghệ sử dụng
Frontend: ReactJS, TailwindCSS, shadcn/ui, react-datepicker

Backend: NodeJS (Express), MongoDB Atlas, Nodemailer (gửi email)

Triển khai: Render.com (hoặc tương đương)

4. Hướng dẫn sử dụng/triển khai
A. Chạy Local
1. Frontend:
git clone https://github.com/[your-username]/lab-booking.git
cd lab-booking
npm install
npm start
2. Backend:
git clone https://github.com/[your-username]/lab-booking-backend.git
cd lab-booking-backend
npm install
node server.js
(Cần chỉnh .env hoặc file config cho MongoDB, mail,...)
