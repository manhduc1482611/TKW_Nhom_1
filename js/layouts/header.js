document.addEventListener("DOMContentLoaded", () => {
    // 1. Tự động active menu theo đường dẫn trang
    const currentUrl = window.location.pathname;
    const menuLinks = document.querySelectorAll(".site-header .page-menu a");

    menuLinks.forEach(link => {
        const href = link.getAttribute("href");
        if (!href) return;

        if (currentUrl === href || (href !== "/index.html" && currentUrl.includes(href))) {
            link.classList.add("active");
            const closestSubmenu = link.closest(".submenu");
            if (closestSubmenu) {
                const parentMenu = closestSubmenu.closest(".has-submenu").querySelector("a");
                if (parentMenu) parentMenu.classList.add("active");
            }
        }
    });

    // 2. Tính số lượng giỏ hàng thực tế từ LocalStorage
    const cartCountEl = document.querySelector(".site-header .cart-count");
    if (cartCountEl) {
        const updateCart = () => {
            const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
            const total = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
            cartCountEl.textContent = total;
        };
        updateCart();
        window.addEventListener("storage", updateCart);
    }
});