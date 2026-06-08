document.addEventListener("DOMContentLoaded", function () {
    // Đã đổi Nghien Beauty -> Nghien Skincare trong data gốc theo yêu cầu
    const promotionsData = [
        {
            id: "landau",
            title: "Ghé Thăm Lần Đầu",
            type: "always",
            timeText: "Không giới hạn thời gian",
            desc: "Ưu đãi đặc biệt dành riêng cho khách hàng mới lần đầu trải nghiệm mua sắm tại hệ thống website Nghien Skincare.",
            img: "../../../assets/images/Promotion/LANDAU.png",
            code: "LANDAU", 
            tableDetails: [
                { criteria: "Đối tượng và điều kiện áp dụng", rules: "Khách hàng mới đăng ký tài khoản và thực hiện đơn hàng đầu tiên tại cửa hàng." },
                { criteria: "Mức giảm giá", rules: "Giảm 10% cho toàn bộ sản phẩm." },
                { criteria: "Sản phẩm áp dụng", rules: "Toàn bộ danh mục mỹ phẩm, Skincare, Makeup đang bán tại website." },
            ]
        },
        {
            id: "laroche",
            title: "Tuần Lễ Thương Hiệu La Roche-Posay",
            type: "yearly-monthly",
            month: 6, startDay: 1, endDay: 30,
            timeText: "Từ mùng 1 đến hết 30 tháng 6 hàng năm",
            desc: "Cơ hội vàng để sở hữu các sản phẩm dược mỹ phẩm chăm sóc da mụn, da nhạy cảm hàng đầu từ thương hiệu La Roche-Posay.",
            img: "../../../assets/images/Promotion/TuanLeLaRoche.png",
            code: "LAROCHE",
            tableDetails: [
                { criteria: "Đối tượng và điều kiện áp dụng", rules: "Khách hàng mua các sản phẩm thuộc thương hiệu dược mỹ phẩm La Roche-Posay" },
                { criteria: "Giá trị đơn hàng tối thiểu", rules: "Không quy định mức tối thiểu, giảm toàn bộ đơn hàng có sản phẩm La Roche-Posay." },
                { criteria: "Mức giảm giá", rules: "Giảm ngay 5% giá trị cho toàn bộ các sản phẩm La Roche-Posay có mặt trong giỏ hàng." },
            ]
        },
        {
            id: "valentine",
            title: "Ngọt Ngào Lễ Tình Nhân Valentine 14/2",
            type: "yearly",
            month: 2, date: 14,
            timeText: "Duy nhất ngày 14 tháng 2 hàng năm",
            desc: "Món quà ngọt ngào tri ân ngày lễ tình nhân, đồng hành cùng bạn trên hành trình yêu thương và chăm sóc bản thân khỏe đẹp.",
            img: "../../../assets/images/Promotion/VALENTINE.png",
            code: "VALENTINE20",
            tableDetails: [
                { criteria: "Đối tượng và điều kiện áp dụng", rules: "Áp dụng cho đơn hàng có tổng trị giá từ 300.000đ trở lên." },
                { criteria: "Mức giảm giá", rules: "Giảm giá 20% trực tiếp vào hóa đơn." },
                { criteria: "Cơ chế làm mới", rules: "Danh sách sản phẩm giảm giá sẽ được thay đổi ngẫu nhiên vào lúc 00:00 mỗi ngày." },
            ]
        },
        {
            id: "women83",
            title: "Tôn Vinh Phái Đẹp - Quốc Tế Phụ Nữ 8/3",
            type: "yearly",
            month: 3, date: 8,
            timeText: "Duy nhất ngày 8 tháng 3 hàng năm",
            desc: "Nghien Skincare gửi lời chúc gửi yêu thương đến một nửa thế giới bằng chương trình ưu đãi ngập tràn cho nàng tự tin tỏa sáng.",
            img: "../../../assets/images/Promotion/QTBN8T3.png",
            code: "WOMEN83",
            tableDetails: [
                { criteria: "Đối tượng và điều kiện áp dụng", rules: "Áp dụng đối với tất cả đơn hàng có giá trị từ 200.000đ trở lên." },
                { criteria: "Mức giảm giá", rules: "Giảm ngay 15% vào tổng giá trị đơn hàng." },
                { criteria: "Quà tặng đi kèm", rules: "Tặng kèm 1 bộ cọ trang điểm mini hoặc 1 gương bỏ túi xinh xắn cho mọi đơn hàng." },
            ]
        },
        {
            id: "flash",
            title: "Flash Sale Giờ Vàng Mỗi Ngày",
            type: "daily",
            startHour: 0, endHour: 23,
            timeText: "Khung giờ 00:00 - 23:59 hàng ngày",
            desc: "Đại tiệc săn deal chớp nhoáng mỗi ngày cùng Nghien Skincare với các sản phẩm giới hạn giảm sâu bất ngờ.",
            img: "../../../assets/images/Promotion/FLASHSALE.png",
            code: "FLASHSALE",
            tableDetails: [
                { criteria: "Đối tượng và điều kiện áp dụng", rules: "Áp dụng cho đơn hàng có tổng trị giá từ 500.000đ trở lên." },
                { criteria: "Mức giảm giá", rules: "Giảm sốc trực tiếp 30% tổng hóa đơn cho các sản phẩm hợp lệ trong khung giờ vàng." },
                { criteria: "Quà tặng đi kèm", rules: "Mỗi khách hàng chỉ được mua tối đa 2 sản phẩm cùng loại trong một phiên Flash Sale." }
            ]
        }
    ];

    const params = new URLSearchParams(window.location.search);
    let promoId = params.get("id");

    if (!promoId) promoId = "landau";

    const currentPromo = promotionsData.find(p => p.id === promoId);

    if (!currentPromo) {
        document.getElementById("promoDetailContainer").innerHTML = `
            <div style="text-align:center; padding: 80px 20px; font-family: Montserrat;">
                <i class="fa-solid fa-triangle-exclamation" style="font-size: 48px; color: #ff4f8b; margin-bottom:20px;"></i>
                <h2>Không tìm thấy chương trình khuyến mãi yêu cầu!</h2>
                <p style="color:#777; margin-top:10px;">Vui lòng quay lại danh sách trang khuyến mãi để chọn lại.</p>
                <a href="./promotion.html" style="display:inline-block; margin-top:20px; color:white; background:#ff4f8b; padding:10px 20px; text-decoration:none; border-radius:30px; font-weight:bold;">Quay lại</a>
            </div>
        `;
        return;
    }

    // Gán dữ liệu từ bài viết hiện tại sang chuẩn đối tượng để gửi đi kiểm tra
    const dataObj = {
        startDay: currentPromo.startDay,
        endDay: currentPromo.endDay,
        targetMonth: currentPromo.month,
        targetDate: currentPromo.date,
        startHour: currentPromo.startHour,
        endHour: currentPromo.endHour
    };

    const { isActive, statusText, statusClass } = checkPromoCondition(currentPromo.type, dataObj); // GỌI HÀM CHECK TIME TỪ FILE CHUNG

    document.getElementById("breadcrumbTitle").textContent = currentPromo.title;
    document.getElementById("promoTitle").textContent = currentPromo.title;
    document.getElementById("promoDesc").textContent = currentPromo.desc;
    document.getElementById("promoTimeText").textContent = currentPromo.timeText;
    document.getElementById("promoImg").src = currentPromo.img;

    const badge = document.getElementById("promoStatusBadge");
    if (isActive) {
        badge.textContent = "Đang diễn ra";
        badge.className = "article-category st-active";
    } else {
        badge.textContent = statusText;
        badge.className = `article-category st-${statusClass}`;
        document.getElementById("promoDetailContainer").classList.add("disabled-page");
    }

    const actionBox = document.getElementById("promoActionBox");
    actionBox.className = "box-action";
    actionBox.innerHTML = `
        <strong class="code-text" id="targetCodeText">${currentPromo.code}</strong>
        <button class="btn-copy" id="btnCopyCode">Copy mã</button>
    `;

    const btnCopy = document.getElementById("btnCopyCode");
    if (!isActive) {
        btnCopy.disabled = true;
        btnCopy.textContent = (statusClass === "upcoming") ? "Chưa mở" : "Hết hạn";
        btnCopy.style.background = "#ccc";
        btnCopy.style.cursor = "not-allowed";
        btnCopy.style.boxShadow = "none";
    } else {
        btnCopy.addEventListener("click", function () {
            navigator.clipboard.writeText(currentPromo.code).then(() => {
                showToast("Đã copy mã khuyến mãi!");
            });
        });
    }

    const tableBody = document.getElementById("promoTableBody");
    tableBody.innerHTML = "";
    currentPromo.tableDetails.forEach(item => {
        tableBody.innerHTML += `
            <tr>
                <td><strong>${item.criteria}</strong></td>
                <td>${item.rules}</td>
            </tr>
        `;
    });

    const relatedContainer = document.getElementById("relatedPromos");
    relatedContainer.innerHTML = "";
    const otherPromos = promotionsData.filter(p => p.id !== promoId);

    otherPromos.forEach(p => {
        relatedContainer.innerHTML += `
            <a href="./promotion-detail.html?id=${p.id}" class="related-card">
                <img src="${p.img}" alt="${p.title}">
                <div class="related-info">
                    <p class="related-category">MÃ: ${p.code}</p>
                    <h3>${p.title}</h3>
                    <p class="related-date">${p.timeText}</p>
                </div>
            </a>
        `;
    });
});

// ==========================================
// TOAST (Giữ nguyên)
// ==========================================
let toastTimeout = null;
function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show-toast");

    if (toastTimeout) {
        clearTimeout(toastTimeout);
    }

    toastTimeout = setTimeout(() => {
        toast.classList.remove("show-toast");
    }, 2500);
}