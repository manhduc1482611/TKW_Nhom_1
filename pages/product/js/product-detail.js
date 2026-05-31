// =========================
// GET PRODUCT ID
// =========================

const params = new URLSearchParams(
    window.location.search
);

const productId = Number(
    params.get("id")
);


// =========================
// ELEMENTS
// =========================
const buyNowBtn = document.getElementById(
    "buyNowBtn"
);
const breadcrumbProduct = document.getElementById(
    "breadcrumbProduct"
);

const productBrand = document.getElementById(
    "productBrand"
);

const productName = document.getElementById(
    "productName"
);

const productCharacteristics = document.getElementById(
    "productCharacteristics"
);

const salePrice = document.getElementById(
    "salePrice"
);

const oldPrice = document.getElementById(
    "oldPrice"
);

const stockStatus = document.getElementById(
    "stockStatus"
);

const mainProductImage = document.getElementById(
    "mainProductImage"
);

const thumbnailList = document.getElementById(
    "thumbnailList"
);

const volumeOptions = document.getElementById(
    "volumeOptions"
);

const quantityValue = document.getElementById(
    "quantityValue"
);

const minusBtn = document.getElementById(
    "minusBtn"
);

const plusBtn = document.getElementById(
    "plusBtn"
);

const productDescription = document.getElementById(
    "productDescription"
);

const productIngredients = document.getElementById(
    "productIngredients"
);

const productUsage = document.getElementById(
    "productUsage"
);

const relatedProducts = document.getElementById(
    "relatedProducts"
);

const ratingText = document.getElementById(
    "ratingText"
);
const addCartBtn = document.getElementById(
    "addCartBtn"
);
const toast = document.querySelector(
    "#toast"
);
const reviewWriteBtn = document.getElementById(
    "reviewWriteBtn"
);
const reviewNotice = document.getElementById(
    "reviewNotice"
);
const reviewFilterButtons = document.querySelectorAll(
    ".review-filter button"
);
const reviewItems = document.querySelectorAll(
    ".review-item"
);
const reviewEmpty = document.getElementById(
    "reviewEmpty"
);
// =========================
// GLOBAL
// =========================

let currentQuantity = 1;
let currentProduct = null;

// =========================
// FORMAT PRICE
// =========================

function formatPrice(price) {

    return price.toLocaleString("vi-VN") + "đ";

}


// =========================
// FETCH PRODUCT
// =========================

async function fetchProduct() {

    try {

        const response = await fetch(
            "/data/products.json"
        );

        const products = await response.json();

        const product = products.find(item => {

            return item.id === productId;

        });

        // no product
        if (!product) {

            document.body.innerHTML = `
            
                <h1 style="
                    text-align:center;
                    margin-top:100px;
                    font-family:Montserrat;
                ">
                    Không tìm thấy sản phẩm
                </h1>

            `;

            return;

        }

        renderProduct(product);
        currentProduct = product;
        renderRelatedProducts(
            products,
            product
        );

    }

    catch (error) {

        console.log(error);

    }

}


// =========================
// RENDER PRODUCT
// =========================

function renderProduct(product) {

    // breadcrumb
    breadcrumbProduct.textContent =
        product.name;

    // info
    productBrand.textContent =
        product.brand;

    productName.textContent =
        product.name;

    productCharacteristics.textContent =
        product.characteristics;

    salePrice.textContent = formatPrice(
        product.salePrice
    );

    oldPrice.textContent = formatPrice(
        product.price
    );

    stockStatus.textContent =
        `Còn ${product.stock} sản phẩm`;

    ratingText.textContent =
        "4.5 | 2 đánh giá";

    // content
    productDescription.textContent =
        product.desc || "Đang cập nhật.";

    productIngredients.textContent =
        product.ingredients || "Đang cập nhật.";

    productUsage.textContent =
        product.usage || "Đang cập nhật.";

    // image
    mainProductImage.src =
        product.images[0];

    // thumbnails
    renderThumbnails(product);

    // volume
    renderVolumes(product);

}


// =========================
// THUMBNAILS
// =========================

