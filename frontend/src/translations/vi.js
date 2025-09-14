const vi = {
  // Header
  'header.home': 'Trang chủ',
  'header.nowShowing': 'Đang chiếu',
  'header.comingSoon': 'Sắp chiếu',
  'header.myBookings': 'Vé của tôi',
  'header.admin': 'Quản trị',
  'header.logout': 'Đăng xuất',
  'header.login': 'Đăng nhập',
  
  // Home Page
  'home.welcomeTitle': 'Chào mừng đến với MovieTicketBooking',
  'home.welcomeText': 'Đặt vé xem phim trực tuyến nhanh chóng và dễ dàng',
  'home.nowShowing': 'Đang chiếu',
  'home.comingSoon': 'Sắp chiếu',
  
  // Movie Card
  'movieCard.bookTicket': 'Đặt vé',
  'movieCard.mins': 'phút',
  
  // Now Showing Page
  'nowShowing.title': 'Phim đang chiếu',
  
  // Coming Soon Page
  'comingSoon.title': 'Phim sắp chiếu',
  
  // Movie Details Page
  'movieDetails.director': 'Đạo diễn:',
  'movieDetails.cast': 'Diễn viên:',
  'movieDetails.genres': 'Thể loại:',
  'movieDetails.synopsis': 'Tóm tắt',
  'movieDetails.showtimes': 'Lịch chiếu',
  'movieDetails.noShowtimes': 'Không có lịch chiếu cho phim này.',
  'movieDetails.select': 'Chọn',
  
  // Bookings Page
  'bookings.title': 'Vé của tôi',
  'bookings.bookingId': 'Mã đặt vé:',
  'bookings.status': 'Trạng thái:',
  'bookings.totalPrice': 'Tổng giá:',
  'bookings.bookingDate': 'Ngày đặt:',
  'bookings.seats': 'Ghế:',
  'bookings.noBookings': 'Bạn chưa có vé nào.',
  'bookings.status.confirmed': 'Đã xác nhận',
  'bookings.status.pending': 'Đang chờ',
  'bookings.status.cancelled': 'Đã hủy',
  
  // Login Page
  'login.title': 'Đăng nhập vào tài khoản của bạn',
  'login.email': 'Địa chỉ email',
  'login.password': 'Mật khẩu',
  'login.submit': 'Đăng nhập',
  'login.loading': 'Đang đăng nhập...',
  'login.noAccount': 'Chưa có tài khoản?',
  'login.register': 'Đăng ký tại đây',
  'login.error': 'Đăng nhập không thành công. Vui lòng thử lại.',
  
  // Register Page
  'register.title': 'Tạo tài khoản mới',
  'register.name': 'Họ và tên',
  'register.email': 'Địa chỉ email',
  'register.password': 'Mật khẩu',
  'register.confirmPassword': 'Xác nhận mật khẩu',
  'register.phone': 'Số điện thoại',
  'register.dateOfBirth': 'Ngày sinh',
  'register.submit': 'Đăng ký',
  'register.loading': 'Đang đăng ký...',
  'register.hasAccount': 'Đã có tài khoản?',
  'register.login': 'Đăng nhập',
  'register.error': 'Đăng ký không thành công. Vui lòng thử lại.',
  
  // Validation errors
  'validation.name.required': 'Tên không được để trống',
  'validation.name.minLength': 'Tên phải có ít nhất 2 ký tự',
  'validation.name.maxLength': 'Tên phải ít hơn 50 ký tự',
  'validation.name.invalid': 'Tên chỉ được chứa chữ cái và khoảng trắng',
  'validation.email.required': 'Email không được để trống',
  'validation.email.invalid': 'Vui lòng nhập địa chỉ email hợp lệ',
  'validation.email.exists': 'Email đã tồn tại',
  'validation.password.required': 'Mật khẩu không được để trống',
  'validation.password.minLength': 'Mật khẩu phải có ít nhất 8 ký tự',
  'validation.password.invalid': 'Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt',
  'validation.password.mismatch': 'Mật khẩu không khớp',
  'validation.phone.invalid': 'Vui lòng nhập số điện thoại hợp lệ',
  'validation.dateOfBirth.age': 'Bạn phải ít nhất 13 tuổi',
  
  // Admin Sidebar
  'admin.sidebar.adminPanel': 'Bảng quản trị',
  'admin.sidebar.dashboard': 'Bảng điều khiển',
  'admin.sidebar.movies': 'Phim',
  'admin.sidebar.showtimes': 'Lịch chiếu',
  'admin.sidebar.bookings': 'Vé đặt',
  'admin.sidebar.users': 'Người dùng',
  
  // Admin Dashboard
  'admin.dashboard.title': 'Bảng điều khiển quản trị',
  'admin.dashboard.movies': 'Phim',
  'admin.dashboard.manageMovies': 'Quản lý phim',
  'admin.dashboard.showtimes': 'Lịch chiếu',
  'admin.dashboard.manageShowtimes': 'Quản lý lịch chiếu',
  'admin.dashboard.bookings': 'Vé đặt',
  'admin.dashboard.manageBookings': 'Quản lý vé đặt',
  'admin.dashboard.users': 'Người dùng',
  'admin.dashboard.manageUsers': 'Quản lý người dùng',
  'admin.dashboard.recentActivity': 'Hoạt động gần đây',
  'admin.dashboard.newMovieAdded': 'Phim mới được thêm',
  'admin.dashboard.showtimeCreated': 'Lịch chiếu được tạo',
  'admin.dashboard.bookingConfirmed': 'Vé được xác nhận',
  
  // Admin Movies
  'admin.movies.title': 'Quản lý phim',
  'admin.movies.addNew': 'Thêm phim mới',
  'admin.movies.table.title': 'Tiêu đề',
  'admin.movies.table.director': 'Đạo diễn',
  'admin.movies.table.releaseDate': 'Ngày phát hành',
  'admin.movies.table.actions': 'Hành động',
  'admin.movies.edit': 'Sửa',
  'admin.movies.delete': 'Xóa',
  'admin.movies.deleteConfirm': 'Bạn có chắc chắn muốn xóa phim này?',
  'admin.movies.deleteError': 'Xóa phim không thành công',
  'admin.movies.pagination.previous': 'Trước',
  'admin.movies.pagination.next': 'Sau',
  
  // Movie Form
  'admin.movieForm.addTitle': 'Thêm phim mới',
  'admin.movieForm.editTitle': 'Sửa phim',
  'admin.movieForm.title': 'Tiêu đề',
  'admin.movieForm.director': 'Đạo diễn',
  'admin.movieForm.cast': 'Diễn viên (ngăn cách bằng dấu phẩy)',
  'admin.movieForm.duration': 'Thời lượng (phút)',
  'admin.movieForm.genre': 'Thể loại (ngăn cách bằng dấu phẩy)',
  'admin.movieForm.rating': 'Xếp hạng',
  'admin.movieForm.releaseDate': 'Ngày phát hành',
  'admin.movieForm.endDate': 'Ngày kết thúc',
  'admin.movieForm.synopsis': 'Tóm tắt',
  'admin.movieForm.posterUrl': 'URL áp phích',
  'admin.movieForm.trailerUrl': 'URL trailer',
  'admin.movieForm.cancel': 'Hủy',
  'admin.movieForm.save': 'Lưu phim',
  'admin.movieForm.saving': 'Đang lưu...',
  'admin.movieForm.error': 'Lưu phim không thành công:',
  
  // Common
  'common.loading': 'Đang tải...',
  'common.error': 'Có lỗi xảy ra',
  'common.movieNotFound': 'Không tìm thấy phim'
};

export default vi;