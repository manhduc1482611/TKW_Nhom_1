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
// CHẠY SCRIPTS KHI LOAD TRANG
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    updateCartBadge();
    highlightActiveMenu();

    // Xử lý an toàn khi Header được nhúng bằng js/fetch chậm hơn body
    let checkExist = setInterval(() => {
        const badge = parent.document.querySelector(".cart-count") || document.querySelector(".cart-count");
        if (badge) {
            updateCartBadge();
            highlightActiveMenu();
            clearInterval(checkExist); 
        }
    }, 200);

    // Tự động dừng vòng lặp sau 3 giây để tối ưu hiệu suất
    setTimeout(() => clearInterval(checkExist), 3000);
});