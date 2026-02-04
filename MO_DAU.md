# MỞ ĐẦU

## 1. Lý do chọn đề tài
Trong thời đại công nghệ số phát triển vượt bậc, nhu cầu giải trí, đặc biệt là xem phim chiếu rạp, ngày càng tăng cao. Khách hàng ngày nay mong muốn sự tiện lợi, nhanh chóng trong việc tra cứu thông tin phim, lịch chiếu và đặt vé mà không cần phải đến trực tiếp rạp xếp hàng chờ đợi. Đối với các hệ thống rạp chiếu phim, việc chuyển đổi số không chỉ giúp nâng cao trải nghiệm khách hàng mà còn tối ưu hóa quy trình quản lý, kiểm soát doanh thu và giảm tải áp lực cho nhân viên tại quầy.

Tuy nhiên, nhiều rạp chiếu phim vẫn còn sử dụng các phương thức quản lý truyền thống hoặc các hệ thống cũ kỹ, thiếu tính đồng bộ giữa các nền tảng (Website và Mobile App), dẫn đến khó khăn trong việc cập nhật dữ liệu thời gian thực (như trạng thái ghế ngồi) và hạn chế trong việc tiếp cận khách hàng trẻ tuổi – những người ưu tiên sử dụng thiết bị di động.

Xuất phát từ thực tế đó, em quyết định thực hiện đề tài: **“Xây dựng hệ thống đặt vé xem phim trực tuyến sử dụng ReactJS, ExpressJS và React Native”**. Đề tài hướng đến việc phát triển một hệ thống toàn diện, đa nền tảng, giúp người dùng đặt vé dễ dàng và nhà quản lý vận hành rạp chiếu phim hiệu quả hơn.

## 2. Mục tiêu nghiên cứu
Đề tài hướng đến việc xây dựng hệ thống đặt vé xem phim hoàn chỉnh với các mục tiêu cụ thể:
- **Xây dựng Website và Ứng dụng di động (Mobile App):** Cung cấp giao diện trực quan, thân thiện cho phép khách hàng tìm kiếm phim, xem trailer, chọn suất chiếu, chọn ghế và thanh toán trực tuyến.
- **Phát triển Backend mạnh mẽ:** Xây dựng API xử lý logic nghiệp vụ phức tạp như quản lý phim, suất chiếu, rạp, phòng chiếu và xử lý giao dịch đặt vé thời gian thực (real-time) để tránh trùng lặp ghế.
- **Đồng bộ hóa dữ liệu:** Đảm bảo tính nhất quán dữ liệu giữa Website, App và hệ thống quản trị (Admin Dashboard).
- **Tối ưu trải nghiệm người dùng:** Tích hợp các tính năng hiện đại như vé điện tử (QR Code), thông báo nhắc lịch chiếu và đề xuất phim dựa trên sở thích.

## 3. Đối tượng và phạm vi nghiên cứu
- **Đối tượng nghiên cứu:** Quy trình nghiệp vụ đặt vé xem phim, hành vi người dùng và các công nghệ ReactJS (Frontend), ExpressJS (Backend), React Native (Mobile App), MongoDB (Database).
- **Phạm vi nghiên cứu:**
    - **Người dùng:** Xem danh sách phim (đang chiếu, sắp chiếu), chi tiết phim, đặt vé, chọn ghế, thanh toán, xem lịch sử đặt vé.
    - **Quản trị viên (Admin):** Quản lý phim, lịch chiếu, cụm rạp, phòng chiếu, loại ghế, và xem báo cáo thống kê.
    - **Hệ thống:** Tập trung vào các chức năng cốt lõi đảm bảo quy trình đặt vé diễn ra trơn tru trên cả Web và Mobile.

## 4. Phương pháp nghiên cứu
- **Nghiên cứu lý thuyết:** Tìm hiểu về quy trình nghiệp vụ rạp chiếu phim, kiến trúc Microservices/Monolithic, và các công nghệ trong MERN Stack (MongoDB, Express, React, Node.js) cùng React Native.
- **Phân tích và thiết kế hệ thống:** Sử dụng biểu đồ Use Case, Class Diagram, Sequence Diagram để mô hình hóa yêu cầu và luồng dữ liệu. Thiết kế cơ sở dữ liệu và giao diện người dùng (UI/UX).
- **Thực nghiệm:** Tiến hành cài đặt, lập trình hệ thống, tích hợp các cổng thanh toán (nếu có) và kiểm thử chức năng trên các trình duyệt web và thiết bị di động khác nhau.

## 5. Ý nghĩa khoa học và thực tiễn
- **Ý nghĩa khoa học:** Áp dụng kiến thức về lập trình đa nền tảng (Cross-platform), lập trình web hiện đại và xử lý đồng bộ thời gian thực vào một bài toán thực tế phức tạp.
- **Ý nghĩa thực tiễn:** Sản phẩm tạo ra có thể ứng dụng thực tế cho các rạp chiếu phim vừa và nhỏ, giúp họ tiết kiệm chi phí xây dựng hệ thống, đồng thời mang lại sự tiện lợi tối đa cho khán giả yêu điện ảnh.