/* ========================================================
   LOGIC POPUP VÒNG QUAY MAKEUP NÂNG CẤP ĐỌC FILE JSON
======================================================== */
document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById('wheelOverlay');
    const popup = document.getElementById('wheelPopup');
    const openBtn = document.getElementById('openWheelBtn');
    const closeBtn = document.getElementById('closeWheelBtn');
    
    const wheel = document.getElementById('makeupWheel');
    const spinBtn = document.getElementById('spinMakeupBtn');
    const resultText = document.getElementById('wheelResult');
    
    // Các node mới phục vụ hiển thị sản phẩm
    const bannerImg = document.getElementById('toneBannerImg');
    const titleText = document.getElementById('toneTitleText');
    const productsContainer = document.getElementById('wheelProductSuggestions');

    if (!overlay || !popup || !openBtn || !closeBtn || !wheel || !spinBtn || !resultText) return;

    let allProductsData = [];

    // Tự động fetch file products.json có sẵn trong dự án của bạn
    fetch('/data/products.json') // Sửa lại đường dẫn này nếu file json của bạn nằm ở thư mục khác
        .then(response => response.json())
        .then(data => {
            allProductsData = data;
        })
        .catch(err => console.error("Không thể tải file dữ liệu products.json:", err));

    // Cấu hình dữ liệu hình ảnh người mẫu & từ khóa tìm kiếm cho 5 tone khác nhau
    const toneConfigs = [
        {
            name: "Tone Hồng ngọt ngào 🌸",
            keyword: "Sensitive", // Tìm sản phẩm êm dịu, nhạy cảm thích hợp làm nền da hồng hào
            image: "/assets/images/products/tone-makeup/tone-hong.jpg" // Thay bằng đường dẫn ảnh mẫu tone hồng của bạn
        },
        {
            name: "Tone Cam Đất thời thượng 🍊",
            keyword: "Cocoon", // Lấy các sản phẩm thuần chay, nghệ, bí đao hợp vibe tone cam ấm
            image: "/assets/images/products/tone-makeup/tone-camdat.jpg" // Thay bằng đường dẫn ảnh mẫu tone cam của bạn
        },
        {
            name: "Tone Đỏ Đất quyến rũ 💄",
            keyword: "La Roche-Posay", // Lấy dòng sản phẩm sang chảnh chuẩn Pháp quyến rũ
            image: "/assets/images/products/tone-makeup/tone-dodat.jpg" // Thay bằng đường dẫn ảnh mẫu tone đỏ của bạn
        },
        {
            name: "Tone Cam Đào tiểu thư 🍑",
            keyword: "Skin1004", // Dòng rau má dịu nhẹ tươi mát tiểu thư trong trẻo
            image: "/assets/images/products/tone-makeup/tone-camdao.jpg" // Thay bằng đường dẫn ảnh mẫu tone cam đào của bạn
        },
        {
            name: "Tone Nâu Tây sang chảnh ✨",
            keyword: "Bioderma", // Các sản phẩm sạch sâu, chuyên nghiệp cá tính kiểu Tây
            image: "/assets/images/products/tone-makeup/tone-nautay.jpg" // Thay bằng đường dẫn ảnh mẫu tone nâu tây của bạn
        }
    ];

    // Sự kiện mở / đóng Popup
    openBtn.addEventListener('click', () => {
        overlay.classList.add('show');
    });

    const closePopup = () => {
        if (isCurrentlySpinning) return; 
        overlay.classList.remove('show');
        // Thu gọn popup lại trạng thái ban đầu khi đóng
        setTimeout(() => {
            popup.classList.remove('expanded');
            resultText.innerHTML = "";
        }, 300);
    };

    closeBtn.addEventListener('click', closePopup);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closePopup(); });

    // Vòng quay chính
    let currentRotationDegree = 0;
    let isCurrentlySpinning = false;

    spinBtn.addEventListener('click', () => {
        if (isCurrentlySpinning) return;
        
        isCurrentlySpinning = true;
        spinBtn.disabled = true;
        popup.classList.remove('expanded'); // Ẩn vùng sản phẩm cũ trước khi quay mới
        resultText.innerHTML = "Đang tìm chân ái phong cách...";

        const randomBonusDegree = Math.floor(Math.random() * 360);
        const totalTargetDegrees = currentRotationDegree + 1800 + randomBonusDegree;
        
        currentRotationDegree = totalTargetDegrees;
        wheel.style.transform = `rotate(${totalTargetDegrees}deg)`;

        setTimeout(() => {
            isCurrentlySpinning = false;
            spinBtn.disabled = false;

            const normalizedDegree = totalTargetDegrees % 360;
            const chosenPrizeIndex = Math.floor(normalizedDegree / 72);
            const selectedTone = toneConfigs[chosenPrizeIndex];

            // 1. Cập nhật Text kết quả quay
            resultText.innerHTML = `Gợi ý:<br><span style="color: #ff4f8b; font-size: 15px; font-weight: 700;">${selectedTone.name}</span>`;

            // 2. Thay đổi Ảnh banner mẫu makeup & Tiêu đề vùng gợi ý đồ
            bannerImg.src = selectedTone.image;
            titleText.innerText = selectedTone.name;

            // 3. Lọc lấy đúng 5 sản phẩm khác nhau từ JSON dựa trên keyword cài đặt sẵn
            let filteredProducts = allProductsData.filter(p => 
                p.name.toLowerCase().includes(selectedTone.keyword.toLowerCase()) || 
                p.brand.toLowerCase().includes(selectedTone.keyword.toLowerCase()) ||
                p.characteristics.toLowerCase().includes(selectedTone.keyword.toLowerCase())
            );

            // Nếu dữ liệu bộ lọc ít quá, lấy đại các sản phẩm khác đắp vào cho đủ 5 món
            if (filteredProducts.length < 5) {
                const remaining = allProductsData.filter(p => !filteredProducts.includes(p));
                filteredProducts = filteredProducts.concat(remaining.slice(0, 5 - filteredProducts.length));
            } else {
                // Nếu nhiều hơn 5 món thì xốc ngẫu nhiên lấy đúng 5 món khác nhau hoàn toàn
                filteredProducts = filteredProducts.sort(() => 0.5 - Math.random()).slice(0, 5);
            }

            // 4. Render danh sách sản phẩm thành thẻ HTML
            productsContainer.innerHTML = filteredProducts.map(prod => `
                <a href="product-detail.html?id=${prod.id}" class="wheel-prod-card">
                    <img src="${prod.images && prod.images[0] ? prod.images[0] : '../../../assets/images/default.jpg'}" alt="${prod.name}">
                    <div class="wheel-prod-details">
                        <h6>${prod.name}</h6>
                        <span class="wheel-prod-price">${prod.salePrice.toLocaleString('vi-VN')} đ</span>
                    </div>
                </a>
            `).join('');

            // 5. Mở rộng khung Popup sang bên phải để trình diễn
            popup.classList.add('expanded');

        }, 4000); 
    });
});