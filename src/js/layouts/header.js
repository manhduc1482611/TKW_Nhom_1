document.addEventListener("DOMContentLoaded", function () {
    // 1. CẬP NHẬT SỐ LƯỢNG GIỎ HÀNG TỪ LOCALSTORAGE
    function updateCartCount() {
        const cartCountElement = document.querySelector(".cart-count");
        if (!cartCountElement) return;

        try {
            // Giả sử giỏ hàng của bạn lưu trong localStorage dưới key là 'cart'
            // Dữ liệu mẫu: [{id: 1, name: 'Sữa rửa mặt', quantity: 2}]
            const cart = JSON.parse(localStorage.getItem("cart")) || [];
            
            // Tính tổng số lượng tất cả sản phẩm trong giỏ
            const totalItems = cart.reduce((total, item) => total + (parseInt(item.quantity) || 1), 0);
            
            // Hiển thị số lượng lên badge
            cartCountElement.textContent = totalItems;
        } catch (error) {
            console.error("Lỗi khi đọc giỏ hàng từ localStorage:", error);
            cartCountElement.textContent = 0;
        }
    }

    // 2. HIGHLIGHT MENU TRANG HIỆN TẠI (ACTIVE STATE)
    function setActiveMenu() {
        const currentPath = window.location.pathname;
        const menuLinks = document.querySelectorAll(".page-menu a");

        menuLinks.forEach(link => {
            const href = link.getAttribute("href");
            
            // Xóa class active cũ nếu có
            link.classList.remove("active");

            // Kiểm tra xem href của thẻ a có khớp với đường dẫn hiện tại không
            if (currentPath === href || 
               (currentPath === "/" && href === "/index.html") || 
               (currentPath.includes("/pages/product/") && href.includes("/pages/product/"))) {
                link.classList.add("active");
            }
        });
    }

    // 3. LẮNG NGHE SỰ KIỆN THAY ĐỔI GIỎ HÀNG GIỮA CÁC TAB (MULTI-TAB SYNC)
    window.addEventListener("storage", function (event) {
        if (event.key === "cart") {
            updateCartCount();
        }
    });

    // 4. TẠO MỘT SỰ KIỆN TÙY BIẾN (CUSTOM EVENT) ĐỂ GỌI KHI THÊM VÀO GIỎ HÀNG TRÊN CÙNG MỘT TRANG
    // Khi bạn làm code trang Chi tiết sản phẩm, chỉ cần gọi: window.dispatchEvent(new Event('cartUpdated'));
    window.addEventListener("cartUpdated", updateCartCount);

    // CHẠY KHỞI TẠO BAN ĐẦU
    updateCartCount();
    setActiveMenu();
});