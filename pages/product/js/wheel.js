/* ========================================================
   LOGIC POPUP VÒNG QUAY MAKEUP - PHIÊN BẢN CHÍNH XÁC 100%
======================================================== */
document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById('wheelOverlay');
    const popup = document.getElementById('wheelPopup');
    const openBtn = document.getElementById('openWheelBtn');
    const closeBtn = document.getElementById('closeWheelBtn');
    
    const wheel = document.getElementById('makeupWheel');
    const spinBtn = document.getElementById('spinMakeupBtn');
    const resultText = document.getElementById('wheelResult');
    
    const bannerImg = document.getElementById('toneBannerImg');
    const titleText = document.getElementById('toneTitleText');
    const productsContainer = document.getElementById('wheelProductSuggestions');

    if (!overlay || !popup || !openBtn || !closeBtn || !wheel || !spinBtn || !resultText) return;

    let allProductsData = [];

    // Tự động tải file dữ liệu sản phẩm JSON
    fetch('/data/products.json') 
        .then(response => response.json())
        .then(data => {
            allProductsData = data;
        })
        .catch(err => console.error("Không thể tải file dữ liệu products.json:", err));

    // ====================================================================
    // CẤU HÌNH GÓC QUAY CHUẨN ĐÓN KIM 12 GIỜ (ĐÃ TÍNH TOÁN THEO TÂM MỖI Ô 72 ĐỘ)
    // ====================================================================
    const toneConfigs = [
        {
            name: "Tone Hồng ngọt ngào 🌸",
            keyword: "Simple",
            image: "/assets/images/products/tone-makeup/tone-hong.jpg",
            targetAngle: 324 // Ô 1 (0° - 72°): Tâm là 36° -> Góc quay = 360 - 36 = 324°
        },
        {
            name: "Tone Nâu Tây sang chảnh ✨",
            keyword: "Bioderma",
            image: "/assets/images/products/tone-makeup/tone-nautay.jpg",
            targetAngle: 252 // Ô 2 (72° - 144°): Tâm là 108° -> Góc quay = 360 - 108 = 252°
        },
        {
            name: "Tone Cam Đào tiểu thư 🍑",
            keyword: "Skin1004",
            image: "/assets/images/products/tone-makeup/tone-camdao.jpg",
            targetAngle: 180 // Ô 3 (144° - 216°): Tâm là 180° -> Góc quay = 360 - 180 = 180°
        },
        {
            name: "Tone Đỏ Đất quyến rũ 💄",
            keyword: "La Roche-Posay",
            image: "/assets/images/products/tone-makeup/tone-dodat.jpg",
            targetAngle: 108 // Ô 4 (216° - 288°): Tâm là 252° -> Góc quay = 360 - 252 = 108°
        },
        {
            name: "Tone Cam Đất thời thượng 🍊",
            keyword: "Cocoon",
            image: "/assets/images/products/tone-makeup/tone-camdat.jpg",
            targetAngle: 36  // Ô 5 (288° - 360°): Tâm là 324° -> Góc quay = 360 - 324 = 36°
        }
    ];

    // Cài đặt sai số đồ họa nếu cần nhích nhẹ tâm (Hiện tại 0 là chuẩn đét)
    const VISUAL_OFFSET = 0; 

    // Sự kiện mở / đóng Popup
    openBtn.addEventListener('click', () => {
        overlay.classList.add('show');
    });

    const closePopup = () => {
        if (isCurrentlySpinning) return; 
        overlay.classList.remove('show');
        setTimeout(() => {
            popup.classList.remove('expanded');
            resultText.innerHTML = "";
        }, 300);
    };

    closeBtn.addEventListener('click', closePopup);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closePopup(); });

    let spinCount = 0;
    let isCurrentlySpinning = false;

    spinBtn.addEventListener('click', () => {
        if (isCurrentlySpinning) return;
        
        isCurrentlySpinning = true;
        spinBtn.disabled = true;
        popup.classList.remove('expanded'); 
        resultText.innerHTML = "Đang tìm chân ái phong cách...";

        // Chọn ngẫu nhiên index phần thưởng (0 đến 4)
        const chosenPrizeIndex = Math.floor(Math.random() * toneConfigs.length);
        const selectedTone = toneConfigs[chosenPrizeIndex];

        // Tăng lượt quay để tính góc lũy tiến (luôn quay tiến lên)
        spinCount++; 
        
        // Vòng quay chạy tối thiểu 8 vòng chẵn (8 * 360 = 2880 độ) + góc đích
        const baseRotation = spinCount * 2880; 
        const finalDegrees = baseRotation + selectedTone.targetAngle + VISUAL_OFFSET;

        // Thực thi hiệu ứng quay
        wheel.style.transform = `rotate(${finalDegrees}deg)`;

        // Đợi 4 giây kết thúc hành trình quay
        setTimeout(() => {
            isCurrentlySpinning = false;
            spinBtn.disabled = false;

            // 1. Hiển thị thông báo kết quả ngắn gọn tại vòng quay
            resultText.innerHTML = `Gợi ý:<br><span style="color: #ff4f8b; font-size: 15px; font-weight: 700;">${selectedTone.name}</span>`;

            // 2. Cập nhật Banner hình ảnh & Tiêu đề vùng gợi ý bên phải
            if (bannerImg) bannerImg.src = selectedTone.image;
            if (titleText) titleText.innerText = selectedTone.name;

            // Kiểm tra an toàn dữ liệu sản phẩm
            if (!allProductsData || allProductsData.length === 0) {
                if (productsContainer) {
                    productsContainer.innerHTML = "<p style='padding:15px; color:#666;'>Đang tải dữ liệu sản phẩm, vui lòng thử lại...</p>";
                }
                popup.classList.add('expanded');
                return;
            }

            // 3. Lọc sản phẩm theo keyword cài đặt
            let filteredProducts = allProductsData.filter(p => {
                const nameMatch = p.name ? p.name.toLowerCase().includes(selectedTone.keyword.toLowerCase()) : false;
                const brandMatch = p.brand ? p.brand.toLowerCase().includes(selectedTone.keyword.toLowerCase()) : false;
                const charMatch = p.characteristics ? p.characteristics.toLowerCase().includes(selectedTone.keyword.toLowerCase()) : false;
                return nameMatch || brandMatch || charMatch;
            });

            // Đảm bảo luôn hiển thị đủ và ngẫu nhiên 5 sản phẩm
            if (filteredProducts.length < 5) {
                const remaining = allProductsData.filter(p => !filteredProducts.includes(p));
                filteredProducts = filteredProducts.concat(remaining.slice(0, 5 - filteredProducts.length));
            } else {
                filteredProducts = filteredProducts.sort(() => 0.5 - Math.random()).slice(0, 5);
            }

            // 4. Render danh sách sản phẩm ra giao diện HTML công thức chuẩn
            if (productsContainer) {
                productsContainer.innerHTML = filteredProducts.map(prod => `
                    <a href="product-detail.html?id=${prod.id}" class="wheel-prod-card">
                        <img src="${prod.images && prod.images[0] ? prod.images[0] : '../../../assets/images/default.jpg'}" alt="${prod.name || 'Sản phẩm'}">
                        <div class="wheel-prod-details">
                            <h6>${prod.name || 'Sản phẩm gợi ý'}</h6>
                            <span class="wheel-prod-price">${prod.salePrice ? prod.salePrice.toLocaleString('vi-VN') : '0'} đ</span>
                        </div>
                    </a>
                `).join('');
            }

            // 5. Mở rộng giao diện hiển thị danh sách sản phẩm gợi ý
            popup.classList.add('expanded');

        }, 4000); 
    });
});