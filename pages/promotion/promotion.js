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
        }

        const statusElement = box.querySelector('.promo-status');
        const buttonElement = box.querySelector('.btn-copy');

        if (isActive) {
            statusElement.textContent = "Đang diễn ra";
            statusElement.classList.add("st-active");
        } else {
            statusElement.textContent = statusText;
            statusElement.classList.add("st-" + statusClass);
            box.classList.add("disabled-box");
            if (buttonElement) {
                buttonElement.disabled = true;
                buttonElement.textContent = "Chưa mở";
                buttonElement.style.background = "#ccc";
                buttonElement.style.cursor = "not-allowed";
            }
            const autoTextElement = box.querySelector('.box-action.auto .code-text');
            const autoIcon = box.querySelector('.box-action.auto i');
            if (autoTextElement) {
                autoTextElement.textContent = (statusClass === "upcoming") ? "Chưa đến thời gian" : "Đã hết hạn";
                if (autoIcon) autoIcon.className = "fas fa-lock";
            }
        }
    });

    var modal = document.getElementById("myModal");

    // Get the button that opens the modal
    var btn = document.getElementById("myBtn");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on the button, open the modal
    btn.onclick = function() {
    modal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
    modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
    }

// Hàm copy mã (giữ nguyên)
function copyCode(elementId) {
    const codeText = document.getElementById(elementId).innerText;
    navigator.clipboard.writeText(codeText).then(() => alert("Đã copy thành công mã: " + codeText));
}
});