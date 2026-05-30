const MA_OTP = '123456';

// ========== BƯỚC 1: GỬI MÃ ==========
function guiMa() {
    const email = document.getElementById('resetEmail').value.trim();
    if (!email) { hienThongBao('Vui lòng nhập email.', 'error'); return; }

    let users = JSON.parse(localStorage.getItem('users')) || [];
    if (!users.some(u => u.email === email)) {
        hienThongBao('Email này chưa được đăng ký!', 'error');
        return;
    }

    document.getElementById('step1').style.display = 'none';
    document.getElementById('step2').style.display = 'block';
}

// ========== BƯỚC 2: XÁC NHẬN MÃ OTP ==========
function xacNhanMa() {
    const maNhap = document.getElementById('otpInput').value.trim();
    if (maNhap !== MA_OTP) {
        hienThongBao('Mã không đúng. Vui lòng thử lại.', 'error');
        return;
    }
    document.getElementById('step2').style.display = 'none';
    document.getElementById('step3').style.display = 'block';
}

// ========== BƯỚC 3: ĐỔI MẬT KHẨU (code gốc) ==========
function doiMatkhau(event) {
    if (event) event.preventDefault();

    const email = document.getElementById('resetEmail').value.trim();
    const matkhauMoi = document.getElementById('matkhauMoi').value;
    const xacNhan = document.getElementById('xacNhanMatkhau').value;

    let users = JSON.parse(localStorage.getItem('users')) || [];
    const index = users.findIndex(u => u.email === email);
    if (index === -1) { hienThongBao('Email này chưa được đăng ký!', 'error'); return; }

    if (matkhauMoi.length < 8) { hienThongBao('Mật khẩu phải có ít nhất 8 ký tự!', 'error'); return; }
    if (!/[A-Z]/.test(matkhauMoi)) { hienThongBao('Mật khẩu phải có ít nhất 1 chữ hoa!', 'error'); return; }
    if (matkhauMoi !== xacNhan) { hienThongBao('Mật khẩu xác nhận không khớp!', 'error'); return; }

    users[index].password = matkhauMoi;
    localStorage.setItem('users', JSON.stringify(users));

    hienThongBao('Đổi mật khẩu thành công! Đang chuyển về đăng nhập...', 'success');
    setTimeout(function() { window.location.href = 'Login.html'; }, 2000);
}

// ========== THÔNG BÁO (code gốc) ==========
function hienThongBao(text, type) {
    const box = document.getElementById('messageBox');
    box.textContent = text;
    box.className = 'message ' + type;
    box.style.display = 'block';
    if (type === 'error') {
        setTimeout(function() { box.style.display = 'none'; }, 3000);
    }
}