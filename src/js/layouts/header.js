document.addEventListener("DOMContentLoaded", function () {
    // 1. Lưu danh sách 5 mục vào mảng (Array) trong JS
    const productCategories = [
        { name: "Chăm sóc da", link: "../pages/product/html/skincare.html" },
        { name: "Trang điểm", link: "../pages/product/html/makeup.html" },
        { name: "Chăm sóc tóc", link: "../pages/product/html/haircare.html" },
        { name: "Nước hoa", link: "../pages/product/html/perfume.html" },
        { name: "Phụ kiện làm đẹp", link: "../pages/product/html/accessories.html" }
    ];

    // 2. Tìm thẻ li "Sản phẩm" theo ID đã đặt ở HTML
    const productMenu = document.getElementById("product-menu");

    if (productMenu) {
        // 3. Tạo thẻ ul để chứa menu con
        const submenu = document.createElement("ul");
        submenu.className = "submenu"; // Thêm class để CSS nhận diện

        // 4. Duyệt qua mảng dữ liệu để tạo các mục con
        productCategories.forEach(function (category) {
            const li = document.createElement("li");
            const a = document.createElement("a");
            
            a.href = category.link;
            a.textContent = category.name;

            li.appendChild(a);
            submenu.appendChild(li);
        });

        // 5. Đính kèm menu con vừa tạo vào trong mục "Sản phẩm"
        productMenu.appendChild(submenu);

        // 6. Xử lý hiệu ứng di chuột (Hover) ẩn/hiện
        productMenu.addEventListener("mouseenter", function () {
            submenu.style.display = "block";
        });

        productMenu.addEventListener("mouseleave", function () {
            submenu.style.display = "none";
        });
    }
});