document.addEventListener("DOMContentLoaded", () => {
    renderCartPage();
});

function renderCartPage() {
    const emptyState = document.getElementById("emptyCartState");
    const filledState = document.getElementById("filledCartState");
    const checkoutBtn = document.getElementById("checkoutBtn");
    const cartTotalItems = document.getElementById("cartTotalItems");
    const subtotalPrice = document.getElementById("subtotalPrice");
    const totalPrice = document.getElementById("totalPrice");

    // Đọc giỏ hàng từ LocalStorage
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Tính tổng số lượng sản phẩm
    const totalQuantity = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    cartTotalItems.textContent = totalQuantity;

    if (cart.length === 0) {
        // NẾU GIỎ HÀNG TRỐNG (Hiển thị giao diện giống trong ảnh)
        emptyState.style.display = "block";
        filledState.style.display = "none";
        
        subtotalPrice.textContent = "0đ";
        totalPrice.textContent = "0đ";
        
        checkoutBtn.classList.remove("active");
        checkoutBtn.disabled = true;
    } else {
        // NẾU CÓ SẢN PHẨM 
        emptyState.style.display = "none";
        filledState.style.display = "block";
        
        // Bật nút thanh toán
        checkoutBtn.classList.add("active");
        checkoutBtn.disabled = false;

        // Tính tổng tiền
        let totalMoney = 0;
        cart.forEach(item => {
            // Lấy giá khuyến mãi, nếu không có lấy giá gốc
            const itemPrice = item.salePrice ? item.salePrice : item.price;
            totalMoney += (itemPrice * (item.quantity || 1));
        });

        // Cập nhật lên màn hình (Định dạng VNĐ)
        const formattedMoney = Number(totalMoney).toLocaleString('vi-VN') + "đ";
        subtotalPrice.textContent = formattedMoney;
        totalPrice.textContent = formattedMoney;

        // BẠN CÓ THỂ RENDER DANH SÁCH SẢN PHẨM Ở ĐÂY VÀO `cartItemsContainer`
        // ...
    }
}