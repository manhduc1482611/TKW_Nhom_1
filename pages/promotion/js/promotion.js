document.addEventListener("DOMContentLoaded", function() {
    const boxes = document.querySelectorAll('.promo-box');

    boxes.forEach(function(box) {
        const type = box.getAttribute('data-type');
        
        // gọi dữ liệu từ hàm check chung
        const dataObj = {
            startDay: parseInt(box.getAttribute('data-start-day')),
            endDay: parseInt(box.getAttribute('data-end-day')),
            targetMonth: parseInt(box.getAttribute('data-month')),
            targetDate: parseInt(box.getAttribute('data-date')),
            startHour: parseInt(box.getAttribute('data-start-hour')),
            endHour: parseInt(box.getAttribute('data-end-hour'))
        };

        // GỌI HÀM CHECK TIME TỪ FILE CHUNG
        const { isActive, statusText, statusClass } = checkPromoCondition(type, dataObj);

        // Cập nhật giao diện Trạng thái / Nút bấm tương ứng (Giữ nguyên)
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
        }

        // click vào hộp khuyến mãi để chuyển sang trang detail
        box.addEventListener('click', function(e) {
            if (e.target.classList.contains('btn-copy') || e.target.closest('.btn-copy')) {
                return; // kiểm tra nếu click vào nút copy thì không chuyển trang
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

    window.addEventListener('click', function(event) {
        if (modal && event.target == modal) {
            modal.style.display = "none";
        }
    });
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
// 4. TOAST (Giữ nguyên)
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