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
// =========================
// GLOBAL
// =========================

let currentQuantity = 1;
let currentProduct = null;

// =========================
// FORMAT PRICE
// =========================

function formatPrice(price){

    return price.toLocaleString("vi-VN") + "đ";

}


// =========================
// RANDOM RATING
// =========================

function generateRandomRating(){

    const rating = (
        Math.random() * (5 - 4.5) + 4.5
    ).toFixed(1);

    const reviews = Math.floor(
        Math.random() * (200 - 50) + 50
    );

    return `${rating} | ${reviews} đánh giá`;

}


// =========================
// FETCH PRODUCT
// =========================

async function fetchProduct(){

    try{

        const response = await fetch(
            "/data/products.json"
        );

        const products = await response.json();

        const product = products.find(item => {

            return item.id === productId;

        });

        // no product
        if(!product){

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

    catch(error){

        console.log(error);

    }

}


// =========================
// RENDER PRODUCT
// =========================

function renderProduct(product){

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

    // random rating
    ratingText.textContent =
        generateRandomRating();

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

function renderThumbnails(product){

    thumbnailList.innerHTML = "";

    product.images.forEach((image, index) => {

        const div = document.createElement("div");

        div.classList.add(
            "thumbnail-item"
        );

        if(index === 0){

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

function renderVolumes(product){

    volumeOptions.innerHTML = "";

    // nếu không có volume
    if(
        !product.volumes
        ||
        product.volumes.length === 0
    ){

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

        if(index === 0){

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
){

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

    if(currentQuantity > 1){

        currentQuantity--;

        quantityValue.textContent =
            currentQuantity;

    }

});


// =========================
// INIT
// =========================
// =========================
// ADD TO CART
// =========================

addCartBtn.addEventListener("click", () => {

    if(!currentProduct){

        return;

    }

    // lấy cart hiện tại
    let cart = JSON.parse(
        localStorage.getItem("cart")
    ) || [];

    // check tồn tại
    const existingProduct = cart.find(item => {

        return item.id === currentProduct.id;

    });

    // nếu đã có
    if(existingProduct){

        existingProduct.quantity += currentQuantity;

    }

    // nếu chưa có
    else{

        cart.push({

            id: currentProduct.id,

            name: currentProduct.name,

            brand: currentProduct.brand,

            image: currentProduct.images[0],

            price: currentProduct.salePrice,

            quantity: currentQuantity

        });

    }

    // lưu localStorage
    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    // update badge
    updateCartBadge();

// show toast

toast.textContent =
    "Đã thêm vào giỏ hàng";

toast.classList.add(
    "show-toast"
);

setTimeout(() => {

    toast.classList.remove(
        "show-toast"
    );

}, 2500);
});


// =========================
// CART BADGE
// =========================

function updateCartBadge(){

    const cart = JSON.parse(
        localStorage.getItem("cart")
    ) || [];

    const totalQuantity = cart.reduce(
        (total, item) => {

            return total + item.quantity;

        },
        0
    );

    // tìm badge
    const badge = parent.document.querySelector(
        ".cart-count"
    );

    if(badge){

        badge.textContent = totalQuantity;

    }

}

fetchProduct();let toastTimeout = null;

// Tự động hiển thị số lượng trên badge ngay khi tải lại trang
document.addEventListener("DOMContentLoaded", updateCartBadge);

function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Ép kiểu ép số trực tiếp tại đây để phòng trường hợp dữ liệu trong giỏ bị lưu sai dạng chuỗi
    const totalQuantity = cart.reduce((total, item) => {
        const qty = parseInt(item.quantity, 10) || 0; 
        return total + qty;
    }, 0);

    const badge = parent.document.querySelector(".cart-count") || document.querySelector(".cart-count");
    if (badge) {
        badge.textContent = totalQuantity;
    }
}

addCartBtn.addEventListener("click", () => {
    if (!currentProduct) return;

    // Ép kiểu số để tránh lỗi cộng chuỗi (ví dụ: "1" + 1 = "11")
    const quantityToAdd = parseInt(currentQuantity, 10) || 1;
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Chuyển ID về chuỗi (String) để tránh lỗi lệch kiểu dữ liệu khi so sánh số với chuỗi
    const existingProduct = cart.find(item => String(item.id) === String(currentProduct.id));

    if (existingProduct) {
        existingProduct.quantity += quantityToAdd;
    } else {
        cart.push({
            id: currentProduct.id,
            name: currentProduct.name,
            brand: currentProduct.brand,
            image: currentProduct.images?.[0] || "", // Tránh lỗi nếu sản phẩm thiếu ảnh
            price: currentProduct.salePrice,
            quantity: quantityToAdd
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartBadge();

    // Xử lý hiển thị Toast (clearTimeout để tránh lỗi chớp tắt khi click nhanh)
    toast.textContent = "Đã thêm vào giỏ hàng";
    toast.classList.add("show-toast");

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove("show-toast");
    }, 2500);
});