function renderThumbnails(product) {

    thumbnailList.innerHTML = "";

    product.images.forEach((image, index) => {

        const div = document.createElement("div");

        div.classList.add(
            "thumbnail-item"
        );

        if (index === 0) {

            div.classList.add(
                "active-thumbnail"
            );

        }

        div.innerHTML = `
        
            <img src="${image}" alt="">
        
        `;

        div.addEventListener("click", () => {

            mainProductImage.src = image;

            document
                .querySelectorAll(
                    ".thumbnail-item"
                )
                .forEach(item => {

                    item.classList.remove(
                        "active-thumbnail"
                    );

                });

            div.classList.add(
                "active-thumbnail"
            );

        });

        thumbnailList.appendChild(div);

    });

}


// =========================
// VOLUME
// =========================

function renderVolumes(product) {

    volumeOptions.innerHTML = "";

    // nếu không có volume
    if (
        !product.volumes
        ||
        product.volumes.length === 0
    ) {

        const button = document.createElement(
            "button"
        );

        button.classList.add(
            "volume-btn",
            "active-volume"
        );

        button.innerText = "Default";

        volumeOptions.appendChild(button);

        return;

    }

    // giá gốc
    const basePrice = product.salePrice;

    const baseOldPrice = product.price;

    // render volume
    product.volumes.forEach(
        (volume, index) => {

            const button = document.createElement(
                "button"
            );

            button.classList.add(
                "volume-btn"
            );

            if (index === 0) {

                button.classList.add(
                    "active-volume"
                );

            }

            button.innerText = volume;

            button.addEventListener("click", () => {

                document
                    .querySelectorAll(
                        ".volume-btn"
                    )
                    .forEach(btn => {

                        btn.classList.remove(
                            "active-volume"
                        );

                    });

                button.classList.add(
                    "active-volume"
                );

                // =====================
                // PRICE LOGIC
                // =====================

                const multiplier =
                    1 + (index * 0.5);

                const newSalePrice =
                    Math.round(
                        basePrice * multiplier
                    );

                const newOldPrice =
                    Math.round(
                        baseOldPrice * multiplier
                    );

                salePrice.textContent =
                    formatPrice(
                        newSalePrice
                    );

                oldPrice.textContent =
                    formatPrice(
                        newOldPrice
                    );

            });

            volumeOptions.appendChild(button);

        });

}


// =========================
// RELATED PRODUCTS
// =========================

function renderRelatedProducts(
    products,
    currentProduct
) {

    relatedProducts.innerHTML = "";

    const related = products.filter(product => {

        return (
            product.category ===
            currentProduct.category

            &&

            product.id !==
            currentProduct.id
        );

    });

    // lấy 5 sản phẩm
    const slicedProducts = related.slice(0, 5);

    slicedProducts.forEach(product => {

        relatedProducts.innerHTML += `
        
            <a
                href="./product-detail.html?id=${product.id}"
                class="related-card"
            >

                <img
                    src="${product.images[0]}"
                    alt="${product.name}"
                >

                <div class="related-info">

                    <h3>

                        ${product.name}

                    </h3>

                    <div class="related-price">

                        ${formatPrice(
            product.salePrice
        )}

                    </div>

                </div>

            </a>

        `;

    });

}


// =========================
// QUANTITY
// =========================

plusBtn.addEventListener("click", () => {

    currentQuantity++;

    quantityValue.textContent =
        currentQuantity;

});


minusBtn.addEventListener("click", () => {

    if (currentQuantity > 1) {

        currentQuantity--;

        quantityValue.textContent =
            currentQuantity;

    }

});


// =========================
// KHỞI TẠO BIẾN TOÀN CỤC
// =========================
let toastTimeout = null;

// Tự động hiển thị số lượng trên badge ngay khi tải lại trang
document.addEventListener("DOMContentLoaded", () => {
    updateCartBadge();
    // Kiểm tra nếu có hàm fetchProduct thì mới gọi để tránh lỗi crash code
    if (typeof fetchProduct === "function") {
        fetchProduct();
    }
});

