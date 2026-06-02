document.addEventListener("DOMContentLoaded", async () => {
    // =========================================================
    // 1. ĐỒNG BỘ THÔNG TIN TÀI KHOẢN VÀO FORM THANH TOÁN
    // =========================================================
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        const nameInput = document.getElementById("customerName");
        const phoneInput = document.getElementById("customerPhone");
        const emailInput = document.getElementById("customerEmail");
        const addressInput = document.getElementById("customerAddress") || document.getElementById("shippingAddress");

        if (nameInput && currentUser.fullname) nameInput.value = currentUser.fullname;
        if (phoneInput && currentUser.phone) phoneInput.value = currentUser.phone;
        if (emailInput && currentUser.email) emailInput.value = currentUser.email;
        if (addressInput && currentUser.address) addressInput.value = currentUser.address;
    }

    const SHIPPING_FEE = 20000;
    let currentDiscount = 0;
    let promoCodeApplied = "";
    let PROMO_DATA = {}; // Lưu trữ dữ liệu tải từ promotions.json

    // 2. KIỂM TRA GIỎ HÀNG THỰC TẾ TRONG LOCALSTORAGE
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
        alert("Giỏ hàng của bạn đang trống! Vui lòng quay lại thêm mỹ phẩm vào giỏ.");
        window.location.href = "cart.html";
        return;
    }

    // 3. TẢI DỮ LIỆU ĐỘNG TỪ FILE PROMOTIONS.JSON VÀ DỰNG BANNER VOUCHER
    async function loadAndInitializePromotions() {
        try {
            const response = await fetch('/data/promotions.json');
            if (response.ok) {
                PROMO_DATA = await response.json();
            } else {
                console.warn("Không thể tải promotions.json, chuyển sang cấu hình dự phòng.");
                PROMO_DATA = {
                    "LANDAU": { "type": "always", "discountRate": 0.10, "name": "Ghé Thăm Lần Đầu" },
                    "FLASHSALE": { "type": "daily", "startHour": 0, "endHour": 23, "discountRate": 0.30, "minOrder": 500000, "name": "Flash Sale Giờ Vàng" }
                };
            }
        } catch (error) {
            console.error("Lỗi kết nối tệp khuyến mãi:", error);
        }
        
        // Vẽ danh sách voucher lên giao diện
        renderPromotionsUI();
        
        // Kiểm tra xem khách hàng có áp dụng mã từ trước đó không
        const savedPromo = localStorage.getItem("appliedPromo");
        if (savedPromo && PROMO_DATA[savedPromo]) {
            applyPromoCodeSilent(savedPromo);
        } else {
            renderCheckoutSummary(cart, SHIPPING_FEE, currentDiscount);
        }
    }

    // 4. RENDER VÙNG VOUCHER THEO THIẾT KẾ CARD TICKET CHUẨN CSS
    function renderPromotionsUI() {
        const container = document.getElementById("promotionsListContainer");
        if (!container || Object.keys(PROMO_DATA).length === 0) return;

        let promoHTML = `
            <div class="available-promotions-section">
                <div class="promotions-title">
                    <i class="fa-solid fa-tags"></i> Mã giảm giá khả dụng
                </div>
                <div class="promotions-list">
        `;

        for (const code in PROMO_DATA) {
            const promo = PROMO_DATA[code];
            const discountPercent = promo.discountRate * 100;
            let minOrderText = promo.minOrder ? `Đơn từ ${(promo.minOrder).toLocaleString('vi-VN')}đ` : "Mọi đơn hàng";

            promoHTML += `
                <div class="promo-coupon-card" id="card-${code}">
                    <div class="coupon-left-icon">
                        <i class="fa-solid fa-ticket-simple"></i>
                    </div>
                    <div class="coupon-mid-info">
                        <div class="coupon-name-badge">
                            <span class="coupon-title">${promo.name}</span>
                            <span class="coupon-rate-tag">-${discountPercent}%</span>
                        </div>
                        <div class="coupon-code-text">Mã: <strong>${code}</strong> · <span style="font-size:11px; color:#999;">${minOrderText}</span></div>
                    </div>
                    <button type="button" class="btn-use-coupon" data-code="${code}">Dùng ngay</button>
                </div>
            `;
        }

        promoHTML += `</div></div>`;
        container.innerHTML = promoHTML;

        // Gắn sự kiện nhấn tương tác cho từng nút "Dùng ngay"
        document.querySelectorAll(".btn-use-coupon").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const targetCode = e.target.getAttribute("data-code");
                processPromoApplication(targetCode, true);
            });
        });
    }

    // 5. KIỂM TRA ĐIỀU KIỆN ÁP DỤNG MÃ VOUCHER
    function checkPromoValidity(promoCode) {
        const promo = PROMO_DATA[promoCode];
        if (!promo) return { valid: false, msg: "Mã giảm giá không hợp lệ hoặc đã hết hạn!" };

        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentDate = now.getDate();
        const currentHour = now.getHours();
        const subtotal = calculateSubtotal(cart);

        if (promo.type === 'yearly' && (currentMonth !== promo.month || currentDate !== promo.date)) {
            return { valid: false, msg: `Mã này chỉ áp dụng vào ngày ${promo.date}/${promo.month} hằng năm!` };
        }
        
        if (promo.type === 'yearly-monthly' && (currentMonth !== promo.month || currentDate < promo.startDay || currentDate > promo.endDay)) {
            return { valid: false, msg: `Mã này chỉ hoạt động từ ngày ${promo.startDay} đến ngày ${promo.endDay} tháng ${promo.month}!` };
        }

        if (promo.type === 'daily' && (currentHour < promo.startHour || currentHour > promo.endHour)) {
            return { valid: false, msg: `Mã chỉ áp dụng trong khung giờ vàng hằng ngày từ ${promo.startHour}h - ${promo.endHour}h!` };
        }

        if (promo.minOrder && subtotal < promo.minOrder) {
            return { valid: false, msg: `Đơn hàng chưa đạt giá trị tối thiểu từ ${promo.minOrder.toLocaleString('vi-VN')}đ!` };
        }

        if (promo.isBrandSpecific) {
            const hasBrandItem = cart.some(item => {
                const itemBrand = item.brand ? item.brand.toLowerCase() : "";
                const itemName = item.name ? item.name.toLowerCase() : "";
                const targetBrand = promo.brand.toLowerCase();
                return itemBrand.includes(targetBrand) || itemName.includes(targetBrand);
            });
            if (!hasBrandItem) {
                return { valid: false, msg: `Mã này chỉ áp dụng khi mua sản phẩm của thương hiệu ${promo.brand}!` };
            }
        }

        return { valid: true, promo };
    }

    // 6. XỬ LÝ KHI KÍCH HOẠT MÃ GIẢM GIÁ
    function processPromoApplication(code, showAlert = false) {
        const check = checkPromoValidity(code);
        if (check.valid) {
            const subtotal = calculateSubtotal(cart);
            currentDiscount = Math.round(subtotal * check.promo.discountRate);
            promoCodeApplied = code;
            
            localStorage.setItem("appliedPromo", promoCodeApplied);
            renderCheckoutSummary(cart, SHIPPING_FEE, currentDiscount);
            updateActivePromoUIInCheckout(promoCodeApplied, currentDiscount);
            
            // Đổi trạng thái hiển thị active trên danh sách thẻ
            document.querySelectorAll(".promo-coupon-card").forEach(c => c.classList.remove("selected-coupon"));
            const targetCard = document.getElementById(`card-${code}`);
            if (targetCard) targetCard.classList.add("selected-coupon");

            if (showAlert) {
                alert(`Áp dụng mã ưu đãi ${promoCodeApplied} thành công! Bạn được giảm ${(check.promo.discountRate * 100)}% vào đơn hàng.`);
            }
        } else {
            if (showAlert) alert(check.msg);
            localStorage.removeItem("appliedPromo");
        }
    }

    function applyPromoCodeSilent(code) {
        processPromoApplication(code, false);
    }

    // 7. HIỂN THỊ BANNER THÔNG BÁO MÃ ĐÃ ÁP DỤNG TRÊN HÓA ĐƠN TÍNH TIỀN
    function updateActivePromoUIInCheckout(appliedPromo, discount) {
        let activeBox = document.getElementById("activePromoBoxCheckout");

        if (!appliedPromo || discount === 0) {
            if (activeBox) activeBox.remove();
            return;
        }

        if (!activeBox) {
            activeBox = document.createElement("div");
            activeBox.id = "activePromoBoxCheckout";
            activeBox.className = "active-promo-banner";

            const priceSummaryBlock = document.querySelector(".price-summary-block");
            if (priceSummaryBlock) {
                priceSummaryBlock.parentNode.insertBefore(activeBox, priceSummaryBlock);
            }
        }

        const promo = PROMO_DATA[appliedPromo];
        activeBox.innerHTML = `
            <div class="promo-info-wrapper">
                <i class="fa-solid fa-ticket active-promo-icon"></i>
                <div class="promo-meta">
                    <span class="promo-title-code">Mã đã chọn: <strong>${appliedPromo}</strong></span>
                    <span class="promo-desc-short">${promo.name} (Giảm ${promo.discountRate * 100}%)</span>
                </div>
            </div>
            <button type="button" class="btn-remove-promo" id="removePromoBtnCheckout" title="Hủy áp dụng mã này">&times;</button>
        `;

        // Sự kiện gỡ bỏ mã giảm giá
        document.getElementById("removePromoBtnCheckout").addEventListener("click", () => {
            localStorage.removeItem("appliedPromo");
            document.querySelectorAll(".promo-coupon-card").forEach(c => c.classList.remove("selected-coupon"));
            currentDiscount = 0;
            promoCodeApplied = "";
            renderCheckoutSummary(cart, SHIPPING_FEE, currentDiscount);
            updateActivePromoUIInCheckout("", 0);
        });
    }

    // 8. CÁC HÀM TRỢ GIÚP TÍNH TOÁN VÀ ĐỒNG BỘ HIỂN THỊ SẢN PHẨM (CHUẨN CLASS .order-item)
    function calculateSubtotal(cartList) {
        return cartList.reduce((sum, item) => {
            const price = parseInt(item.price) || 0;
            const qty = parseInt(item.quantity) || 1;
            return sum + (price * qty);
        }, 0);
    }

    function renderCheckoutSummary(cartList, shipping, discount) {
        const subtotal = calculateSubtotal(cartList);
        const totalPay = subtotal + shipping - discount;

        document.getElementById("checkoutSubtotal").textContent = subtotal.toLocaleString('vi-VN') + "đ";
        document.getElementById("checkoutShipping").textContent = shipping.toLocaleString('vi-VN') + "đ";
        
        const discountWrapper = document.getElementById("discountWrapper");
        if (discount > 0) {
            document.getElementById("checkoutDiscount").textContent = "-" + discount.toLocaleString('vi-VN') + "đ";
            document.getElementById("promoNameDisplay").textContent = promoCodeApplied;
            if (discountWrapper) discountWrapper.style.display = "flex";
        } else {
            if (discountWrapper) discountWrapper.style.display = "none";
        }

        document.getElementById("checkoutTotalPay").textContent = Math.max(0, totalPay).toLocaleString('vi-VN') + "đ";
        document.getElementById("checkoutTotalItems").textContent = cartList.reduce((acc, item) => acc + (parseInt(item.quantity) || 1), 0);

        // ĐỒNG BỘ HOÀN TOÀN cấu trúc HTML với hệ thống class sẵn có trong checkout.css
        const container = document.getElementById("checkoutItemsContainer");
        if (container) {
            container.innerHTML = cartList.map(item => `
                <div class="order-item">
                    <img src="${item.image || '/assets/images/default.jpg'}" alt="${item.name}">
                    <div class="item-info">
                        <div class="item-header">
                            <strong>${item.name}</strong>
                            <span class="item-price">${((parseInt(item.price) || 0) * (parseInt(item.quantity) || 1)).toLocaleString('vi-VN')}đ</span>
                        </div>
                        <div class="item-footer">
                            <span>Thương hiệu: Tiệm Mỹ Phẩm</span>
                            <span>Số lượng: x${item.quantity}</span>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }

    function setupPaymentToggle() {
        const paymentCards = document.querySelectorAll('.payment-card');
        const bankDetailsBlock = document.getElementById("bankDetailsBlock");

        const checkedRadio = document.querySelector('input[name="paymentMethod"]:checked');
        if (bankDetailsBlock) {
            bankDetailsBlock.style.display = (checkedRadio && checkedRadio.value === "BANK") ? "block" : "none";
        }

        paymentCards.forEach(card => {
            card.addEventListener("click", () => {
                paymentCards.forEach(c => c.classList.remove("selected"));
                card.classList.add("selected");
                
                const radioBtn = card.querySelector('input[type="radio"]');
                if (radioBtn) radioBtn.checked = true;

                if (bankDetailsBlock) {
                    bankDetailsBlock.style.display = (card.dataset.method === "BANK") ? "block" : "none";
                }
            });
        });
    }

    function generateTransferCode() {
        const randomID = Math.floor(1000 + Math.random() * 9000);
        const contentEl = document.getElementById("bankTransferContent");
        if (contentEl) contentEl.textContent = `BST DH${randomID}`;
    }

    // 9. KHỞI CHẠY TIẾN TRÌNH LUỒNG DỮ LIỆU CHÍNH
    await loadAndInitializePromotions();
    generateTransferCode();
    setupPaymentToggle();

    // 10. ĐẶT HÀNG CHÍNH THỨC VÀ GỬI ĐƠN
    document.getElementById("btnOrderNow")?.addEventListener("click", () => {
        const name = document.getElementById("customerName").value.trim();
        const phone = document.getElementById("customerPhone").value.trim();
        const email = document.getElementById("customerEmail").value.trim();
        const address = document.getElementById("customerAddress").value.trim();
        const district = document.getElementById("customerDistrict").value;
        const note = document.getElementById("orderNote").value.trim();
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || "COD";

        if (!name || !phone || !email || !address) {
            alert("Vui lòng hoàn thiện tất cả các thông tin giao hàng bắt buộc!");
            return;
        }

        const orderId = "BST-" + Date.now();
        const subtotal = calculateSubtotal(cart);
        const totalPay = subtotal + SHIPPING_FEE - currentDiscount;

        const orderObj = {
            id: orderId,
            customer: { name, phone, email, city: "Hà Nội", district, address },
            items: cart,
            summary: { subtotal, shippingFee: SHIPPING_FEE, discount: currentDiscount, totalPayment: totalPay, promoCode: promoCodeApplied },
            payment: { method: paymentMethod, status: "Chưa thanh toán" },
            note: note,
            createdAt: new Date().toISOString()
        };

        let ordersList = JSON.parse(localStorage.getItem("ordersList")) || [];
        ordersList.push(orderObj);
        localStorage.setItem("ordersList", JSON.stringify(ordersList));

        // Xóa giỏ hàng và dữ liệu mã sau khi thanh toán thành công
        localStorage.removeItem("cart");
        localStorage.removeItem("appliedPromo");

        alert("🎉 Chúc mừng! Đơn hàng của bạn đã được khởi tạo và ghi nhận thành công trên hệ thống.");
        window.location.href = "/index.html";
    });
});