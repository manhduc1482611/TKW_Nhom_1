//const IS_TESTING = true; 
//if (IS_TESTING) return { valid: true, promo };
const PROMO_DATA = {
    "LANDAU": { type: 'always', discountRate: 0.10, name: "Ghé Thăm Lần Đầu" },
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
            return { valid: false, msg: `Mã chỉ có hiệu lực trong khung giờ từ ${promo.startHour}:00 đến ${promo.endHour}:59 hàng daily!` };
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
    if (document.getElementById("checkoutItemsContainer") === null) return;

    if (typeof renderCheckoutSummary === "function") {
        const originalRenderCheckoutSummary = renderCheckoutSummary;
        renderCheckoutSummary = function(...args) {
            originalRenderCheckoutSummary(...args);
            applyPromoLogicToCheckout();
        };
    }

    applyPromoLogicToCheckout();
    interceptCheckoutPromoInput();
});

function applyPromoLogicToCheckout() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) return;

    const subtotal = cart.reduce((total, item) => total + ((parseFloat(item.price) || 0) * (parseInt(item.quantity, 10) || 1)), 0);
    const appliedPromo = localStorage.getItem("appliedPromo");
    const SHIPPING_FEE = 20000;

    let discount = 0;
    let promoName = "";

    if (appliedPromo) {
        const check = checkPromoValidity(appliedPromo);
        if (check.valid) {
            discount = calculatePromoDiscount(appliedPromo, cart, subtotal);
            promoName = check.promo.name;
        } else {
            localStorage.removeItem("appliedPromo");
        }
    }

    const discountWrapper = document.getElementById("discountWrapper");
    const promoNameDisplay = document.getElementById("promoNameDisplay");
    const checkoutDiscount = document.getElementById("checkoutDiscount");

    if (discount > 0) {
        if (discountWrapper) discountWrapper.style.display = "flex";
        if (promoNameDisplay) promoNameDisplay.textContent = promoName;
        if (checkoutDiscount) checkoutDiscount.textContent = "-" + discount.toLocaleString('vi-VN') + "đ";
    } else {
        if (discountWrapper) discountWrapper.style.display = "none";
    }

    const checkoutTotalPay = document.getElementById("checkoutTotalPay");
    if (checkoutTotalPay) {
        checkoutTotalPay.textContent = (subtotal + SHIPPING_FEE - discount).toLocaleString('vi-VN') + "đ";
    }

    renderActivePromoCheckoutUI(appliedPromo, discount, subtotal, cart);
}

function interceptCheckoutPromoInput() {
    const btnApplyPromo = document.getElementById("btnApplyPromo");
    const promoInput = document.getElementById("promoInput");
    if (!btnApplyPromo || !promoInput) return;

    const newBtnApplyPromo = btnApplyPromo.cloneNode(true);
    btnApplyPromo.parentNode.replaceChild(newBtnApplyPromo, btnApplyPromo);

    newBtnApplyPromo.addEventListener("click", () => {
        const code = promoInput.value.trim().toUpperCase();
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
        promoInput.value = "";
        alert(`Áp dụng mã ưu đãi ${promo.name} thành công!`);
        
        if (typeof renderCheckoutSummary === "function") {
            const SHIPPING_FEE = 20000;
            let currentDiscount = calculatePromoDiscount(code, cart, subtotal);
            renderCheckoutSummary(cart, SHIPPING_FEE, currentDiscount, promo.name);
        } else {
            applyPromoLogicToCheckout();
        }
    });
}

function renderActivePromoCheckoutUI(appliedPromo, discount, subtotal, cart) {
    let activeBox = document.getElementById("activePromoBoxCheckout");

    if (!appliedPromo || discount === 0) {
        if (activeBox) activeBox.remove();
        return;
    }

    if (!activeBox) {
        activeBox = document.createElement("div");
        activeBox.id = "activePromoBoxCheckout";
        activeBox.className = "active-promo-banner";

        const summarySection = document.querySelector(".summary-section");
        const promoBox = document.querySelector(".promo-box");
        if (summarySection && promoBox) {
            summarySection.insertBefore(activeBox, promoBox.nextSibling);
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
        <button type="button" class="btn-remove-promo" id="removePromoBtnCheckout">&times;</button>
    `;

    document.getElementById("removePromoBtnCheckout").addEventListener("click", () => {
        localStorage.removeItem("appliedPromo");
        if (typeof renderCheckoutSummary === "function") {
            renderCheckoutSummary(cart, 20000, 0, "");
        } else {
            applyPromoLogicToCheckout();
        }
    });
}