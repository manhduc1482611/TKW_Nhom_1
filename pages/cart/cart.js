document.addEventListener("DOMContentLoaded", () => {
    renderCart();

    // Lắng nghe sự kiện click trên toàn bộ container giỏ hàng (Event Delegation)
    const container = document.getElementById("cartItemsContainer");
    container.addEventListener("click", handleCartActions);

    // Xử lý nút thanh toán
    const checkoutBtn = document.getElementById("checkoutBtn");
    checkoutBtn.addEventListener("click", () => {
        if (!checkoutBtn.disabled) {
            window.location.href = "/pages/checkout/checkout.html";
        }
    });
});

// ==========================================
// HÀM RENDER GIỎ HÀNG CHÍNH
// ==========================================
function renderCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    const emptyState = document.getElementById("emptyCartState");
    const filledState = document.getElementById("filledCartState");
    const container = document.getElementById("cartItemsContainer");

    // 1. Kiểm tra giỏ hàng trống hay có đồ
    if (cart.length === 0) {
        emptyState.style.display = "block";
        filledState.style.display = "none";
        updateSummary(0, 0); // Reset số liệu về 0
        updateHeaderBadge();  // Đồng bộ số lượng badge trên Header (nếu có)
        return;
    }

    emptyState.style.display = "none";
    filledState.style.display = "block";

    // 2. Render danh sách sản phẩm kèm ảnh và thông tin cơ bản
    let htmlContent = "";
    let totalItems = 0;
    let subtotal = 0;

    cart.forEach(item => {
        const qty = parseInt(item.quantity, 10) || 1;
        const price = parseFloat(item.price) || 0;
        const itemTotal = price * qty;

        totalItems += qty;
        subtotal += itemTotal;

        htmlContent += `
            <div class="cart-item" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #eee;">
                <div style="display: flex; align-items: center; gap: 15px; flex: 1;">
                    <img src="${item.image || '/src/images/placeholder.png'}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px;">
                    <div>
                        <span style="font-size: 12px; color: #888; text-transform: uppercase;">${item.brand}</span>
                        <h4 style="margin: 4px 0; font-size: 16px; color: #333;">${item.name}</h4>
                        <span style="color: #ff4d4f; font-weight: bold;">${price.toLocaleString('vi-VN')}đ</span>
                    </div>
                </div>
                
                <div style="display: flex; align-items: center; gap: 10px; margin-right: 30px;">
                    <button class="btn-qty-minus" data-id="${item.id}" style="width: 28px; height: 28px; cursor: pointer;">-</button>
                    <span style="min-width: 20px; text-align: center; font-weight: bold;">${qty}</span>
                    <button class="btn-qty-plus" data-id="${item.id}" style="width: 28px; height: 28px; cursor: pointer;">+</button>
                </div>

                <div style="min-width: 100px; text-align: right; font-weight: bold; color: #333; margin-right: 20px;">
                    ${itemTotal.toLocaleString('vi-VN')}đ
                </div>

                <button class="btn-delete-item" data-id="${item.id}" style="background: none; border: none; color: #ff4d4f; cursor: pointer; font-size: 16px;">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
    });

    container.innerHTML = htmlContent;

    // 3. Cập nhật các bảng số liệu tính toán
    updateSummary(totalItems, subtotal);
    updateHeaderBadge();
}

// ==========================================
// HÀM XỬ LÝ CLICK (TĂNG/GIẢM/XÓA)
// ==========================================
function handleCartActions(e) {
    const target = e.target.closest("button"); // Tìm thẻ button được click (hoặc icon bên trong button)
    if (!target) return;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const productId = target.dataset.id;
    
    const productIndex = cart.findIndex(item => String(item.id) === String(productId));
    if (productIndex === -1) return;

    // Nút Tăng Số Lượng
    if (target.classList.contains("btn-qty-plus")) {
        cart[productIndex].quantity = (parseInt(cart[productIndex].quantity, 10) || 1) + 1;
    } 
    // Nút Giảm Số Lượng
    else if (target.classList.contains("btn-qty-minus")) {
        const currentQty = parseInt(cart[productIndex].quantity, 10) || 1;
        if (currentQty > 1) {
            cart[productIndex].quantity = currentQty - 1;
        } else {
            // Nếu giảm xuống dưới 1 thì tự động xóa sản phẩm khỏi giỏ
            cart.splice(productIndex, 1);
        }
    } 
    // Nút Xóa Sản Phẩm
    else if (target.classList.contains("btn-delete-item") || target.closest(".btn-delete-item")) {
        cart.splice(productIndex, 1);
    }

    // Lưu lại bộ nhớ và render lại giao diện mới
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

// ==========================================
// HÀM CẬP NHẬT TỔNG TIỀN VÀ TRẠNG THÁI BUTTON
// ==========================================
function updateSummary(totalItems, subtotal) {
    document.getElementById("cartTotalItems").textContent = totalItems;
    document.getElementById("subtotalPrice").textContent = subtotal.toLocaleString('vi-VN') + "đ";
    document.getElementById("totalPrice").textContent = subtotal.toLocaleString('vi-VN') + "đ";

    const checkoutBtn = document.getElementById("checkoutBtn");
    if (totalItems > 0) {
        checkoutBtn.removeAttribute("disabled");
    } else {
        checkoutBtn.setAttribute("disabled", "true");
    }
}

// Đồng bộ số lượng hiển thị lên badge chung của hệ thống (nếu có trên header)
function updateHeaderBadge() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalQuantity = cart.reduce((total, item) => total + (parseInt(item.quantity, 10) || 0), 0);
    
    const headerBadge = parent.document.querySelector(".cart-count") || document.querySelector(".cart-count");
    if (headerBadge) {
        headerBadge.textContent = totalQuantity;
    }
}