// =========================
// ADD TO CART (THÊM VÀO GIỎ)
// =========================
addCartBtn.addEventListener("click", () => {
    if (!currentProduct) return;

    // Lấy giỏ hàng hiện tại
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Ép kiểu currentQuantity về số để tránh lỗi cộng chuỗi (Ví dụ: 1 + "2" = "12")
    const quantityToAdd = parseInt(currentQuantity, 10) || 1;

    // Kiểm tra sản phẩm đã tồn tại trong giỏ chưa
    const existingProduct = cart.find(item => item.id === currentProduct.id);

    // Nếu đã có trong giỏ
    if (existingProduct) {
        const currentQty = parseInt(existingProduct.quantity, 10) || 0;
        existingProduct.quantity = currentQty + quantityToAdd;
    }
    // Nếu chưa có
    else {
        cart.push({
            id: currentProduct.id,
            name: currentProduct.name,
            brand: currentProduct.brand,
            image: currentProduct.images ? currentProduct.images[0] : "", // Phòng hờ nếu mảng images bị rỗng
            price: currentProduct.salePrice,
            quantity: quantityToAdd
        });
    }

    // Lưu lại vào localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Cập nhật lại số lượng hiển thị trên Badge
    updateCartBadge();

    // Hiển thị Toast thông báo (Xử lý triệt để việc click liên tục)
    toast.textContent = "Đã thêm vào giỏ hàng";
    toast.classList.add("show-toast");

    // Nếu có một timeout cũ đang chạy, xóa nó đi để tính lại 2.5 giây từ đầu
    if (toastTimeout) {
        clearTimeout(toastTimeout);
    }

    toastTimeout = setTimeout(() => {
        toast.classList.remove("show-toast");
    }, 2500);
});

// =========================
// BUY NOW (MUA NGAY)
// =========================
buyNowBtn.addEventListener("click", () => {
    if (!currentProduct) return;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProduct = cart.find(item => item.id === currentProduct.id);

    if (!existingProduct) {
        cart.push({
            id: currentProduct.id,
            name: currentProduct.name,
            brand: currentProduct.brand,
            image: currentProduct.images ? currentProduct.images[0] : "",
            price: currentProduct.salePrice,
            quantity: 1
        });

        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartBadge();
    }

    window.location.href = "/pages/cart/cart.html";
});


// =========================
// REVIEW ACTIONS
// =========================
reviewFilterButtons.forEach(button => {
    button.addEventListener("click", () => {
        reviewFilterButtons.forEach(item => {
            item.classList.remove("active");
        });

        button.classList.add("active");

        const filter = button.dataset.filter;
        let visibleCount = 0;

        reviewItems.forEach(item => {
            const rating = item.dataset.rating;
            const hasImage = item.dataset.hasImage === "true";
            const isVisible =
                filter === "all"
                || (filter === "image" && hasImage)
                || rating === filter;

            item.style.display = isVisible ? "flex" : "none";

            if (isVisible) {
                visibleCount++;
            }
        });

        if (reviewEmpty) {
            reviewEmpty.style.display = visibleCount === 0 ? "block" : "none";
        }
    });
});

if (reviewWriteBtn && reviewNotice) {
    let reviewNoticeTimeout = null;

    reviewWriteBtn.addEventListener("click", () => {
        reviewNotice.classList.add("show-review-notice");

        if (reviewNoticeTimeout) {
            clearTimeout(reviewNoticeTimeout);
        }

        reviewNoticeTimeout = setTimeout(() => {
            reviewNotice.classList.remove("show-review-notice");
        }, 2500);
    });
}


// =========================
// CART BADGE (CẬP NHẬT SỐ LƯỢNG)
// =========================
function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Tính tổng số lượng sản phẩm trong giỏ
    const totalQuantity = cart.reduce((total, item) => {
        const qty = parseInt(item.quantity, 10) || 0;
        return total + qty;
    }, 0);

    // Tìm badge (Hỗ trợ cả trường hợp chạy trong iframe `parent.document` hoặc trang thường `document`)
    const badge = (typeof parent !== "undefined" && parent.document.querySelector(".cart-count"))
        || document.querySelector(".cart-count");

    if (badge) {
        badge.textContent = totalQuantity;
    }
}
