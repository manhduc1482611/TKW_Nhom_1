// ===== KIỂM TRA ĐĂNG NHẬP =====
const currentUser = JSON.parse(localStorage.getItem('currentUser'));

if (!currentUser) {
    window.location.href = 'Login.html';
}

// ===== HIỂN THỊ THÔNG TIN USER =====
function loadUserInfo() {
    if (!currentUser) return;

    // Sidebar
    const avatarEl = document.querySelector('#user-avatar');
    const initial = currentUser.fullname ? currentUser.fullname.charAt(0).toUpperCase() : '?';
    if (avatarEl) avatarEl.textContent = initial;

    const userNameEl = document.getElementById('user-name');
    if (userNameEl) userNameEl.textContent = currentUser.fullname || 'Chưa cập nhật';

    const userEmailEl = document.getElementById('user-email');
    if (userEmailEl) userEmailEl.textContent = currentUser.email || 'Chưa cập nhật';

    // Header welcome
    const welcomeTitle = document.getElementById('welcome-title');
    if (welcomeTitle) welcomeTitle.textContent = `Xin chào, ${currentUser.fullname || 'bạn'}!`;

    // Tab thông tin chung
    document.getElementById('display-name').textContent    = currentUser.fullname || 'Chưa cập nhật';
    document.getElementById('display-email').textContent   = currentUser.email    || 'Chưa cập nhật';
    document.getElementById('display-phone').textContent   = currentUser.phone    || 'Chưa cập nhật';
    document.getElementById('display-address').textContent = currentUser.address  || 'Chưa cập nhật';

    // Pre-fill form chỉnh sửa
    document.getElementById('input-name').value    = currentUser.fullname || '';
    document.getElementById('input-email').value   = currentUser.email    || '';
    document.getElementById('input-phone').value   = currentUser.phone    || '';
    document.getElementById('input-address').value = currentUser.address  || '';
}

// ===== CHUYỂN TAB =====
function switchTab(tabName) {
    document.querySelectorAll('.tab-page').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active'));

    const targetTab = document.getElementById('tab-' + tabName);
    if (targetTab) targetTab.classList.add('active');

    const targetMenu = document.querySelector(`.menu-item[data-tab="${tabName}"]`);
    if (targetMenu) targetMenu.classList.add('active');
}

// ===== LƯU HỒ SƠ =====
function saveProfile() {
    const updatedUser = {
        ...currentUser,
        fullname: document.getElementById('input-name').value.trim(),
        email:    document.getElementById('input-email').value.trim(),
        phone:    document.getElementById('input-phone').value.trim(),
        address:  document.getElementById('input-address').value.trim(),
    };

    // Cập nhật trong mảng users
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const idx = users.findIndex(u => u.email === currentUser.email);
    if (idx !== -1) {
        users[idx] = updatedUser;
        localStorage.setItem('users', JSON.stringify(users));
    }

    // Cập nhật currentUser
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    // Reload lại thông tin hiển thị
    Object.assign(currentUser, updatedUser);
    loadUserInfo();

    alert("Lưu thay đổi thành công!");
    switchTab('thongtin');
}

// ===== ĐĂNG XUẤT =====
document.querySelector('.logout').addEventListener('click', function() {
    document.getElementById('logoutModal').classList.add('active');
});

function closeLogoutModal() {
    document.getElementById('logoutModal').classList.remove('active');
}

function confirmLogout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'Login.html';
}

// Đóng modal khi click ra ngoài
document.getElementById('logoutModal').addEventListener('click', function(e) {
    if (e.target === this) closeLogoutModal();
});

// ===== GẮN SỰ KIỆN MENU =====
document.querySelectorAll('.menu-item[data-tab]').forEach(item => {
    item.addEventListener('click', function() {
        switchTab(this.dataset.tab);
    });
});

// ===== KHỞI CHẠY =====
loadUserInfo();