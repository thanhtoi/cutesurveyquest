const fs = require('fs');
const path = require('path');

// Simple CSV that Excel can open directly or we can use xlsx if installed
const csvContent = `Câu hỏi,Lựa chọn 1,Lựa chọn 2,Lựa chọn 3,Lựa chọn 4
Bạn đánh giá phong cách giao diện này như thế nào?,Rất dễ thương 🌸,Tuyệt vời ✨,Khá ổn 🌿,Cần cải thiện thêm 🛠️
Loại vật nuôi bạn yêu thích nhất?,Mèo 🐱,Chó 🐶
Bạn thường thức dậy vào lúc mấy giờ?,Trước 6h sáng 🌅,6h - 8h sáng ⏰,Sau 8h sáng 😴
Thời tiết ưa thích của bạn là gì?,Nắng ấm ☀️,Mưa rào 🌧️,Se lạnh 🍂
`;

fs.writeFileSync(path.join(__dirname, 'sample_questions.csv'), '\uFEFF' + csvContent, 'utf8');
console.log('Sample CSV created successfully!');
