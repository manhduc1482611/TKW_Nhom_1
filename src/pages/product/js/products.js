// =======================
// GLOBAL VARIABLES
// =======================

let allProducts = [];

const productsGrid = document.getElementById("productsGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sortPrice = document.getElementById("sortPrice");


// =======================
// FETCH PRODUCTS
// =======================

async function fetchProducts() {

    try {

        const response = await fetch("../../../data/products.json");

        const data = await response.json();

        allProducts = data;

        renderProducts(allProducts);

    } catch (error) {

        console.log("Lỗi tải dữ liệu:", error);

    }

}


// =======================
// FORMAT PRICE
// =======================

function formatPrice(price) {

    return price.toLocaleString("vi-VN") + "đ";

}


// =======================
// RENDER PRODUCTS
// =======================

function renderProducts(products) {

    productsGrid.innerHTML = "";

    if (products.length === 0) {

        productsGrid.innerHTML = `
            <p class="empty-message">
                Không tìm thấy sản phẩm.
            </p>
        `;

        return;
    }

    products.forEach(product => {

        const discountPercent = Math.round(
            ((product.price - product.salePrice) / product.price) * 100
        );

        const productCard = `

            <div class="product-card">

                <!-- image -->
                <div class="product-image">

                    <a href="./product-detail.html?id=${product.id}">

                        <img 
                            src="${product.images[0]}"
                            alt="${product.name}"
                        >

                    </a>

                    <span class="discount-badge">
                        -${discountPercent}%
                    </span>

                </div>

                <!-- info -->
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

                    <!-- price -->
                    <div class="product-price">

                        <span class="sale-price">
                            ${formatPrice(product.salePrice)}
                        </span>

                        <span class="old-price">
                            ${formatPrice(product.price)}
                        </span>

                    </div>

                    <!-- volume -->
                    <div class="product-volume">

                        ${product.volumes.map(volume => `
                            <span class="volume-item">
                                ${volume}
                            </span>
                        `).join("")}

                    </div>

                    <!-- action -->
                    <div class="product-actions">

                        <a 
                            href="./product-detail.html?id=${product.id}"
                            class="detail-btn"
                        >
                            Xem chi tiết
                        </a>

                    </div>

                </div>

            </div>

        `;

        productsGrid.innerHTML += productCard;

    });

}


// =======================
// SEARCH
// =======================

function searchProducts() {

    const keyword = searchInput.value.toLowerCase();

    let filteredProducts = allProducts.filter(product => {

        return product.name.toLowerCase().includes(keyword);

    });

    filterAndSort(filteredProducts);

}


// =======================
// FILTER + SORT
// =======================

function filterAndSort(productsArray = allProducts) {

    let result = [...productsArray];

    // category filter
    const selectedCategory = categoryFilter.value;

    if (selectedCategory !== "all") {

        result = result.filter(product => {

            return product.category === selectedCategory;

        });

    }

    // sort
    const sortValue = sortPrice.value;

    if (sortValue === "low-high") {

        result.sort((a, b) => a.salePrice - b.salePrice);

    }

    if (sortValue === "high-low") {

        result.sort((a, b) => b.salePrice - a.salePrice);

    }

    renderProducts(result);

}


// =======================
// EVENTS
// =======================

searchInput.addEventListener("input", searchProducts);

categoryFilter.addEventListener("change", () => {

    filterAndSort();

});

sortPrice.addEventListener("change", () => {

    filterAndSort();

});


// =======================
// INIT
// =======================

fetchProducts();