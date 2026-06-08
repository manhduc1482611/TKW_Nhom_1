// ===== KIỂM TRA ĐĂNG NHẬP HỆ THỐNG =====
const currentUser = JSON.parse(localStorage.getItem('currentUser'));

if (!currentUser) {
    window.location.href = 'Login.html';
}

// ===== HIỂN THỊ THÔNG TIN USER ĐĂNG NHẬP =====
function loadUserInfo() {
    if (!currentUser) return;

    // Ảnh đại diện Sidebar lấy chữ cái đầu
    const avatarEl = document.querySelector('#user-avatar');
    const initial = currentUser.fullname ? currentUser.fullname.charAt(0).toUpperCase() : '?';
    if (avatarEl) avatarEl.textContent = initial;

    const userNameEl = document.getElementById('user-name');
    if (userNameEl) userNameEl.textContent = currentUser.fullname || 'Chưa cập nhật';

    const userEmailEl = document.getElementById('user-email');
    if (userEmailEl) userEmailEl.textContent = currentUser.email || 'Chưa cập nhật';

    // Tiêu đề Welcome
    const welcomeTitle = document.getElementById('welcome-title');
    if (welcomeTitle) welcomeTitle.textContent = `Xin chào, ${currentUser.fullname || 'bạn'}!`;

    // Điền text vào Tab thông tin chung
    document.getElementById('display-name').textContent    = currentUser.fullname || 'Chưa cập nhật';
    document.getElementById('display-email').textContent   = currentUser.email    || 'Chưa cập nhật';
    document.getElementById('display-phone').textContent   = currentUser.phone    || 'Chưa cập nhật';
    document.getElementById('display-address').textContent = currentUser.address  || 'Chưa cập nhật';

    // Đẩy sẵn text vào form input chỉnh sửa
    document.getElementById('input-name').value    = currentUser.fullname || '';
    document.getElementById('input-email').value   = currentUser.email    || '';
    document.getElementById('input-phone').value   = currentUser.phone    || '';
    document.getElementById('input-address').value = currentUser.address  || '';
}

// ===== LẤY ĐƠN HÀNG VÀ TỰ ĐỘNG GÁN TRẠNG THÁI "ĐANG XỬ LÝ" =====
function loadUserOrders() {
    const tableBody = document.getElementById("orders-list-body");
    if (!tableBody || !currentUser) return;

    // Lấy toàn bộ danh sách đơn hàng đã được checkout.js lưu
    const allOrders = JSON.parse(localStorage.getItem("ordersList")) || [];

    // Chỉ lọc ra những đơn hàng trùng với Email của tài khoản đang đăng nhập hiện tại
    const myOrders = allOrders.filter(order => order.customer && order.customer.email === currentUser.email);

    if (myOrders.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" class="no-orders-text">Bạn chưa thực hiện đơn hàng nào!</td></tr>`;
        return;
    }

    // Sắp xếp đơn hàng mới đặt nhất lên trên cùng đầu tiên
    myOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    tableBody.innerHTML = myOrders.map(order => {
        // Chuyển đổi định dạng ISO time sang hiển thị giờ/ngày/tháng thân thiện
        const orderDate = new Date(order.createdAt).toLocaleDateString('vi-VN', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit'
        });

        // Nối chuỗi danh sách sản phẩm trong đơn hàng
        const itemsSummary = order.items.map(item => `${item.name} (x${item.quantity})`).join(", ");
        
        // Cấu hình nhãn trạng thái đơn hàng mặc định khi vừa thanh toán xong
        let statusText = order.status || "Đang xử lý";
        let statusClass = "status-processing";

        if (statusText === "Đã hoàn thành" || statusText === "Thành công") {
            statusClass = "status-completed";
        }

        if (statusText === "Đã hủy") {
            statusClass = "status-cancelled";
        }

        // Chỉ hiển thị nút hủy khi đơn hàng đang ở trạng thái "Đang xử lý"
        const canCancel = statusText === "Đang xử lý";
        const cancelBtn = canCancel
            ? `<button class="btn-cancel-order" onclick="cancelOrder('${order.id}')"><i class="fas fa-times"></i> Hủy</button>`
            : '';

        return `
            <tr>
                <td><strong>${order.id}</strong></td>
                <td>${orderDate}</td>
                <td class="product-cell-ellipsis" title="${itemsSummary}">${itemsSummary}</td>
                <td style="color: #ff4f8b; font-weight: 600;">${order.summary.totalPayment.toLocaleString('vi-VN')}đ</td>
                <td>
                    <span class="status-badge ${statusClass}">${statusText}</span>
                    ${cancelBtn}
                </td>
            </tr>
        `;
    }).join('');
}

