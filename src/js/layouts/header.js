document.addEventListener('DOMContentLoaded', function() {
    const dropdown = document.querySelector('.dropdown');
    const toggle = document.querySelector('.dropdown-toggle');

    // Xử lý cho thiết bị di động/máy tính bảng khi click thay vì hover
    if (window.innerWidth <= 1024) {
        toggle.addEventListener('click', function(e) {
            e.preventDefault(); // Ngăn chuyển trang ngay lập tức
            const menu = this.nextElementSibling;
            
            if (menu.style.visibility === 'visible') {
                menu.style.opacity = '0';
                menu.style.visibility = 'hidden';
                menu.style.transform = 'translateX(-50%) translateY(15px)';
            } else {
                menu.style.opacity = '1';
                menu.style.visibility = 'visible';
                menu.style.transform = 'translateX(-50%) translateY(5px)';
            }
        });

        // Đóng menu khi click ra ngoài
        document.addEventListener('click', function(e) {
            if (!dropdown.contains(e.target)) {
                const menu = dropdown.querySelector('.dropdown-menu');
                menu.style.opacity = '0';
                menu.style.visibility = 'hidden';
            }
        });
    }
});
function updateHeaderHeight() {
    const header = document.querySelector('.site-header');
    const body = document.body;
    
    if (header) {
        // Lấy chiều cao thực tế của header tại thời điểm hiện tại
        const headerHeight = header.offsetHeight;
        // Đẩy toàn bộ nội dung body xuống một khoảng đúng bằng header
        body.style.paddingTop = headerHeight + 'px';
    }
}

// Chạy khi trang tải xong và khi thay đổi kích thước màn hình
window.addEventListener('load', updateHeaderHeight);
window.addEventListener('resize', updateHeaderHeight);