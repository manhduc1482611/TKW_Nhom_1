document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-content h1');
    if (heroTitle) {
        setTimeout(() => {
            heroTitle.classList.add('appear');
        }, 200);
    }
    
    // 1. HIỆU ỨNG HIỆN DẦN KHI CUỘN TRANG (SCROLL REVEAL)
    // Giúp các phần tử như category-card, about-text hiện lên mượt mà khi cuộn đến
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target); // Chỉ chạy hiệu ứng một lần
            }
        });
    }, observerOptions);

    // Áp dụng cho các phần tử cần hiệu ứng
    const revealElements = document.querySelectorAll('.category-card, .commitment-card, .about-text, .about-images');
    
    revealElements.forEach(el => {
        // Thiết lập trạng thái ban đầu qua JS để đảm bảo nếu tắt JS web vẫn xem được
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s ease-out';
        revealObserver.observe(el);
    });

    // 2. HIỆU ỨNG PARALLAX NHẸ CHO HERO SECTION
    // Tạo cảm giác chiều sâu cho hình nền khi cuộn
    window.addEventListener('scroll', () => {
        const hero = document.querySelector('.hero');
        const scrollValue = window.scrollY;
        if (hero) {
            hero.style.backgroundPositionY = `${scrollValue * 0.5}px`;
        }
    });

    // 3. TƯƠNG TÁC THÊM CHO CÁC NÚT (RIPPLE EFFECT)
    // Tạo hiệu ứng phản hồi khi nhấn vào các nút Contact/Order
    const buttons = document.querySelectorAll('.btn-contact, .btn-order, .btn-xemthem');

    buttons.forEach(btn => {
        btn.addEventListener('mousedown', function(e) {
            this.style.transform = 'scale(0.95)';
        });
        
        btn.addEventListener('mouseup', function(e) {
            this.style.transform = 'scale(1)';
        });

        btn.addEventListener('mouseleave', function(e) {
            this.style.transform = 'scale(1)';
        });
    });

    // 4. HIỆU ỨNG HOẠT ẢNH CHO ẢNH TRONG PHẦN ABOUT
    // Thay đổi độ nghiêng của ảnh khi người dùng cuộn qua
    const aboutImages = document.querySelector('.about-images');
    if (aboutImages) {
        window.addEventListener('scroll', () => {
            const rect = aboutImages.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const img1 = aboutImages.querySelector('.img1');
                const img2 = aboutImages.querySelector('.img2');
                const shift = window.scrollY * 0.02;

                img1.style.transform = `rotate(${-12 + shift}deg)`;
                img2.style.transform = `rotate(${10 - shift}deg)`;
            }
        });
    }

    // 5. THÔNG BÁO KHI NHẤN "XEM THÊM" (GIẢ LẬP)
    // Log để kiểm tra các liên kết hoạt động tốt
    const links = document.querySelectorAll('.btn-xemthem');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const productName = e.target.closest('.category-card').querySelector('h3').innerText;
            console.log(`Đang chuyển hướng đến danh mục: ${productName}`);
        });
    });
});