# cutesurveyquest
# 🌸 Cute Survey Web App - Trang Web Khảo Sát Mẫu Thử Xinh Xắn 🌸

Trang web khảo sát phong cách dễ thương (Cute Pastel Aesthetic) với hiệu ứng animation mượt mà (`fade-in` / `fade-out`), bong bóng & trái tim trôi bồng bềnh, hỗ trợ đọc file Excel tự động tạo lựa chọn nhập tay và gửi kết quả về Email.

---

## ✨ Tính Năng Nổi Bật

1. **Giao Diện Cute & Mượt Mà**:
   - Tông màu Pastel dịu mát, font chữ tròn xinh (*Fredoka* & *Quicksand*).
   - Hiệu ứng background bong bóng/trái tim trôi bồng bềnh.
   - Chuyển câu hỏi mượt mà với animation `fade-out` & `fade-in`.
2. **Xử Lý Dữ Liệu Excel Thông Minh**:
   - Đọc câu hỏi và đáp án từ file `sample_questions.xlsx`.
   - Nếu một câu hỏi có dưới 4 đáp án lựa chọn, hệ thống tự động sinh thêm 1 lựa chọn **"Khác (Nhập tay...)"** cho phép người dùng nhập văn bản.
3. **Popup Nhận Quà Xịn Xò**:
   - Khi hoàn thành khảo sát, popup hiện ra với hiệu ứng pháo hoa confetti & trái tim bồng bềnh.
   - Hiển thị thông báo: *"Chúc mừng bạn đã hoàn thành khảo sát, mời bạn ra cửa để nhận món quà có thể thưởng thức ngay vì đã bỏ ra ít phút để làm mẫu thử này"*.

## 🛠️ Cấu Trúc File Dự Án

```
cute-survey-app/
├── index.html            # Giao diện HTML chính
├── styles.css            # Styling CSS pastel, animation & floating hearts
├── script.js             # Logic chuyển câu hỏi, đọc Excel, popup & email
├── sample_questions.xlsx # File Excel bộ câu hỏi mẫu
└── README.md             # Hướng dẫn sử dụng & triển khai
```
