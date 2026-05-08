// =======================
// GET HTML ELEMENTS
// =======================

const mainImage = document.getElementById("mainImage");

const thumbnailList = document.getElementById("thumbnailList");

const breadcrumbName = document.getElementById("breadcrumbName");

const productName = document.getElementById("productName");

const productBrand = document.getElementById("productBrand");

const productOrigin = document.getElementById("productOrigin");

const salePrice = document.getElementById("salePrice");

const oldPrice = document.getElementById("oldPrice");

const productCharacteristics = document.getElementById("productCharacteristics");

const volumeOptions = document.getElementById("volumeOptions");

const productStock = document.getElementById("productStock");

const productDesc = document.getElementById("productDesc");

const productIngredients = document.getElementById("productIngredients");

const productUsage = document.getElementById("productUsage");

const minusBtn = document.getElementById("minusBtn");

const plusBtn = document.getElementById("plusBtn");

const quantityInput = document.getElementById("quantityInput");


// =======================
// GET PRODUCT ID FROM URL
// =======================

const params = new URLSearchParams(window.location.search);

const productId = Number(params.get("id"));


// =======================
// FORMAT PRICE
// =======================

function formatPrice(price) {

    return price.toLocaleString("vi-VN") + "đ";

}


// =======================
// CALCULATE PRICE BY SIZE
// =======================

function calculatePrice(basePrice, volumes, currentIndex) {

    // chỉ có 1 dung tích
    if(volumes.length === 1){

        return basePrice;

    }

    // có 2 dung tích
    if(volumes.length === 2){

        if(currentIndex === 0){

            return basePrice;

        }

        if(currentIndex === 1){

            return Math.round(basePrice * 1.25);

        }

    }

    // có 3 dung tích
    if(volumes.length === 3){

        if(currentIndex === 0){

            return basePrice;

        }

        if(currentIndex === 1){

            return Math.round(basePrice * 1.25);

        }

        if(currentIndex === 2){

            return Math.round(basePrice * 1.4);

        }

    }

    return basePrice;
}

// =======================
// FETCH PRODUCT
// =======================

async function fetchProductDetail() {

    try {

        const response = await fetch("../../../data/products.json");

        const products = await response.json();

        const product = products.find(item => item.id === productId);

        if(!product) {

            document.body.innerHTML = `
                <h1>Không tìm thấy sản phẩm</h1>
            `;

            return;

        }

        renderProduct(product);

    } catch(error) {

        console.log("Lỗi:", error);

    }

}


// =======================
// RENDER PRODUCT
// =======================

function renderProduct(product) {

    // breadcrumb
    breadcrumbName.innerText = product.name;

    // info
    productName.innerText = product.name;

    productBrand.innerText = product.brand;

    productOrigin.innerText = product.origin;

    productCharacteristics.innerText = product.characteristics;

    productStock.innerText = product.stock;

    productDesc.innerText = product.desc;

    productIngredients.innerText = product.ingredients;

    productUsage.innerText = product.usage;

    // image
    mainImage.src = product.images[0];

    // thumbnail
    renderThumbnails(product.images);

    // price
    updatePrice(product, 0);

    // volumes
    renderVolumes(product);

}


// =======================
// RENDER THUMBNAILS
// =======================

function renderThumbnails(images) {

    thumbnailList.innerHTML = "";

    images.forEach(image => {

        const thumbnail = document.createElement("img");

        thumbnail.src = image;

        thumbnail.classList.add("thumbnail-item");

        thumbnail.addEventListener("click", () => {

            mainImage.src = image;

        });

        thumbnailList.appendChild(thumbnail);

    });

}


// =======================
// RENDER VOLUME OPTIONS
// =======================

function renderVolumes(product) {

    volumeOptions.innerHTML = "";

    // copy mảng volumes
const sortedVolumes = [...product.volumes];

// sort từ nhỏ -> lớn
sortedVolumes.sort((a, b) => {

    return parseInt(a) - parseInt(b);

});


sortedVolumes.forEach((volume, index) => {

        const button = document.createElement("button");

        button.innerText = volume;

        button.classList.add("volume-btn");

        // active mặc định
        if(index === 0) {

            button.classList.add("active");

        }

        button.addEventListener("click", () => {

            // remove active
            const allButtons = document.querySelectorAll(".volume-btn");

            allButtons.forEach(btn => {

                btn.classList.remove("active");

            });

            // add active
            button.classList.add("active");

            // update price
            updatePrice(product, index);

        });

        volumeOptions.appendChild(button);

    });

}


// =======================
// UPDATE PRICE
// =======================

function updatePrice(product, index) {

  const newPrice = calculatePrice(
    product.price,
    product.volumes,
    index
);

const newSalePrice = calculatePrice(
    product.salePrice,
    product.volumes,
    index
);

    oldPrice.innerText = formatPrice(newPrice);

    salePrice.innerText = formatPrice(newSalePrice);

}


// =======================
// QUANTITY BUTTONS
// =======================

minusBtn.addEventListener("click", () => {

    let currentValue = Number(quantityInput.value);

    if(currentValue > 1) {

        quantityInput.value = currentValue - 1;

    }

});


plusBtn.addEventListener("click", () => {

    let currentValue = Number(quantityInput.value);

    quantityInput.value = currentValue + 1;

});


// =======================
// INIT
// =======================

fetchProductDetail();