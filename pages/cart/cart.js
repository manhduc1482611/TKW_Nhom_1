document.addEventListener("DOMContentLoaded", () => {
    renderCart();

    // Lắng nghe sự kiện click trên toàn bộ container giỏ hàng (Event Delegation)
    const container = document.getElementById("cartItemsContainer");
    if (container) {
        container.addEventListener("click", handleCartActions);
    }

    // Xử lý nút thanh toán
    const checkoutBtn = document.getElementById("checkoutBtn");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            if (!checkoutBtn.disabled) {
                window.location.href = "/pages/checkout/checkout.html";
            }
        });
    }
});

// ==========================================
// HÀM RENDER GIỎ HÀNG CHÍNH
// ==========================================
function renderCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    const emptyState = document.getElementById("emptyCartState");
    const filledState = document.getElementById("filledCartState");
    const container = document.getElementById("cartItemsContainer");

    if (!emptyState || !filledState || !container) return;

    // 1. Kiểm tra giỏ hàng trống hay có đồ
    if (cart.length === 0) {
        emptyState.style.display = "block";
        filledState.style.display = "none";
        updateSummary(0, 0); 
        updateHeaderBadge();  
        return;
    }

    emptyState.style.display = "none";
    filledState.style.display = "block";

    // 2. Render danh sách sản phẩm
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
            <div class="cart-item">
                <div class="cart-item-info">
                    <img src="${item.image || '/src/images/placeholder.png'}" alt="${item.name}">
                    <div class="cart-item-details">
                        <span class="brand">${item.brand || 'BeautyStore'}</span>
                        <h4>${item.name}</h4>
                        <span class="price">${price.toLocaleString('vi-VN')}đ</span>
                    </div>
                </div>
                
                <div class="cart-item-qty">
                    <button class="btn-qty-minus" data-id="${item.id}">-</button>
                    <span>${qty}</span>
                    <button class="btn-qty-plus" data-id="${item.id}">+</button>
                </div>

                <div class="cart-item-total">
                    ${itemTotal.toLocaleString('vi-VN')}đ
                </div>

                <button class="btn-delete-item" data-id="${item.id}">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
    });

    container.innerHTML = htmlContent;

    // 3. Cập nhật số liệu
    updateSummary(totalItems, subtotal);
    updateHeaderBadge();
}

// ==========================================
// HÀM XỬ LÝ CLICK (TĂNG/GIẢM/XÓA)
// ==========================================
function handleCartActions(e) {
    const target = e.target.closest("button"); 
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
            cart.splice(productIndex, 1);
        }
    } 
    // Nút Xóa Sản Phẩm
    else if (target.classList.contains("btn-delete-item")) {
        cart.splice(productIndex, 1);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

// ==========================================
// HÀM CẬP NHẬT TỔNG TIỀN VÀ TRẠNG THÁI BUTTON
// ==========================================
function updateSummary(totalItems, subtotal) {
    const totalItemsEl = document.getElementById("cartTotalItems");
    const subtotalPriceEl = document.getElementById("subtotalPrice");
    const totalPriceEl = document.getElementById("totalPrice");
    const checkoutBtn = document.getElementById("checkoutBtn");

    if (totalItemsEl) totalItemsEl.textContent = totalItems;
    if (subtotalPriceEl) subtotalPriceEl.textContent = subtotal.toLocaleString('vi-VN') + "đ";
    if (totalPriceEl) totalPriceEl.textContent = subtotal.toLocaleString('vi-VN') + "đ";

    if (checkoutBtn) {
        if (totalItems > 0) {
            checkoutBtn.removeAttribute("disabled");
        } else {
            checkoutBtn.setAttribute("disabled", "true");
        }
    }
}

// Đồng bộ số lượng hiển thị lên badge chung của hệ thống
function updateHeaderBadge() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalQuantity = cart.reduce((total, item) => total + (parseInt(item.quantity, 10) || 0), 0);
    
    const headerBadge = (typeof parent !== "undefined" && parent.document.querySelector(".cart-count")) 
                        || document.querySelector(".cart-count");
                        
    if (headerBadge) {
        headerBadge.textContent = totalQuantity;
    }
}