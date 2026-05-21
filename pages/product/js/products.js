// =========================
// GET BRAND FROM URL
// (khi click từ trang chủ vào)
// =========================

const urlParams = new URLSearchParams(
    window.location.search
);

const brandFromUrl    = urlParams.get("brand");    // vd: "La Roche-Posay"
const categoryFromUrl = urlParams.get("category"); // vd: "Sữa rửa mặt"


// =========================
// ELEMENTS
// =========================

const productsGrid = document.getElementById("productsGrid");

const searchInput = document.getElementById("searchInput");

const brandFilter = document.getElementById("brandFilter");

const sortPrice = document.getElementById("sortPrice");

const pagination = document.getElementById("pagination");

const categoryItems = document.querySelectorAll(
    ".sidebar-box li"
);
const pageTitle = document.getElementById("pageTitle");

const toolbarTitle = document.getElementById("toolbarTitle");

const breadcrumbTitle = document.getElementById(
    "breadcrumbTitle"
);


// =========================
// DATA
// =========================

let allProducts = [];

let filteredProducts = [];

let currentPage = 1;

const productsPerPage = 9;

let currentCategory = "all";


// =========================
// FORMAT PRICE
// =========================

function formatPrice(price){

    return price.toLocaleString("vi-VN") + "đ";

}


// =========================
// LOADING
// =========================

function renderLoading(){

    productsGrid.innerHTML = `
    
        <div class="empty-message">
            Đang tải sản phẩm...
        </div>

    `;

}


// =========================
// FETCH PRODUCTS
// =========================

async function fetchProducts(){

    try{

        renderLoading();

        const response = await fetch(
            "/data/products.json"
        );

        const data = await response.json();

        allProducts = data;

        // ================================
        // NẾU CÓ BRAND TỪ URL → set vào
        // dropdown và cập nhật tiêu đề
        // ================================
        if(brandFromUrl){

            // Tìm option khớp với tên brand (so sánh không phân biệt hoa thường)
            const matchedOption = Array.from(brandFilter.options).find(opt =>
                opt.value.toLowerCase() === brandFromUrl.toLowerCase()
            );

            if(matchedOption){

                brandFilter.value = matchedOption.value;

                // Cập nhật tiêu đề trang
                pageTitle.textContent = matchedOption.value.toUpperCase();
                toolbarTitle.textContent = matchedOption.value;
                breadcrumbTitle.textContent = matchedOption.value;

            }

        }

        // ================================
        // NẾU CÓ CATEGORY TỪ URL → set vào
        // sidebar và cập nhật tiêu đề
        // ================================
        if(categoryFromUrl){

            // Map tên category → text sidebar
            const categoryMap = {
                "Sữa rửa mặt":   "Sữa rửa mặt",
                "Nước tẩy trang": "Nước tẩy trang",
                "Tonner":         "Tonner",
                "Kem chống nắng": "Kem chống nắng",
                "Kem dưỡng":      "Kem dưỡng",
            };

            currentCategory = categoryFromUrl;

            // Active đúng li trong sidebar
            categoryItems.forEach(item => {
                item.classList.remove("active-category");
                const text = item.innerText.trim();
                // match tên hiển thị sidebar với category
                const matchText = categoryMap[categoryFromUrl];
                if(text === matchText || text === categoryFromUrl){
                    item.classList.add("active-category");
                }
            });

            const displayName = categoryMap[categoryFromUrl] || categoryFromUrl;
            pageTitle.textContent    = displayName.toUpperCase();
            toolbarTitle.textContent = displayName;
            breadcrumbTitle.textContent = displayName;

        }

        applyFilters();

    }

    catch(error){

        console.log(error);

        productsGrid.innerHTML = `
        
            <div class="empty-message">
                Không thể tải sản phẩm.
            </div>

        `;

    }

}


// =========================
// APPLY FILTERS
// =========================

function applyFilters(){

    filteredProducts = [...allProducts];

    // =====================
    // SEARCH
    // =====================

    const keyword = searchInput.value
        .toLowerCase()
        .trim();

    if(keyword !== ""){

        filteredProducts = filteredProducts.filter(product => {

            return (
                product.name
                    .toLowerCase()
                    .includes(keyword)

                ||

                product.brand
                    .toLowerCase()
                    .includes(keyword)

                ||

                product.characteristics
                    .toLowerCase()
                    .includes(keyword)
            );

        });

    }


    // =====================
    // CATEGORY
    // =====================

    if(currentCategory !== "all"){

        filteredProducts = filteredProducts.filter(product => {

            return product.category === currentCategory;

        });

    }


    // =====================
    // BRAND
    // =====================

    const brand = brandFilter.value;

    if(brand !== "all"){

        filteredProducts = filteredProducts.filter(product => {

            return product.brand === brand;

        });

    }


    // =====================
    // SORT
    // =====================

    const sort = sortPrice.value;

    if(sort === "low-high"){

        filteredProducts.sort((a, b) => {

            return a.salePrice - b.salePrice;

        });

    }

    else if(sort === "high-low"){

        filteredProducts.sort((a, b) => {

            return b.salePrice - a.salePrice;

        });

    }


    // =====================
    // RESET PAGE
    // =====================

    if(currentPage > Math.ceil(filteredProducts.length / productsPerPage)){

        currentPage = 1;

    }

    renderProducts();

    renderPagination();

}


// =========================
// RENDER PRODUCTS
// =========================

