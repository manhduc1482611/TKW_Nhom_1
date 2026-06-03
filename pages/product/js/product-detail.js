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
// GLOBAL STATE
// Trạng thái dùng chung của trang
// =========================

let currentQuantity = 1;
let currentProduct = null;
let currentVolume = "";
let currentSalePrice = 0;

// =========================
// FORMAT PRICE
// =========================

function formatPrice(price) {
    return price.toLocaleString("vi-VN") + "đ";
}

// Create a unique key for product + volume.
// Tạo mã riêng cho từng sản phẩm + dung tích để giỏ hàng không bị gộp sai.
function createCartKey(productId, volume) {
    return `${productId}-${volume || "default"}`;
}

// Build cart item from current selected product.
// Tạo dữ liệu sản phẩm để lưu vào giỏ hàng theo lựa chọn hiện tại.
function getCartItemFromCurrentProduct(quantity) {
    return {
        id: currentProduct.id,
        cartKey: createCartKey(currentProduct.id, currentVolume),
        name: currentProduct.name,
        brand: currentProduct.brand,
        image: currentProduct.images ? currentProduct.images[0] : "",
        price: currentSalePrice,
        volume: currentVolume,
        quantity: quantity
    };
}

// Compare cart item with current product + volume.
// So sánh sản phẩm trong giỏ với sản phẩm và dung tích đang chọn.
function isSameCartItem(item, cartKey) {
    if (item.cartKey) {
        return item.cartKey === cartKey;
    }

    if (item.id !== currentProduct.id) {
        return false;
    }

    if (item.volume) {
        return item.volume === currentVolume;
    }

    const defaultVolume = (
        currentProduct.volumes
        &&
        currentProduct.volumes.length > 0
    )
        ? currentProduct.volumes[0]
        : "Default";

    return currentVolume === defaultVolume;
}

// Update old cart data to the new structure.
// Cập nhật dữ liệu giỏ hàng cũ sang cấu trúc mới có dung tích.
function updateExistingCartItemInfo(item, cartKey) {
    item.cartKey = cartKey;
    item.volume = currentVolume;
    item.price = currentSalePrice;
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

    currentSalePrice = product.salePrice;

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
// Dung tích đã được sắp xếp sẵn trong products.json
// =========================

// Update price when user chooses another volume.
// Cập nhật giá khi người dùng chọn dung tích khác.
function applyVolumePrice(volumeIndex, basePrice, baseOldPrice) {
    const multiplier = 1 + (volumeIndex * 0.5);
    const newSalePrice = Math.round(basePrice * multiplier);
    const newOldPrice = Math.round(baseOldPrice * multiplier);

    // This value is saved into cart.
    // Giá này sẽ được lưu vào giỏ hàng.
    currentSalePrice = newSalePrice;

    salePrice.textContent = formatPrice(newSalePrice);
    oldPrice.textContent = formatPrice(newOldPrice);
}

// Render volume buttons.
// Hiển thị các nút chọn dung tích.
function renderVolumes(product) {
    volumeOptions.innerHTML = "";

    const volumes = product.volumes || [];

    // Product without volume still needs one default option.
    // Sản phẩm không có dung tích vẫn cần một lựa chọn mặc định.
    if (volumes.length === 0) {
        currentVolume = "Default";

        const button = document.createElement("button");
        button.classList.add("volume-btn", "active-volume");
        button.innerText = "Default";

        volumeOptions.appendChild(button);
        return;
    }

    // Default selected volume.
    // Dung tích mặc định đang được chọn.
    currentVolume = volumes[0];
    const basePrice = product.salePrice;
    const baseOldPrice = product.price;

    applyVolumePrice(0, basePrice, baseOldPrice);

    volumes.forEach((volume, index) => {
        const button = document.createElement("button");
        button.classList.add("volume-btn");
        button.dataset.volumeIndex = String(index);

        if (index === 0) {
            button.classList.add("active-volume");
        }

        button.innerText = volume;

        button.addEventListener("click", () => {
            document.querySelectorAll(".volume-btn").forEach(btn => {
                btn.classList.remove("active-volume");
            });

            button.classList.add("active-volume");

            // This value is saved into cart.
            // Dung tích này sẽ được lưu vào giỏ hàng.
            currentVolume = volume;

            const volumeIndex = parseInt(button.dataset.volumeIndex, 10) || 0;

            applyVolumePrice(volumeIndex, basePrice, baseOldPrice);
        });

        volumeOptions.appendChild(button);
    });
}


// =========================
// RELATED PRODUCTS
// Sản phẩm gợi ý cùng danh mục
// =========================
function renderRelatedProducts(products, currentProduct) {
    relatedProducts.innerHTML = "";

    const related = products.filter(product => {
        return (
            product.category === currentProduct.category
            && product.id !== currentProduct.id
        );
    });

    // Get 5 related products.
    // Lấy 5 sản phẩm gợi ý.
    const slicedProducts = related.slice(0, 5);

    slicedProducts.forEach(product => {
        relatedProducts.innerHTML += `
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
// INIT
// Khởi tạo trang
// =========================
let toastTimeout = null;

document.addEventListener("DOMContentLoaded", () => {
    updateCartBadge();
    fetchProduct();
});

// =========================
// ADD OR UPDATE CART
// Thêm mới hoặc cập nhật sản phẩm trong giỏ
//
// replaceQuantity = false: add more quantity (Add to cart)
// replaceQuantity = true: keep selected quantity only (Buy now)
// replaceQuantity = false: cộng thêm số lượng (Thêm vào giỏ)
// replaceQuantity = true: đặt đúng số lượng đang chọn (Mua ngay)
// =========================
function addCurrentProductToCart(replaceQuantity = false) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const quantity = parseInt(currentQuantity, 10) || 1;
    const cartKey = createCartKey(currentProduct.id, currentVolume);

    const existingProduct = cart.find(item => {
        return isSameCartItem(item, cartKey);
    });

    if (existingProduct) {
        updateExistingCartItemInfo(existingProduct, cartKey);

        if (replaceQuantity) {
            existingProduct.quantity = quantity;
        }
        else {
            const currentQty = parseInt(existingProduct.quantity, 10) || 0;
            existingProduct.quantity = currentQty + quantity;
        }
    }
    else {
        cart.push(getCartItemFromCurrentProduct(quantity));
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartBadge();
}


// =========================
// ADD TO CART
// Thêm sản phẩm vào giỏ
// =========================
addCartBtn.addEventListener("click", () => {
    if (!currentProduct) return;

    addCurrentProductToCart(false);

    if (!toast) return;

    toast.textContent = "Đã thêm vào giỏ hàng";
    toast.classList.add("show-toast");

    if (toastTimeout) {
        clearTimeout(toastTimeout);
    }

    toastTimeout = setTimeout(() => {
        toast.classList.remove("show-toast");
    }, 2500);
});


// =========================
// BUY NOW
// Mua ngay: thêm/cập nhật giỏ rồi chuyển sang trang giỏ hàng
// =========================
buyNowBtn.addEventListener("click", () => {
    if (!currentProduct) return;

    addCurrentProductToCart(true);
    window.location.href = "/pages/cart/cart.html";
});


// =========================
// REVIEW ACTIONS
// Lọc đánh giá và hiện thông báo viết đánh giá
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
