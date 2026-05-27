document.addEventListener("DOMContentLoaded", () => {
    const SHIPPING_FEE = 20000;
    let currentDiscount = 0;
    let promoCodeApplied = "";

    // 1. Lấy dữ liệu giỏ hàng thực tế đang lưu trữ từ LocalStorage
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Nếu giỏ hàng trống, cảnh báo và quay về trang giỏ hàng
    if (cart.length === 0) {
        alert("Giỏ hàng của bạn đang trống! Vui lòng quay lại thêm mỹ phẩm vào giỏ.");
        window.location.href = "cart.html";
        return;
    }

    // 2. Render dữ liệu đơn hàng thực tế ra giao diện
    renderCheckoutSummary(cart, SHIPPING_FEE, currentDiscount);
    
    // Tạo ngẫu nhiên nội dung chuyển khoản theo mã đơn
    generateTransferCode();

    // 3. LOGIC QUAN TRỌNG: Ẩn/Hiện Tên tài khoản & Ảnh aaa.jpg theo phương thức thanh toán
    setupPaymentToggle();

    // 4. Xử lý áp dụng mã Voucher giảm giá ưu đãi
    const btnApplyPromo = document.getElementById("btnApplyPromo");
    btnApplyPromo.addEventListener("click", () => {
        const promoInput = document.getElementById("promoInput").value.trim().toUpperCase();
        
        if (promoInput === "BEAUTY") {
            const subtotal = calculateSubtotal(cart);
            currentDiscount = Math.round(subtotal * 0.1); // Giảm 10% đơn
            promoCodeApplied = "BEAUTY (-10%)";
            
            alert("Áp dụng mã ưu đãi Giảm 10% thành công!");
            renderCheckoutSummary(cart, SHIPPING_FEE, currentDiscount, promoCodeApplied);
        } else if (promoInput === "") {
            alert("Vui lòng điền mã giảm giá của bạn!");
        } else {
            alert("Mã giảm giá này không hợp lệ hoặc đã hết hạn!");
        }
    });

    // 5. Xử lý click ĐẶT HÀNG NGAY
    const btnOrderNow = document.getElementById("btnOrderNow");
    btnOrderNow.addEventListener("click", () => {
        const name = document.getElementById("customerName").value.trim();
        const phone = document.getElementById("customerPhone").value.trim();
        const address = document.getElementById("customerAddress").value.trim();
        const district = document.getElementById("customerDistrict").value;
        const selectedMethod = document.querySelector('.payment-card.selected').dataset.method;

        if (!name || !phone || !address) {
            alert("Vui lòng nhập đầy đủ thông tin Người nhận, Số điện thoại và Địa chỉ giao hàng!");
            return;
        }

        // Tạo gói tin đơn hàng giả định đẩy lên hệ thống quản trị
        const completeOrder = {
            customer: { name, phone, address, district, email: document.getElementById("customerEmail").value },
            products: cart,
            shipping: SHIPPING_FEE,
            discount: currentDiscount,
            payment: selectedMethod,
            note: document.getElementById("orderNote").value.trim(),
            date: new Date().toLocaleString('vi-VN')
        };

        console.log("Đơn hàng đã lưu thành công:", completeOrder);

        if (selectedMethod === "BANK") {
            alert(`🎉 ĐẶT HÀNG THÀNH CÔNG!\n\nBạn chọn thanh toán Chuyển khoản ngân hàng. Vui lòng hoàn tất chuyển khoản theo ảnh QR (aaa.jpg) hiển thị để tiệm đóng gói chuyển đi sớm nhất!`);
        } else {
            alert(`🎉 ĐẶT HÀNG THÀNH CÔNG!\n\nĐơn hàng hỏa tốc đang được đóng gói. Bạn sẽ thanh toán tiền mặt trực tiếp cho Shipper COD khi nhận hàng.`);
        }

        // Xóa sạch giỏ hàng sau khi mua thành công và chuyển hướng về danh mục sản phẩm
        localStorage.removeItem("cart");
        window.location.href = "/pages/product/html/products.html";
    });
});