// ===== XỬ LÝ LƯU THAY ĐỔI HỒ SƠ CÁ NHÂN =====
// ===== XỬ LÝ LƯU THAY ĐỔI HỒ SƠ CÁ NHÂN =====
function saveProfile() {
    const updatedUser = {
        fullname: document.getElementById('input-name').value.trim(),
        email:    document.getElementById('input-email').value.trim(),
        phone:    document.getElementById('input-phone').value.trim(),
        address:  document.getElementById('input-address').value.trim(),
    };

    // Kiểm tra không để trống tên
    if (!updatedUser.fullname) {
        showToast("Họ và tên không được để trống!", "warning");
        return;
    }

    // Cập nhật trong mảng danh sách người dùng tổng cục
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const idx = users.findIndex(u => u.email === currentUser.email);
    if (idx !== -1) {
        users[idx] = updatedUser;
        localStorage.setItem('users', JSON.stringify(users));
    }

    // Đồng bộ cập nhật vào phiên đang đăng nhập
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    // Cập nhật lại Object hiện tại và vẽ lại giao diện thông tin mới
    Object.assign(currentUser, updatedUser);
    loadUserInfo();
    loadUserOrders();

    // Thay thế alert thành Toast thông báo thành công
    showToast("Đã lưu thay đổi thông tin tài khoản thành công!", "success");
    
    // Chuyển về tab thông tin sau một khoảng thời gian ngắn để user kịp nhìn thông báo
    setTimeout(() => {
        switchTab('thongtin');
    }, 500);
}

// ===== XỬ LÝ HỦY ĐƠN HÀNG =====
let orderIdToCancel = null;

function cancelOrder(orderId) {
    orderIdToCancel = orderId;
    document.getElementById('cancelOrderModal').classList.add('active');
}

function closeCancelOrderModal() {
    orderIdToCancel = null;
    document.getElementById('cancelOrderModal').classList.remove('active');
}

function confirmCancelOrder() {
    if (!orderIdToCancel) return;

    let allOrders = JSON.parse(localStorage.getItem("ordersList")) || [];
    const idx = allOrders.findIndex(o => o.id === orderIdToCancel);

    if (idx !== -1) {
        allOrders[idx].status = "Đã hủy";
        localStorage.setItem("ordersList", JSON.stringify(allOrders));
    }

    closeCancelOrderModal();
    loadUserOrders();
    showToast("Đã hủy đơn hàng", "warning");
    orderIdToCancel = null;
}

const cancelOrderModal = document.getElementById('cancelOrderModal');
if (cancelOrderModal) {
    cancelOrderModal.addEventListener('click', function(e) {
        if (e.target === this) closeCancelOrderModal();
    });
}

// ===== XỬ LÝ HỘP THOẠI ĐĂNG XUẤT =====
const logoutBtn = document.querySelector('.logout');
if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
        document.getElementById('logoutModal').classList.add('active');
    });
}

function closeLogoutModal() {
    document.getElementById('logoutModal').classList.remove('active');
}

function confirmLogout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'Login.html';
}

const logoutModal = document.getElementById('logoutModal');
if (logoutModal) {
    logoutModal.addEventListener('click', function(e) {
        if (e.target === this) closeLogoutModal();
    });
}

// ===== LOGIC CHUYỂN ĐỔI TAB NỘI DUNG =====
function switchTab(tabId) {
    document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    const activeMenu = document.querySelector(`.menu-item[data-tab="${tabId}"]`);
    if (activeMenu) activeMenu.classList.add('active');

    const activeContent = document.getElementById(`tab-${tabId}`);
    if (activeContent) activeContent.classList.add('active');
}

document.querySelectorAll('.menu-item:not(.logout)').forEach(item => {
    item.addEventListener('click', function() {
        const tabId = this.getAttribute('data-tab');
        switchTab(tabId);
    });
});

// ===== KHỞI ĐỘNG KHI TẢI XONG TRANG =====
document.addEventListener("DOMContentLoaded", () => {
    loadUserInfo();
    loadUserOrders();
});

// ==========================================
// TOAST
// ==========================================
let toastTimeout = null;

function showToast(message, type = "success") {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.classList.remove("toast-warning");

    if (type === "warning") {
        toast.classList.add("toast-warning");
    }

    toast.textContent = message;
    toast.classList.add("show-toast");

    if (toastTimeout) {
        clearTimeout(toastTimeout);
    }

    toastTimeout = setTimeout(() => {
        toast.classList.remove("show-toast");
    }, 2500);
}