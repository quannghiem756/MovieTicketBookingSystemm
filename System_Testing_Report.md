# Báo Cáo Kiểm Thử Hệ Thống (System Testing Report)

| STT | Chức năng | Các bước thực hiện | Đầu ra mong muốn | Đầu ra thực tế | Kết quả |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | Đăng ký tài khoản | Nhập họ tên, email, số điện thoại và mật khẩu mới. | Đăng ký thành công, hệ thống gửi email xác thực OTP. | Hiển thị thông báo đăng ký thành công | **Đạt** |
| 2 | Xác thực OTP | Nhập mã OTP 6 chữ số được gửi về email. | Tài khoản được kích hoạt, chuyển hướng sang trang đăng nhập. | Tài khoản đã được kích hoạt | **Đạt** |
| 3 | Đăng nhập | Nhập email và mật khẩu hợp lệ của người dùng. | Đăng nhập thành công, chuyển hướng về trang chủ, lưu JWT token. | Chuyển hướng đến trang chủ | **Đạt** |
| 4 | Sửa thông tin cá nhân | Thay đổi ảnh đại diện và số điện thoại trong phần cài đặt. | Thông tin cá nhân được cập nhật thành công trên hệ thống. | Cập nhật thông tin thành công | **Đạt** |
| 5 | Giữ chỗ (Hold Seat) | 1. Chọn phim và suất chiếu.<br>2. Chọn các ghế trống (VD: A1, A2).<br>3. Nhấn "Giữ chỗ". | Các ghế được đánh dấu là held. Không người dùng nào khác có thể chọn các ghế này trong 10 phút. | Ghế đổi màu sang trạng thái đã chọn | **Đạt** |
| 6 | Áp dụng mã giảm giá | Nhập mã coupon (VD: "GIAM20") tại màn hình thanh toán. | Tổng tiền thanh toán giảm đúng theo phần trăm/số tiền của mã. | Tổng tiền được trừ chính xác | **Đạt** |
| 7 | Thanh toán MoMo | 1. Chọn phương thức MoMo cho booking đang giữ.<br>2. Nhấn "Thanh toán".<br>3. Xác nhận giao dịch giả lập. | Trạng thái booking chuyển từ pending sang confirmed. Gửi email xác nhận kèm mã QR. | Booking hiển thị trạng thái "Đã xác nhận" | **Đạt** |
| 8 | Xem lịch sử đặt vé | Truy cập vào mục "Vé của tôi". | Hiển thị đầy đủ danh sách các vé đã đặt cùng trạng thái tương ứng. | Danh sách vé hiển thị đầy đủ | **Đạt** |
| 9 | Soát vé QR | 1. Nhân viên quét mã QR từ vé của người dùng.<br>2. Hệ thống gọi API `/validate` với token của vé. | Hệ thống xác nhận vé hợp lệ (trong khung giờ chiếu). Trạng thái vé chuyển sang redeemed. | Thông báo vé hợp lệ, cho phép vào rạp | **Đạt** |
| 10 | Đề xuất phim (Chatbot) | 1. Mở cửa sổ Chatbot.<br>2. Nhập yêu cầu: "Gợi ý cho tôi phim hành động". | Chatbot trả về danh sách các phim hành động đang chiếu kèm theo link đặt vé. | Chatbot phản hồi đúng thể loại phim yêu cầu | **Đạt** |
| 11 | Gửi yêu cầu hỗ trợ | 1. Truy cập trang hỗ trợ.<br>2. Nhập vấn đề (VD: "Lỗi thanh toán") và mô tả.<br>3. Nhấn "Gửi". | Tạo ticket hỗ trợ thành công. Người dùng nhận được thông báo mã ticket. | Hiển thị thông báo gửi ticket thành công | **Đạt** |
| 12 | Admin: Thêm phim mới | 1. Đăng nhập quyền Admin.<br>2. Nhập thông tin phim (tên, poster, trailer, độ tuổi). | Phim mới xuất hiện trong danh sách quản lý và trên trang chủ. | Phim mới đã được lưu vào DB | **Đạt** |
| 13 | Admin: Tạo suất chiếu | 1. Chọn phim, rạp và phòng chiếu.<br>2. Thiết lập thời gian bắt đầu và kết thúc. | Suất chiếu mới được tạo thành công, không bị trùng lịch với phòng đó. | Suất chiếu hiển thị trên lịch | **Đạt** |
| 14 | Admin: Quản lý người dùng | Tìm kiếm người dùng và thực hiện xóa tài khoản vi phạm. | Trạng thái tài khoản chuyển thành "Deleted", người dùng không thể đăng nhập. | Tài khoản đã bị vô hiệu hóa | **Đạt** |
| 15 | Admin: Sửa thông tin phim | 1. Chọn phim cần sửa trong danh sách.<br>2. Thay đổi ngày khởi chiếu hoặc ảnh poster.<br>3. Lưu thay đổi. | Thông tin phim được cập nhật ngay lập tức trên trang chủ và trang chi tiết. | Thông tin cập nhật chính xác | **Đạt** |
| 16 | Admin: Thêm rạp chiếu mới | 1. Vào menu Quản lý rạp.<br>2. Thêm tên rạp mới (VD: "Cinema Quận 1") và địa chỉ.<br>3. Nhấn "Tạo mới". | Rạp mới hiển thị trong danh sách chọn rạp khi tạo suất chiếu. | Rạp mới xuất hiện trong danh sách | **Đạt** |
| 17 | Admin: Tạo mã giảm giá (Coupon) | 1. Nhập mã code (VD: "SUMMER50").<br>2. Đặt mức giảm (50%) và ngày hết hạn.<br>3. Kích hoạt. | Mã coupon có hiệu lực, người dùng có thể áp dụng khi thanh toán. | Mã hoạt động đúng cấu hình | **Đạt** |
| 18 | Admin: Phản hồi hỗ trợ | 1. Xem danh sách ticket đang chờ.<br>2. Chọn ticket và nhập nội dung phản hồi.<br>3. Cập nhật trạng thái thành "Đã xử lý". | Người dùng nhận được email/thông báo phản hồi. Trạng thái ticket thay đổi. | Ticket cập nhật trạng thái "Closed" | **Đạt** |
| 19 | Admin: Quản lý tin tức | 1. Soạn thảo bài viết khuyến mãi mới.<br>2. Tải lên ảnh bìa.<br>3. Nhấn "Đăng bài". | Bài viết xuất hiện đầu tiên trong mục Tin tức/Sự kiện. | Tin tức hiển thị đúng thứ tự | **Đạt** |
| 20 | Admin: Xem báo cáo thống kê | 1. Vào Dashboard thống kê.<br>2. Chọn lọc doanh thu theo "Tháng này". | Hiển thị biểu đồ doanh thu và tổng số vé bán ra chính xác. | Số liệu khớp với DB | **Đạt** |
