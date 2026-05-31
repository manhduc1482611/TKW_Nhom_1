document.addEventListener("DOMContentLoaded", function () {
    const promotionsData = [
        {
            id: "landau",
            title: "Ghé Thăm Lần Đầu",
            type: "always",
            timeText: "Không giới hạn thời gian",
            desc: "Ưu đãi đặc biệt dành riêng cho khách hàng mới lần đầu trải nghiệm mua sắm tại hệ thống website Nghien Beauty.",
            img: "../../../assets/images/Promotion/LANDAU.png",
            code: "AUTO",
            isAuto: true,
            tableDetails: [
                { criteria: "Đối tượng và điều kiện áp dụng", rules: "Khách hàng mới đăng ký tài khoản và thực hiện đơn hàng đầu tiên tại cửa hàng." },
                { criteria: "Mức giảm giá", rules: "Giảm 10% cho toàn bộ sản phẩm và miễn phí vận chuyển." },
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
            isAuto: false,
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
            isAuto: false,
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
            desc: "Nghien Beauty gửi lời chúc gửi yêu thương đến một nửa thế giới bằng chương trình ưu đãi ngập tràn cho nàng tự tin tỏa sáng.",
            img: "../../../assets/images/Promotion/QTBN8T3.png",
            code: "WOMEN83",
            isAuto: false,
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
            desc: "Đại tiệc săn deal chớp nhoáng mỗi ngày cùng Nghien Beauty với các sản phẩm giới hạn giảm sâu bất ngờ.",
            img: "../../../assets/images/Promotion/FLASHSALE.png",
            code: "FLASHSALE",
            isAuto: false,
            tableDetails: [
                { criteria: "Đối tượng và điều kiện áp dụng", rules: "Áp dụng cho đơn hàng có tổng trị giá từ 500.000đ trở lên." },
                { criteria: "Mức giảm giá", rules: "Giảm sốc trực tiếp 20% tổng hóa đơn cho các sản phẩm hợp lệ trong khung giờ vàng." },
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
                <a href="./promotion.html" style="display:inline-block; margin-top:20px; color:#white; background:#ff4f8b; padding:10px 20px; text-decoration:none; border-radius:30px; font-weight:bold;">Quay lại</a>
            </div>
        `;
        return;
    }

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentDate = now.getDate();
    const currentHour = now.getHours();

    let isActive = false;
    let statusText = "Đang tải...";
    let statusClass = "";

    const type = currentPromo.type;
    if (type === 'always') {
        isActive = true;
    } else if (type === 'yearly-monthly') {
        if (currentMonth === currentPromo.month && currentDate >= currentPromo.startDay && currentDate <= currentPromo.endDay) {
            isActive = true;
        } else if (currentMonth < currentPromo.month || (currentMonth === currentPromo.month && currentDate < currentPromo.startDay)) {
            statusText = "Sắp diễn ra"; statusClass = "upcoming";
        } else {
            statusText = "Đã kết thúc"; statusClass = "ended";
        }
    } else if (type === 'yearly') {
        if (currentMonth === currentPromo.month && currentDate === currentPromo.date) {
            isActive = true;
        } else if (currentMonth < currentPromo.month || (currentMonth === currentPromo.month && currentDate < currentPromo.date)) {
            statusText = "Sắp diễn ra"; statusClass = "upcoming";
        } else {
            statusText = "Đã kết thúc"; statusClass = "ended";
        }
    } else if (type === 'daily') {
        if (currentHour >= currentPromo.startHour && currentHour <= currentPromo.endHour) {
            isActive = true;
        } else if (currentHour < currentPromo.startHour) {
            statusText = "Mở lúc " + currentPromo.startHour + ":00"; statusClass = "upcoming";
        } else {
            statusText = "Hết giờ hôm nay"; statusClass = "ended";
        }
    }

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
    if (currentPromo.isAuto) {
        actionBox.className = "box-action auto";
        actionBox.innerHTML = `
            <i class="fa-solid ${isActive ? 'fa-circle-check' : 'fa-lock'}" style="color: ${isActive ? '#2e7d32' : '#777'}"></i>
            <span class="code-text">${isActive ? 'Hệ thống tự động áp dụng' : 'Mã chưa mở hoặc hết hạn'}</span>
        `;
    } else {
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
                    alert("Nghien Beauty: Đã copy thành công mã " + currentPromo.code + " vào khay nhớ tạm!");
                });
            });
        }
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