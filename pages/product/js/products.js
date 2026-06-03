// =====================================================
// PRODUCT LIST PAGE
// Trang danh sách sản phẩm
// =====================================================

// Read filter values from URL.
// Đọc giá trị lọc từ URL khi người dùng bấm từ trang khác sang.
const urlParams = new URLSearchParams(window.location.search);
const brandFromUrl = urlParams.get("brand");
const categoryFromUrl = urlParams.get("category");

// DOM elements.
// Các phần tử HTML cần dùng trong trang.
const productsGrid = document.getElementById("productsGrid");
const searchInput = document.getElementById("searchInput");
const brandFilter = document.getElementById("brandFilter");
const sortPrice = document.getElementById("sortPrice");
const pagination = document.getElementById("pagination");
const suggestionList = document.getElementById("suggestionList");
const categoryItems = document.querySelectorAll(".sidebar-box li");
const pageTitle = document.getElementById("pageTitle");
const toolbarTitle = document.getElementById("toolbarTitle");
const breadcrumbTitle = document.getElementById("breadcrumbTitle");

// Page state.
// Trạng thái hiện tại của trang.
let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
let currentCategory = "all";

const productsPerPage = 9;

// Format number to Vietnamese currency.
// Định dạng số thành tiền Việt Nam.
function formatPrice(price) {
    return price.toLocaleString("vi-VN") + "đ";
}

function renderLoading() {
    productsGrid.innerHTML = `
        <div class="empty-message">
            Đang tải sản phẩm...
        </div>
    `;
}

function renderEmpty(message) {
    productsGrid.innerHTML = `
        <div class="empty-message">
            ${message}
        </div>
    `;
}

// Update page titles when category or brand changes.
// Cập nhật tiêu đề trang khi đổi danh mục hoặc thương hiệu.
function updatePageTitle(title, breadcrumb = title) {
    pageTitle.textContent = title.toUpperCase();
    toolbarTitle.textContent = title;
    breadcrumbTitle.textContent = breadcrumb;
}

// Load products from JSON file.
// Tải dữ liệu sản phẩm từ file JSON.
async function fetchProducts() {
    try {
        renderLoading();

        const response = await fetch("/data/products.json");
        const data = await response.json();

        allProducts = data;
        setInitialFiltersFromUrl();
        applyFilters();
    }
    catch (error) {
        console.log(error);
        renderEmpty("Không thể tải sản phẩm.");
    }
}

// Apply brand/category from URL if present.
// Áp dụng thương hiệu/danh mục từ URL nếu có.
function setInitialFiltersFromUrl() {
    if (brandFromUrl) {
        const matchedOption = Array.from(brandFilter.options).find(option => {
            return option.value.toLowerCase() === brandFromUrl.toLowerCase();
        });

        if (matchedOption) {
            brandFilter.value = matchedOption.value;
            updatePageTitle(matchedOption.value);
        }
    }

    if (categoryFromUrl) {
        currentCategory = categoryFromUrl;
        updateActiveCategory(categoryFromUrl);
        updatePageTitle(categoryFromUrl);
    }
}

// Highlight active category in sidebar.
// Đánh dấu danh mục đang được chọn ở sidebar.
function updateActiveCategory(categoryName) {
    categoryItems.forEach(item => {
        const text = item.innerText.trim();
        item.classList.toggle("active-category", text === categoryName);
    });
}

// Filter, search and sort products.
// Lọc, tìm kiếm và sắp xếp sản phẩm.
function applyFilters() {
    const keyword = searchInput.value.toLowerCase().trim();
    const selectedBrand = brandFilter.value;
    const selectedSort = sortPrice.value;

    filteredProducts = allProducts.filter(product => {
        const matchSearch =
            keyword === ""
            || product.name.toLowerCase().includes(keyword)
            || product.brand.toLowerCase().includes(keyword)
            || product.characteristics.toLowerCase().includes(keyword);

        const matchCategory =
            currentCategory === "all"
            || product.category === currentCategory;

        const matchBrand =
            selectedBrand === "all"
            || product.brand === selectedBrand;

        return matchSearch && matchCategory && matchBrand;
    });

    if (selectedSort === "low-high") {
        filteredProducts.sort((a, b) => a.salePrice - b.salePrice);
    }
    else if (selectedSort === "high-low") {
        filteredProducts.sort((a, b) => b.salePrice - a.salePrice);
    }

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    if (currentPage > totalPages) {
        currentPage = 1;
    }

    renderProducts();
    renderPagination();
    renderSuggestions();
}