// Hàm tính tổng tiền tạm tính của sản phẩm
function calculateSubtotal(cart) {
    return cart.reduce((total, item) => {
        const qty = parseInt(item.quantity, 10) || 1;
        const price = parseFloat(item.price) || 0;
        return total + (price * qty);
    }, 0);
}

// Hàm render đổ sản phẩm và cập nhật bảng tiền tệ
function renderCheckoutSummary(cart, shipping, discount, promoName = "") {
    const container = document.getElementById("checkoutItemsContainer");
    let htmlContent = "";
    let totalItems = 0;
    let subtotal = calculateSubtotal(cart);

    cart.forEach(item => {
        const qty = parseInt(item.quantity, 10) || 1;
        const price = parseFloat(item.price) || 0;
        totalItems += qty;

        // Khớp thuộc tính cấu trúc dữ liệu ảnh và hãng từ trang chi tiết sản phẩm / giỏ hàng
        const itemImage = item.image || '/src/images/placeholder.png';
        const itemBrand = item.brand || 'BeautyStore';

        htmlContent += `
            <div class="order-item">
                <img src="${itemImage}" alt="${item.name}">
                <div class="item-info">
                    <div class="item-header">
                        <strong>${item.name}</strong>
                        <span class="item-price">${(price * qty).toLocaleString('vi-VN')}đ</span>
                    </div>
                    <div class="item-footer">
                        <span>Thương hiệu: ${itemBrand}</span>
                        <span>SL: ${qty}</span>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = htmlContent;

    // Cập nhật số liệu hiển thị lên DOM cột phải
    document.getElementById("checkoutTotalItems").textContent = totalItems;
    document.getElementById("checkoutSubtotal").textContent = subtotal.toLocaleString('vi-VN') + "đ";
    document.getElementById("checkoutShipping").textContent = shipping.toLocaleString('vi-VN') + "đ";
    
    const discountWrapper = document.getElementById("discountWrapper");
    if (discount > 0) {
        discountWrapper.style.display = "flex";
        document.getElementById("promoNameDisplay").textContent = promoName;
        document.getElementById("checkoutDiscount").textContent = "-" + discount.toLocaleString('vi-VN') + "đ";
    } else {
        discountWrapper.style.display = "none";
    }

    const finalPay = (subtotal + shipping) - discount;
    document.getElementById("checkoutTotalPay").textContent = finalPay.toLocaleString('vi-VN') + "đ";
}

// Hàm xử lý Click chọn phương thức thanh toán & ẩn/hiện khung tên tài khoản + ảnh aaa.jpg
function setupPaymentToggle() {
    const paymentCards = document.querySelectorAll('.payment-card');
    const bankDetailsBlock = document.getElementById("bankDetailsBlock");

    // Khởi tạo trạng thái ban đầu dựa vào input checked mặc định (BANK đang checked thì hiện sẵn)
    const checkedRadio = document.querySelector('input[name="paymentMethod"]:checked');
    if (checkedRadio && checkedRadio.value === "BANK") {
        bankDetailsBlock.style.display = "block";
    } else {
        bankDetailsBlock.style.display = "none";
    }

    // Lắng nghe sự kiện click trên các thẻ
    paymentCards.forEach(card => {
        card.addEventListener("click", () => {
            paymentCards.forEach(c => c.classList.remove("selected"));
            card.classList.add("selected");
            
            const radioBtn = card.querySelector('input[type="radio"]');
            if (radioBtn) radioBtn.checked = true;

            // Kiểm tra phương thức để ẩn/hiện tài khoản ngân hàng và ảnh aaa.jpg
            if (card.dataset.method === "BANK") {
                bankDetailsBlock.style.display = "block";
            } else {
                bankDetailsBlock.style.display = "none";
            }
        });
    });
}

// Sinh mã nội dung chuyển khoản tự động
function generateTransferCode() {
    const randomID = Math.floor(1000 + Math.random() * 9000);
    const contentText = `BST DH${randomID}`;
    const target = document.getElementById("bankTransferContent");
    if (target) target.textContent = contentText;
}