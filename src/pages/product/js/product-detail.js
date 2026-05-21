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


// =========================
// GLOBAL
// =========================

let currentQuantity = 1;


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
            "../../../data/products.json"
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

    // nếu không có volumes
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

        button.innerText =
            product.volume || "50ml";

        volumeOptions.appendChild(button);

        return;

    }

    // render volumes
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

        button.innerText = volume.size;

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

            salePrice.textContent =
                formatPrice(
                    volume.salePrice
                );

            oldPrice.textContent =
                formatPrice(
                    volume.price
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

fetchProduct();