// Render product cards for current page.
// Hiển thị danh sách sản phẩm theo trang hiện tại.
function renderProducts() {
    productsGrid.innerHTML = "";

    if (filteredProducts.length === 0) {
        renderEmpty("Không tìm thấy sản phẩm phù hợp.");
        return;
    }

    const start = (currentPage - 1) * productsPerPage;
    const end = start + productsPerPage;
    const currentProducts = filteredProducts.slice(start, end);

    currentProducts.forEach(product => {
        const discount = Math.round(
            ((product.price - product.salePrice) / product.price) * 100
        );

        productsGrid.innerHTML += `
            <div class="product-card">
                <div class="product-image">
                    <a href="./product-detail.html?id=${product.id}">
                        <img src="${product.images[0]}" alt="${product.name}">
                    </a>
                    <span class="discount-badge">-${discount}%</span>
                </div>

                <div class="product-info">
                    <p class="product-brand">${product.brand}</p>
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-characteristics">${product.characteristics}</p>

                    <div class="product-price">
                        <span class="sale-price">${formatPrice(product.salePrice)}</span>
                        <span class="old-price">${formatPrice(product.price)}</span>
                    </div>

                    <a href="./product-detail.html?id=${product.id}" class="detail-btn">
                        Xem chi tiết
                    </a>
                </div>
            </div>
        `;
    });
}

// Render suggested products in sidebar.
// Hiển thị sản phẩm gợi ý ở cột bên trái.
function renderSuggestions() {
    if (!suggestionList) {
        return;
    }

    let suggestedProducts = [...allProducts];

    if (currentCategory !== "all") {
        suggestedProducts = suggestedProducts.filter(product => {
            return product.category === currentCategory;
        });
    }

    suggestedProducts.sort((a, b) => b.stock - a.stock);

    // Use productsPerPage so the sidebar is close to the product grid height.
    // Dùng productsPerPage để phần gợi ý kéo dài gần bằng lưới sản phẩm.
    const slicedProducts = suggestedProducts.slice(0, productsPerPage);

    if (slicedProducts.length === 0) {
        suggestionList.innerHTML = `
            <p class="suggestion-empty">
                Chưa có sản phẩm gợi ý.
            </p>
        `;
        return;
    }

    suggestionList.innerHTML = "";

    slicedProducts.forEach(product => {
        suggestionList.innerHTML += `
            <a href="./product-detail.html?id=${product.id}" class="related-card">
                <img src="${product.images[0]}" alt="${product.name}">

                <div class="related-info">
                    <h3>${product.name}</h3>
                    <div class="related-price">
                        ${formatPrice(product.salePrice)}
                    </div>
                </div>
            </a>
        `;
    });
}

// Render pagination buttons.
// Hiển thị các nút phân trang.
function renderPagination() {
    pagination.innerHTML = "";

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    if (totalPages <= 1) {
        return;
    }

    if (currentPage > 1) {
        createPageButton("← Trang trước", currentPage - 1);
    }

    createPageButton(1, 1, currentPage === 1);

    if (currentPage > 3) {
        createDots();
    }

    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        createPageButton(i, i, currentPage === i);
    }

    if (currentPage < totalPages - 2) {
        createDots();
    }

    if (totalPages > 1) {
        createPageButton(totalPages, totalPages, currentPage === totalPages);
    }

    if (currentPage < totalPages) {
        createPageButton("Trang sau →", currentPage + 1);
    }
}

function createPageButton(text, page, active = false) {
    const button = document.createElement("button");

    button.innerText = text;

    if (active) {
        button.classList.add("active");
    }

    button.addEventListener("click", () => {
        currentPage = page;
        renderProducts();
        renderPagination();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    pagination.appendChild(button);
}

function createDots() {
    const dots = document.createElement("span");
    dots.innerText = "...";
    pagination.appendChild(dots);
}

// Convert sidebar text to category value.
// Đổi chữ ở sidebar thành giá trị danh mục dùng để lọc.
function getCategoryFromText(text) {
    switch (text) {
        case "Sữa rửa mặt":
        case "Tonner":
        case "Kem dưỡng":
        case "Kem chống nắng":
        case "Nước tẩy trang":
            return text;
        default:
            return "all";
    }
}

// Sidebar category click.
// Xử lý khi bấm danh mục bên trái.
categoryItems.forEach(item => {
    item.addEventListener("click", () => {
        const text = item.innerText.trim();

        categoryItems.forEach(li => li.classList.remove("active-category"));
        item.classList.add("active-category");

        currentCategory = getCategoryFromText(text);
        currentPage = 1;

        if (currentCategory === "all") {
            updatePageTitle("Tất cả sản phẩm", "Sản phẩm");
        }
        else {
            updatePageTitle(currentCategory);
        }

        applyFilters();
    });
});

// Search input event.
// Sự kiện tìm kiếm sản phẩm.
searchInput.addEventListener("input", () => {
    currentPage = 1;
    applyFilters();
});

// Brand select event.
// Sự kiện lọc theo thương hiệu.
brandFilter.addEventListener("change", () => {
    currentPage = 1;

    if (brandFilter.value === "all") {
        updatePageTitle("Tất cả sản phẩm", "Sản phẩm");
    }
    else {
        updatePageTitle(brandFilter.value);
    }

    applyFilters();
});

// Sort select event.
// Sự kiện sắp xếp theo giá.
sortPrice.addEventListener("change", () => {
    currentPage = 1;
    applyFilters();
});

// Start page.
// Khởi chạy trang.
fetchProducts();