function renderProducts(){

    productsGrid.innerHTML = "";

    // empty
    if(filteredProducts.length === 0){

        productsGrid.innerHTML = `
        
            <div class="empty-message">
                Không tìm thấy sản phẩm phù hợp.
            </div>

        `;

        return;

    }

    // pagination
    const start = (currentPage - 1) * productsPerPage;

    const end = start + productsPerPage;

    const currentProducts = filteredProducts.slice(
        start,
        end
    );

    // render
    currentProducts.forEach(product => {

        const discount = Math.round(

            ((product.price - product.salePrice)
            / product.price) * 100

        );

        productsGrid.innerHTML += `

            <div class="product-card">

                <!-- IMAGE -->
                <div class="product-image">

                    <a href="./product-detail.html?id=${product.id}">

                        <img
                            src="${product.images[0]}"
                            alt="${product.name}"
                        >

                    </a>

                    <span class="discount-badge">

                        -${discount}%

                    </span>

                </div>

                <!-- INFO -->
                <div class="product-info">

                    <p class="product-brand">

                        ${product.brand}

                    </p>

                    <h3 class="product-name">

                        ${product.name}

                    </h3>

                    <p class="product-characteristics">

                        ${product.characteristics}

                    </p>

                    <div class="product-price">

                        <span class="sale-price">

                            ${formatPrice(product.salePrice)}

                        </span>

                        <span class="old-price">

                            ${formatPrice(product.price)}

                        </span>

                    </div>

                    <a
                        href="./product-detail.html?id=${product.id}"
                        class="detail-btn"
                    >

                        Xem chi tiết

                    </a>

                </div>

            </div>

        `;

    });

}


// =========================
// PAGINATION
// =========================

function renderPagination(){

    pagination.innerHTML = "";

    const totalPages = Math.ceil(
        filteredProducts.length / productsPerPage
    );

    // không cần pagination
    if(totalPages <= 1){

        return;

    }

    // =====================
    // CREATE BUTTON
    // =====================

    function createButton(text, page, active = false){

        const button = document.createElement("button");

        button.innerText = text;

        if(active){

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

    // =====================
    // PREVIOUS
    // =====================

    if(currentPage > 1){

        createButton(
            "← Trang trước",
            currentPage - 1
        );

    }

    // =====================
    // FIRST PAGE
    // =====================

    createButton(
        1,
        1,
        currentPage === 1
    );

    // =====================
    // DOTS LEFT
    // =====================

    if(currentPage > 3){

        const dots = document.createElement("span");

        dots.innerText = "...";

        pagination.appendChild(dots);

    }

    // =====================
    // PAGES AROUND CURRENT
    // =====================

    for(
        let i = Math.max(2, currentPage - 1);

        i <= Math.min(totalPages - 1, currentPage + 1);

        i++
    ){

        createButton(
            i,
            i,
            currentPage === i
        );

    }

    // =====================
    // DOTS RIGHT
    // =====================

    if(currentPage < totalPages - 2){

        const dots = document.createElement("span");

        dots.innerText = "...";

        pagination.appendChild(dots);

    }

    // =====================
    // LAST PAGE
    // =====================

    if(totalPages > 1){

        createButton(
            totalPages,
            totalPages,
            currentPage === totalPages
        );

    }

    // =====================
    // NEXT
    // =====================

    if(currentPage < totalPages){

        createButton(
            "Trang sau →",
            currentPage + 1
        );

    }

}


// =========================
// SIDEBAR CATEGORY
// =========================

categoryItems.forEach(item => {

    item.addEventListener("click", () => {

        // active
        categoryItems.forEach(li => {

            li.classList.remove("active-category");

        });

        item.classList.add("active-category");

        // category
        const text = item.innerText.trim();

        switch(text){

            case "Sữa rửa mặt":
                currentCategory = "Sữa rửa mặt";
                break;

            case "Tonner":
                currentCategory = "Tonner";
                break;

            case "Kem dưỡng":
                currentCategory = "Kem dưỡng";
                break;

            case "Kem chống nắng":
                currentCategory = "Kem chống nắng";
                break;

            case "Nước tẩy trang":
                currentCategory = "Nước tẩy trang";
                break;

            default:
                currentCategory = "all";

        }

        // update titles
        let displayTitle = text;

        if(text === "Tất cả sản phẩm"){
            displayTitle = "Tất cả sản phẩm";
        }

        pageTitle.textContent = displayTitle.toUpperCase();
        toolbarTitle.textContent = displayTitle;
        breadcrumbTitle.textContent = displayTitle;

        currentPage = 1;

        applyFilters();

    });

});


// =========================
// EVENTS
// =========================

searchInput.addEventListener("input", () => {

    currentPage = 1;

    applyFilters();

});

brandFilter.addEventListener("change", () => {

    currentPage = 1;

    // Cập nhật tiêu đề khi đổi brand thủ công
    const selectedBrand = brandFilter.value;

    if(selectedBrand === "all"){
        pageTitle.textContent = "TẤT CẢ SẢN PHẨM";
        toolbarTitle.textContent = "Tất cả sản phẩm";
        breadcrumbTitle.textContent = "Sản phẩm";
    } else {
        pageTitle.textContent = selectedBrand.toUpperCase();
        toolbarTitle.textContent = selectedBrand;
        breadcrumbTitle.textContent = selectedBrand;
    }

    applyFilters();

});

sortPrice.addEventListener("change", () => {

    applyFilters();

});


// =========================
// INIT
// =========================

fetchProducts();