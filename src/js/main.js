document.addEventListener("DOMContentLoaded", function () {
    // Lấy tên file hiện tại từ URL (ví dụ: 'products.html')
    // Nếu đường dẫn trống (trang chủ), mặc định là 'index.html'
    let currentPath = window.location.pathname.split("/").pop() || "index.html";

    const menuLinks = document.querySelectorAll(".page-menu a");

    menuLinks.forEach(link => {
        const linkHref = link.getAttribute("href");
        if (!linkHref) return;

        // Lấy tên file từ thuộc tính href của link
        const linkPage = linkHref.split("/").pop();

        if (currentPath === linkPage) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
});