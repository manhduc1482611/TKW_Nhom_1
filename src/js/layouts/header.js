// ==========================================
// HÀM ĐỒNG BỘ BADGE GIỎ HÀNG (DÙNG CHUNG)
// ==========================================
function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // SỬA LỖI 1: Lấy số lượng loại sản phẩm (Ví dụ: 3 sản phẩm khác nhau -> hiện số 3)
    const totalItems = cart.length; 

    // Nếu bạn muốn hiện tổng số món (1+1+4=6) thì mở comment dòng dưới và xóa dòng trên:
    // const totalItems = cart.reduce((total, item) => total + (parseInt(item.quantity, 10) || 0), 0);

    const badge = parent.document.querySelector(".cart-count") || document.querySelector(".cart-count");
    if (badge) {
        badge.textContent = totalItems;
    }
}

// SỬA LỖI 2: Cơ chế tự động kiểm tra và nạp số giỏ hàng liên tục khi load trang
document.addEventListener("DOMContentLoaded", () => {
    updateCartBadge();

    // Đề phòng Header được load chậm bằng async/fetch: Cứ 200ms kiểm tra lại, thấy thẻ badge là nạp số ngay
    let checkExist = setInterval(() => {
        const badge = parent.document.querySelector(".cart-count") || document.querySelector(".cart-count");
        if (badge) {
            updateCartBadge();
            clearInterval(checkExist); // Tìm thấy rồi thì dừng lại
        }
    }, 200);

    // Tự động dừng kiểm tra sau 3 giây để tránh tốn tài nguyên máy
    setTimeout(() => clearInterval(checkExist), 3000);
});