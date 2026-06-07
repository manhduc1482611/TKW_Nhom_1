document.addEventListener("DOMContentLoaded", function() {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentDate = now.getDate();
    const currentHour = now.getHours();
    const boxes = document.querySelectorAll('.promo-box');

    boxes.forEach(function(box) {
        const type = box.getAttribute('data-type');
        let isActive = false;
        let statusText = "";
        let statusClass = "";

        // Kiểm tra loại điều kiện thời gian của từng Voucher
        if (type === 'always') {
            isActive = true;
        } else if (type === 'monthly') {
            const startDay = parseInt(box.getAttribute('data-start-day'));
            const endDay = parseInt(box.getAttribute('data-end-day'));
            if (currentDate >= startDay && currentDate <= endDay) {
                isActive = true;
            } else if (currentDate < startDay) {
                statusText = "Sắp diễn ra";
                statusClass = "upcoming";
            } else {
                statusText = "Đã kết thúc";
                statusClass = "ended";
            }
        } else if (type === 'yearly') {
            const targetMonth = parseInt(box.getAttribute('data-month'));
            const targetDate = parseInt(box.getAttribute('data-date'));
            if (currentMonth === targetMonth && currentDate === targetDate) {
                isActive = true;
            } else if (currentMonth < targetMonth || (currentMonth === targetMonth && currentDate < targetDate)) {
                statusText = "Sắp diễn ra";
                statusClass = "upcoming";
            } else {
                statusText = "Đã kết thúc";
                statusClass = "ended";
            }
        } else if (type === 'daily') {
            const startHour = parseInt(box.getAttribute('data-start-hour'));
            const endHour = parseInt(box.getAttribute('data-end-hour'));
            if (currentHour >= startHour && currentHour <= endHour) {
                isActive = true;
            } else if (currentHour < startHour) {
                statusText = "Mở lúc " + startHour + ":00";
                statusClass = "upcoming";
            } else {
                statusText = "Hết giờ hôm nay";
                statusClass = "ended";
            }
        } else if (type === 'yearly-monthly') {
            const targetMonth = parseInt(box.getAttribute('data-month'));
            const startDay = parseInt(box.getAttribute('data-start-day'));
            const endDay = parseInt(box.getAttribute('data-end-day'));
            
            if (currentMonth === targetMonth && currentDate >= startDay && currentDate <= endDay) {
                isActive = true;
            } else if (currentMonth < targetMonth || (currentMonth === targetMonth && currentDate < startDay)) {
                statusText = "Sắp diễn ra";
                statusClass = "upcoming";
            } else {
                statusText = "Đã kết thúc";
                statusClass = "ended";
            }
        }

        // Cập nhật giao diện Trạng thái / Nút bấm tương ứng
        const statusElement = box.querySelector('.promo-status');
        const buttonElement = box.querySelector('.btn-copy');

        if (isActive) {
            if (statusElement) {
                statusElement.textContent = "Đang diễn ra";
                statusElement.classList.add("st-active");
            }
        } else {
            if (statusElement) {
                statusElement.textContent = statusText;
                statusElement.classList.add("st-" + statusClass);
            }
            box.classList.add("disabled-box");
            
            // Khóa nút copy nếu chưa đến thời gian hoặc hết hạn
            if (buttonElement) {
                buttonElement.disabled = true;
                buttonElement.textContent = (statusClass === "upcoming") ? "Chưa mở" : "Hết hạn";
                buttonElement.style.background = "#ccc";
                buttonElement.style.cursor = "not-allowed";
            }
            
            // Xử lý text hiển thị mã tự động áp dụng
            const autoTextElement = box.querySelector('.box-action.auto .code-text');
            const autoIcon = box.querySelector('.box-action.auto i');
            if (autoTextElement) {
                autoTextElement.textContent = (statusClass === "upcoming") ? "Chưa đến thời gian" : "Đã hết hạn";
                if (autoIcon) autoIcon.className = "fas fa-lock";
            }
        }

        // Bắt sự kiện click vào hộp khuyến mãi để chuyển sang trang detail
        box.addEventListener('click', function(e) {
            if (e.target.classList.contains('btn-copy') || e.target.closest('.btn-copy')) {
                return; 
            }
            const promoId = box.getAttribute('id');
            if (promoId) {
                window.location.href = `./promotion-detail.html?id=${promoId}`;
            }
        });
    });

    // ==========================================
    // 2. XỬ LÝ MODAL THÔNG BÁO
    // ==========================================
    const modal = document.getElementById("myModal");
    const btn = document.getElementById("myBtn");
    const span = document.getElementsByClassName("close")[0];

    if (btn && modal) {
        btn.onclick = function() {
            modal.style.display = "block";
        }
    }

    if (span && modal) {
        span.onclick = function() {
            modal.style.display = "none";
        }
    }

    window.onclick = function(event) {
        if (modal && event.target == modal) {
            modal.style.display = "none";
        }
    }
});

// ==========================================
// 3. HÀM COPY MÃ TOÀN CỤC
// ==========================================
function copyCode(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const codeText = element.innerText;
    navigator.clipboard.writeText(codeText).then(() => {
        showToast("Đã copy mã khuyến mãi!");
    }).catch(err => {
        console.error('Lỗi khi sao chép mã: ', err);
    });
}


// ==========================================
// 4. TOAST
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