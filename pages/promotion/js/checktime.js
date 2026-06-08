// ==========================================
// HÀM KIỂM TRA THỜI GIAN DÙNG CHUNG CHO CÁC PROMO
// ==========================================
function checkPromoCondition(type, dataObj) {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentDate = now.getDate();
    const currentHour = now.getHours();

    let isActive = false;
    let statusText = "";
    let statusClass = "";

    if (type === 'always') {
        isActive = true;
    } else if (type === 'monthly') {
        if (currentDate >= dataObj.startDay && currentDate <= dataObj.endDay) {
            isActive = true;
        } else if (currentDate < dataObj.startDay) {
            statusText = "Sắp diễn ra";
            statusClass = "upcoming";
        } else {
            statusText = "Đã kết thúc";
            statusClass = "ended";
        }
    } else if (type === 'yearly') {
        if (currentMonth === dataObj.targetMonth && currentDate === dataObj.targetDate) {
            isActive = true;
        } else if (currentMonth < dataObj.targetMonth || (currentMonth === dataObj.targetMonth && currentDate < dataObj.targetDate)) {
            statusText = "Sắp diễn ra";
            statusClass = "upcoming";
        } else {
            statusText = "Đã kết thúc";
            statusClass = "ended";
        }
    } else if (type === 'daily') {
        if (currentHour >= dataObj.startHour && currentHour <= dataObj.endHour) {
            isActive = true;
        } else if (currentHour < dataObj.startHour) {
            statusText = "Mở lúc " + dataObj.startHour + ":00";
            statusClass = "upcoming";
        } else {
            statusText = "Hết giờ hôm nay";
            statusClass = "ended";
        }
    } else if (type === 'yearly-monthly') {
        if (currentMonth === dataObj.targetMonth && currentDate >= dataObj.startDay && currentDate <= dataObj.endDay) {
            isActive = true;
        } else if (currentMonth < dataObj.targetMonth || (currentMonth === dataObj.targetMonth && currentDate < dataObj.startDay)) {
            statusText = "Sắp diễn ra";
            statusClass = "upcoming";
        } else {
            statusText = "Đã kết thúc";
            statusClass = "ended";
        }
    }

    return { isActive, statusText, statusClass };
}