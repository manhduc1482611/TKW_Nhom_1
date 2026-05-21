function doiMatkhau(event) {
    event.preventDefault();

    const email = document.getElementById('resetEmail').value.trim();
    const matkhauMoi = document.getElementById('matkhauMoi').value;
    const xacNhan = document.getElementById('xacNhanMatkhau').value;

    // Kiểm tra email có trong hệ thống không
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const index = users.findIndex(u => u.email === email);
    if (index === -1) {
        hienThongBao('Email này chưa được đăng ký!', 'error');
        return;
    }

    // Kiểm tra mật khẩu mới
    if (matkhauMoi.length < 8) {
        hienThongBao('Mật khẩu phải có ít nhất 8 ký tự!', 'error');
        return;
    }

    if (!/[A-Z]/.test(matkhauMoi)) {
        hienThongBao('Mật khẩu phải có ít nhất 1 chữ hoa!', 'error');
        return;
    }

    // Kiểm tra xác nhận mật khẩu có khớp không
    if (matkhauMoi !== xacNhan) {
        hienThongBao('Mật khẩu xác nhận không khớp!', 'error');
        return;
    }

    // Lưu mật khẩu mới
    users[index].password = matkhauMoi;
    localStorage.setItem('users', JSON.stringify(users));

    // Hiện thông báo xanh thành công rồi chuyển trang
    hienThongBao('Đổi mật khẩu thành công! Đang chuyển về đăng nhập...', 'success');

    setTimeout(function() {
        window.location.href = 'Login.html';
    }, 2000);
}

function hienThongBao(text, type) {
    const box = document.getElementById('messageBox');
    box.textContent = text;
    box.className = 'message ' + type;
    box.style.display = 'block';
    if (type === 'error') {
        setTimeout(function() {
            box.style.display = 'none';
        }, 3000);
    }
}