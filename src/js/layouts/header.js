const HeaderController = {
    // Thêm cờ để chống việc kiện click bị gắn nhiều lần
    mobileMenuInitialized: false, 

    // 1. HÀM HIGHLIGHT MENU HIỆN TẠI
    highlightActiveMenu() {
        let currentPath = window.location.pathname;
        if (currentPath === '/' || currentPath === '') currentPath = '/index.html';

        const menuLinks = document.querySelectorAll('.page-menu > ul > li > a');

        menuLinks.forEach(link => {
            let linkPath = new URL(link.href, window.location.origin).pathname;
            if (linkPath === '/' || linkPath === '') linkPath = '/index.html';

            if (currentPath === linkPath) {
                link.classList.add('active');
            } else if (linkPath !== '/index.html' && currentPath.includes(linkPath.substring(0, linkPath.lastIndexOf('/')))) {
                link.classList.add('active');
            }
        });
    },

    // 2. HÀM ĐỒNG BỘ BADGE GIỎ HÀNG
    updateCartBadge() {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const totalItems = cart.length; 
        
        const doc = parent.document || document;
        const badge = doc.querySelector(".cart-count");
        
        if (badge) {
            badge.textContent = totalItems;
        }
    },

    // 3. HÀM CẬP NHẬT TRẠNG THÁI ĐĂNG NHẬP
    updateAuthHeader() {
        const doc = parent.document || document;
        const topbarRight = doc.getElementById("auth-container") || doc.querySelector(".topbar-right");
        
        if (!topbarRight) return;

        const currentUser = JSON.parse(localStorage.getItem('currentUser'));

        if (currentUser) {
            topbarRight.innerHTML = `
                <a href="/pages/account/html/account.html" style="margin-right: 15px; display: inline-flex; align-items: center; gap: 5px;">
                    <i class="fa-regular fa-user"></i> ${currentUser.fullname}
                </a>
                <a href="#" id="header-logout-btn" style="display: inline-flex; align-items: center; gap: 5px; cursor: pointer;">
                    <i class="fa-solid fa-right-from-bracket"></i> Đăng xuất
                </a>
            `;

            const logoutBtn = doc.getElementById("header-logout-btn");
            if (logoutBtn) {
                logoutBtn.addEventListener("click", (e) => {
                    e.preventDefault();
                    localStorage.removeItem('currentUser');
                    window.top.location.href = '/pages/account/html/login.html';
                });
            }
        } else {
            topbarRight.innerHTML = `
                <a href="/pages/account/html/login.html"><i class="fa-regular fa-user"></i> Tài khoản</a>
            `;
        }
    },

    // 4. HÀM ĐIỀU KHIỂN MENU RESPONSIVE (MOBILE) - PHIÊN BẢN BULLETPROOF (CHỐNG LỖI TRANG CHỦ)
    initMobileMenu() {
        // Nếu đã khởi tạo rồi thì bỏ qua, tránh lag
        if (this.mobileMenuInitialized) return;
        this.mobileMenuInitialized = true;

        // Gắn sự kiện lắng nghe trực tiếp lên toàn bộ trang (document)
        document.addEventListener('click', (e) => {
            const pageMenu = document.getElementById('page-menu');
            const overlay = document.getElementById('menu-overlay');

            // 1. Click nút MỞ menu
            if (e.target.closest('#mobile-menu-btn')) {
                if (pageMenu) pageMenu.classList.add('open');
                if (overlay) overlay.classList.add('open');
            }
            
            // 2. Click nút ĐÓNG menu hoặc click vùng tối (overlay)
            if (e.target.closest('#close-menu-btn') || e.target.matches('#menu-overlay')) {
                if (pageMenu) pageMenu.classList.remove('open');
                if (overlay) overlay.classList.remove('open');
            }

            // 3. XỬ LÝ CLICK XỔ MENU CON (SẢN PHẨM) - THAY ĐỔI SANG THUẬT TOÁN QUÉT VÙNG THÔNG MINH
            const hasSubmenu = e.target.closest('.has-submenu');
            const isClickInsideSubmenu = e.target.closest('.submenu');
            
            // Nếu click trúng danh mục cha (.has-submenu) nhưng KHÔNG click vào các đường link con bên trong (.submenu)
            if (hasSubmenu && !isClickInsideSubmenu) {
                
                // KIỂM TRA CHẾ ĐỘ MOBILE AN TOÀN: 
                // Kiểm tra xem nút bấm Mobile Menu có đang HIỂN THỊ THỰC TẾ trên màn hình hay không.
                // Giải pháp này giúp sửa lỗi khi file index.html quên/thiếu thẻ meta viewport dẫn đến việc đo window.innerWidth bị sai.
                const mobileMenuBtn = document.getElementById('mobile-menu-btn');
                const isMobileLayout = window.innerWidth <= 991 || (mobileMenuBtn && window.getComputedStyle(mobileMenuBtn).display !== 'none');
                
                if (isMobileLayout) {
                    e.preventDefault(); // Chặn hành vi nhảy trang mặc định sang products.html trên điện thoại
                    hasSubmenu.classList.toggle('open'); // Thêm hoặc bớt class 'open' để ẩn/hiện danh sách sản phẩm
                }
            }
        });
    }
};

// ==========================================
// CHẠY SCRIPTS KHI LOAD TRANG
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    // 1. Khởi tạo Menu Mobile ngay lập tức (Dùng Event Delegation nên không cần đợi Header render)
    HeaderController.initMobileMenu();

    let isInitialized = false;

    // 2. Chờ Header HTML load xong để cập nhật dữ liệu (Giỏ hàng, User, Highlight Menu)
    const checkExist = setInterval(() => {
        const doc = parent.document || document;
        // Chỉ cần tìm thấy .site-header là biết HTML đã được render vào trang
        const header = doc.querySelector(".site-header");
        
        if (header && !isInitialized) {
            isInitialized = true; 
            HeaderController.highlightActiveMenu();
            HeaderController.updateCartBadge();
            HeaderController.updateAuthHeader();
            clearInterval(checkExist);  
        }
    }, 100);

    // Dừng kiểm tra sau 3 giây để tối ưu tài nguyên trình duyệt (phòng hờ lỗi mạng)
    setTimeout(() => {
        clearInterval(checkExist);
    }, 3000);
});