// ==========================================
// HÀM HIGHLIGHT MENU HIỆN TẠI (ACTIVE MENU)
// ==========================================
function highlightActiveMenu() {
    let currentPath = window.location.pathname;
    const menuLinks = document.querySelectorAll('.page-menu > ul > li > a');

    // Chuẩn hóa đường dẫn gốc
    if (currentPath === '/' || currentPath === '') {
        currentPath = '/index.html';
    }

    menuLinks.forEach(link => {
        let linkPath = new URL(link.href, window.location.origin).pathname;
        
        if (linkPath === '/' || linkPath === '') {
            linkPath = '/index.html';
        }

        // 1. Highlight khi ở chính xác trang đó
        if (currentPath === linkPath) {
            link.classList.add('active');
        } 
        // 2. Highlight cả menu cha nếu đang xem trang con (VD: ở trong /pages/product/)
        else if (linkPath !== '/index.html' && currentPath.includes(linkPath.substring(0, linkPath.lastIndexOf('/')))) {
            link.classList.add('active');
        }
    });
}

// ==========================================
// HÀM ĐỒNG BỘ BADGE GIỎ HÀNG (DÙNG CHUNG)
// ==========================================
function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Lấy số lượng loại sản phẩm trong giỏ hàng
    const totalItems = cart.length; 

    // Nếu bạn muốn hiện tổng số món (VD: mua 2 sữa rửa mặt + 3 toner = 5) thì mở comment dòng dưới và xóa dòng trên:
    // const totalItems = cart.reduce((total, item) => total + (parseInt(item.quantity, 10) || 0), 0);

    const badge = parent.document.querySelector(".cart-count") || document.querySelector(".cart-count");
    if (badge) {
        badge.textContent = totalItems;
    }
}

// ==========================================
// HÀM CẬP NHẬT TRẠNG THÁI ĐĂNG NHẬP (MỚI THÊM)
// ==========================================
function updateAuthHeader() {
    // Tự động tìm class .topbar-right ở trang hiện tại hoặc trang cha (nếu nhúng iframe)
    const topbarRight = parent.document.querySelector(".topbar-right") || document.querySelector(".topbar-right");
    if (!topbarRight) return;

    // Lấy thông tin user đang đăng nhập từ localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (currentUser) {
        // ĐÃ ĐĂNG NHẬP: Hiện tên user (bên trái) và nút Đăng xuất kèm icon thoát (bên phải)
        topbarRight.innerHTML = `
            <a href="/pages/account/html/account.html" style="margin-right: 15px; display: inline-flex; align-items: center; gap: 5px;">
                <i class="fa-regular fa-user"></i> ${currentUser.fullname}
            </a>
            <a href="#" id="header-logout-btn" style="display: inline-flex; align-items: center; gap: 5px; cursor: pointer;">
                <i class="fa-solid fa-right-from-bracket"></i> Đăng xuất
            </a>
        `;

        // Gắn sự kiện Click cho nút Đăng xuất vừa tạo ra ở trên
        const logoutBtn = parent.document.getElementById("header-logout-btn") || document.getElementById("header-logout-btn");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", (e) => {
                e.preventDefault();
                // Xóa trạng thái đăng nhập
                localStorage.removeItem('currentUser');
                // Chuyển hướng về trang Login (dùng window.top để thoát hoàn toàn khỏi iframe nếu có)
                window.top.location.href = '/pages/account/html/Login.html';
            });
        }
    } else {
        // CHƯA ĐĂNG NHẬP: Hiển thị lại nút Tài khoản mặc định ban đầu
        topbarRight.innerHTML = `
            <a href="/pages/account/html/login.html"><i class="fa-regular fa-user"></i> Tài khoản</a>
        `;
    }
}

// ==========================================
// CHẠY SCRIPTS KHI LOAD TRANG
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    updateCartBadge();
    highlightActiveMenu();
    updateAuthHeader(); // <-- Gọi hàm kiểm tra đăng nhập khi vừa load xong DOM

    // Xử lý an toàn khi Header được nhúng bằng js/fetch chậm hơn body
    let checkExist = setInterval(() => {
        const badge = parent.document.querySelector(".cart-count") || document.querySelector(".cart-count");
        const topbarRight = parent.document.querySelector(".topbar-right") || document.querySelector(".topbar-right");
        
        // Đợi khi cả badge giỏ hàng và thanh topbar cùng xuất hiện thì mới thực thi
        if (badge && topbarRight) {
            updateCartBadge();
            highlightActiveMenu();
            updateAuthHeader(); // <-- Đảm bảo gọi lại để đồng bộ giao diện hiển thị
            clearInterval(checkExist); 
        }
    }, 200);

    // Tự động dừng vòng lặp sau 3 giây để tối ưu hiệu suất
    setTimeout(() => clearInterval(checkExist), 3000);
});