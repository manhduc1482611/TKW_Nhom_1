const PROMO_DATA = {
    "LAROCHE": { type: 'yearly-monthly', month: 6, startDay: 1, endDay: 30, discountRate: 0.05, isBrandSpecific: true, brand: 'La Roche-Posay', name: "Tuần lễ La Roche-Posay" },
    "VALENTINE20": { type: 'yearly', month: 2, date: 14, discountRate: 0.20, minOrder: 300000, name: "Valentine 14/2" },
    "FLASHSALE": { type: 'daily', startHour: 0, endHour: 23, discountRate: 0.30, minOrder: 500000, name: "Flash Sale Giờ Vàng" },
    "WOMEN83": { type: 'yearly', month: 3, date: 8, discountRate: 0.15, minOrder: 200000, name: "Quốc tế Phụ nữ 8/3" }
};

function checkPromoValidity(promoCode) {
    const promo = PROMO_DATA[promoCode];
    if (!promo) return { valid: false, msg: "Mã giảm giá không tồn tại!" };

    const IS_TESTING = true; 
    if (IS_TESTING) return { valid: true, promo };

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentDate = now.getDate();
    const currentHour = now.getHours();

    if (promo.type === 'yearly-monthly') {
        if (!(currentMonth === promo.month && currentDate >= promo.startDay && currentDate <= promo.endDay)) {
            return { valid: false, msg: `Mã chỉ có hiệu lực từ ngày ${promo.startDay} đến ${promo.endDay} tháng ${promo.month} hàng năm!` };
        }
    } else if (promo.type === 'yearly') {
        if (!(currentMonth === promo.month && currentDate === promo.date)) {
            return { valid: false, msg: `Mã chỉ có hiệu lực duy nhất vào ngày ${promo.date}/${promo.month} hàng năm!` };
        }
    } else if (promo.type === 'daily') {
        if (!(currentHour >= promo.startHour && currentHour <= promo.endHour)) {
            return { valid: false, msg: `Mã chỉ có hiệu lực trong khung giờ từ ${promo.startHour}:00 đến ${promo.endHour}:59 hàng ngày!` };
        }
    }
    return { valid: true, promo };
}

function calculatePromoDiscount(promoCode, cart, subtotal) {
    const check = checkPromoValidity(promoCode);
    if (!check.valid) return 0;

    const promo = check.promo;
    if (promo.minOrder && subtotal < promo.minOrder) return 0;

    if (promo.isBrandSpecific) {
        let brandSubtotal = cart.reduce((total, item) => {
            if (item.brand && item.brand.toLowerCase() === promo.brand.toLowerCase()) {
                const qty = parseInt(item.quantity, 10) || 1;
                const price = parseFloat(item.price) || 0;
                return total + (price * qty);
            }
            return total;
        }, 0);
        return Math.round(brandSubtotal * promo.discountRate);
    }

    return Math.round(subtotal * promo.discountRate);
}

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("cartItemsContainer") === null) return;

    if (typeof renderCart === "function") {
        const originalRenderCart = renderCart;
        renderCart = function(...args) {
            originalRenderCart(...args);
            applyPromoLogicToCart();
        };
    }
    
    applyPromoLogicToCart();
    interceptCartPromoInput();
});

function applyPromoLogicToCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
        localStorage.removeItem("appliedPromo");
        renderActivePromoCartUI(null, 0);
        return;
    }

    const subtotal = cart.reduce((total, item) => total + ((parseFloat(item.price) || 0) * (parseInt(item.quantity, 10) || 1)), 0);
    const appliedPromo = localStorage.getItem("appliedPromo");

    let discount = 0;
    if (appliedPromo) {
        const check = checkPromoValidity(appliedPromo);
        if (check.valid) {
            const promo = check.promo;
            if (promo.minOrder && subtotal < promo.minOrder) {
                localStorage.removeItem("appliedPromo");
                alert(`Mã ${appliedPromo} đã bị hủy do tổng đơn hàng giảm xuống dưới ${promo.minOrder.toLocaleString('vi-VN')}đ`);
            } else {
                discount = calculatePromoDiscount(appliedPromo, cart, subtotal);
            }
        } else {
            localStorage.removeItem("appliedPromo");
        }
    }

    const discountEl = document.querySelector(".summary-row.discount .value");
    if (discountEl) {
        discountEl.textContent = "-" + discount.toLocaleString('vi-VN') + "đ";
    }

    const totalPriceEl = document.getElementById("totalPrice");
    if (totalPriceEl) {
        totalPriceEl.textContent = (subtotal - discount).toLocaleString('vi-VN') + "đ";
    }

    renderActivePromoCartUI(appliedPromo, discount, subtotal, cart);
}

function interceptCartPromoInput() {
    const promoBox = document.querySelector(".promo-code-box");
    if (!promoBox) return;

    const input = promoBox.querySelector("input");
    const button = promoBox.querySelector("button");

    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);

    newButton.addEventListener("click", () => {
        const code = input.value.trim().toUpperCase();
        if (!code) {
            alert("Vui lòng điền mã giảm giá của bạn!");
            return;
        }

        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const subtotal = cart.reduce((total, item) => total + ((parseFloat(item.price) || 0) * (parseInt(item.quantity, 10) || 1)), 0);

        const check = checkPromoValidity(code);
        if (!check.valid) {
            alert(check.msg);
            return;
        }

        const promo = check.promo;
        if (promo.minOrder && subtotal < promo.minOrder) {
            alert(`Mã này chỉ áp dụng cho đơn hàng từ ${promo.minOrder.toLocaleString('vi-VN')}đ trở lên!`);
            return;
        }

        localStorage.setItem("appliedPromo", code);
        input.value = "";
        alert(`Áp dụng mã ưu đãi ${promo.name} thành công!`);
        if (typeof renderCart === "function") {
            renderCart();
        } else {
            applyPromoLogicToCart();
        }
    });
}

function renderActivePromoCartUI(appliedPromo, discount, subtotal, cart) {
    let activeBox = document.getElementById("activePromoBox");

    if (!appliedPromo || discount === 0) {
        if (activeBox) activeBox.remove();
        return;
    }

    if (!activeBox) {
        activeBox = document.createElement("div");
        activeBox.id = "activePromoBox";
        activeBox.className = "active-promo-banner";
        
        const summaryCard = document.querySelector(".summary-card");
        const promoCodeBox = document.querySelector(".promo-code-box");
        if (summaryCard && promoCodeBox) {
            summaryCard.insertBefore(activeBox, promoCodeBox.nextSibling);
        }
    }

    const promo = PROMO_DATA[appliedPromo];
    activeBox.innerHTML = `
        <div class="promo-info-wrapper">
            <i class="fa-solid fa-ticket active-promo-icon"></i>
            <div class="promo-meta">
                <span class="promo-title-code">Mã: <strong>${appliedPromo}</strong></span>
                <span class="promo-desc-short">${promo.name} (Giảm ${promo.discountRate * 100}%)</span>
            </div>
        </div>
        <button type="button" class="btn-remove-promo" id="removePromoBtnCart">&times;</button>
    `;

    document.getElementById("removePromoBtnCart").addEventListener("click", () => {
        localStorage.removeItem("appliedPromo");
        if (typeof renderCart === "function") {
            renderCart();
        } else {
            applyPromoLogicToCart();
        }
    });
}