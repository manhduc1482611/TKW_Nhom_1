const registerForm = document.getElementById('registerForm');

if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fullname = document.getElementById('fullname').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        // Kiểm tra tên
        if (!fullname) {
            showMessage("Vui lòng nhập họ tên!", "error");
            return;
        }

        // Kiểm tra email
        if (!email) {
            showMessage("Vui lòng nhập email!", "error");
            return;
        }
        
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            showMessage("Email không đúng định dạng (ví dụ: name@domain.com)!", "error");
            return;
        }

        // Kiểm tra mật khẩu
        if (password.length < 8) {
            showMessage("Mật khẩu phải dài ít nhất 8 ký tự!", "error");
            return;
        }

        if (!/[A-Z]/.test(password)) {
            showMessage("Mật khẩu phải có ít nhất 1 chữ cái viết hoa!", "error");
            return;
        }

        if (password !== confirmPassword) {
            showMessage("Mật khẩu xác nhận không khớp!", "error");
            return;
        }

        // Kiểm tra email đã tồn tại
        let users = JSON.parse(localStorage.getItem('users')) || [];
        if (users.find(user => user.email === email)) {
            showMessage("Email này đã được đăng ký!", "error");
            return;
        }

        // Lưu tài khoản
        users.push({ fullname, email, password });
        localStorage.setItem('users', JSON.stringify(users));

        showMessage("Đăng ký thành công! Đang chuyển sang Đăng nhập...", "success");

        setTimeout(() => {
            window.location.href = 'Login.html';
        }, 1500);
    });
}

// ===== XỬ LÝ ĐĂNG NHẬP =====
const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;

        // Kiểm tra dữ liệu nhập
        if (!email || !password) {
            showMessage("Vui lòng nhập đầy đủ email và mật khẩu!", "error");
            return;
        }

        let users = JSON.parse(localStorage.getItem('users')) || [];

        // Kiểm tra tài khoản tồn tại
        const accountExists = users.find(u => u.email === email);

        if (!accountExists) {
            showMessage("Email này chưa được đăng ký. Vui lòng đăng ký!", "error");
            return;
        }

        // Kiểm tra mật khẩu
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            // Xóa session cũ (nếu có)
            localStorage.removeItem('currentUser');
            // Lưu session mới
            localStorage.setItem('currentUser', JSON.stringify(user));
            showMessage("Đăng nhập thành công! Đang chuyển hướng...", "success");

            setTimeout(() => {
                window.location.href = 'account.html';
            }, 1000);
        } else {
            showMessage("Mật khẩu không chính xác!", "error");
        }
    });
}

// ===== HIỂN THỊ THÔNG BÁO =====
function showMessage(text, type) {
    const messageBox = document.getElementById('messageBox');
    if (messageBox) {
        messageBox.textContent = text;
        messageBox.className = `message ${type}`;
        messageBox.style.display = 'block';
        messageBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Tự động ẩn sau 3 giây (trừ thông báo thành công)
        if (type === 'error') {
            setTimeout(() => {
                messageBox.style.display = 'none';
            }, 3000);
        }
    }
}

// Đăng nhập bằng Google, facebook.
function signupWithGoogle() {
    executeSocialLogin("Google User");
}

function loginWithGoogle() {
    executeSocialLogin("Google User");
}

function signupWithFacebook() {
    executeSocialLogin("Facebook User");
}

function loginWithFacebook() {
    executeSocialLogin("Facebook User");
}

function executeSocialLogin(providerName) {
    let users = JSON.parse(localStorage.getItem('users')) || [];

    const email = providerName.toLowerCase().replace(" ", "") + "@social.com";

    let user = users.find(u => u.email === email);

    if (!user) {
        user = {
            fullname: providerName,
            email: email,
            password: "social_login",
            provider: providerName
        };

        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
    }

    localStorage.setItem('currentUser', JSON.stringify(user));

    // Hiển thị thông báo xanh
    showMessage(`Đăng nhập bằng ${providerName} thành công!`, "success");

    setTimeout(() => {
        window.location.href = 'account.html';
    }, 1000);
}