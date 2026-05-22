document.addEventListener("DOMContentLoaded", () => {

  /* =========================================
     HELPER: tạo slug từ tên
  ========================================= */
  function toSlug(str) {
    return str
      .toLowerCase()
      .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, "a")
      .replace(/[èéẹẻẽêềếệểễ]/g, "e")
      .replace(/[ìíịỉĩ]/g, "i")
      .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, "o")
      .replace(/[ùúụủũưừứựửữ]/g, "u")
      .replace(/[ýỳỵỷỹ]/g, "y")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  }

  /* =========================================
     DATA
  ========================================= */

  const categories = [
    { name: "Cleanser",       img: "assets/images/home/pic/srm.jpg",        category: "Sữa rửa mặt"    },
    { name: "Micellar Water", img: "assets/images/home/pic/nuoctaytrang.jpg", category: "Nước tẩy trang" },
    { name: "Toner",          img: "assets/images/home/pic/toner.jpg",       category: "Tonner"          },
    { name: "Sunscreen",      img: "assets/images/home/pic/kcn.jpg",         category: "Kem chống nắng" },
    { name: "Moisturizer",    img: "assets/images/home/pic/kemduong.jpg",    category: "Kem dưỡng"      },
  ];

  const brands = [
    { name: "La Roche-Posay", img: "assets/images/home/pic/LRP.jpg" },
    { name: "Vichy",          img: "assets/images/home/pic/vichi.jpg" },
    { name: "Eucerin",        img: "assets/images/home/pic/ecurin.jpg" },
    { name: "Avène",          img: "assets/images/home/pic/avene.jpg" },
    { name: "SVR",            img: "assets/images/home/pic/svr.jpg" },
    { name: "Bioderma",       img: "assets/images/home/pic/bioderma.jpg" },
    { name: "Cetaphil",       img: "assets/images/home/pic/cetaphil.jpg" },
    { name: "CeraVe",         img: "assets/images/home/pic/cerave.jpg" },
    { name: "Hada Labo",      img: "assets/images/home/pic/hadalabo.jpg" },
    { name: "Senka",          img: "assets/images/home/pic/senka.jpg" },
    { name: "Innisfree",      img: "assets/images/home/pic/Innisfree.jpg" },
    { name: "Some By Mi",     img: "assets/images/home/pic/Some By Mi.jpg" },
    { name: "Skin1004",       img: "assets/images/home/pic/Skin1004.jpg" },
    { name: "Cocoon",         img: "assets/images/home/pic/Cocoon.jpg" },
    { name: "Simple",         img: "assets/images/home/pic/Simple.jpg" },
  ];

  const bestSellers = [
    { id: 1,  name: "Sữa rửa mặt",    price: "$22.00", badge: "Best Seller", img: "assets/images/products/sua-rua-mat/1.1.jpg" },
    { id: 21,  name:"Kem dưỡng La Roche-Posay Cicaplast Baume B5+",     price: "365.000", badge: "Hot",         img: "assets/images/products/kem-duong/21.1.jpg" },
    { id: 41,  name: "Nước cân bằng Bioderma", price: "360.000", badge: "Trending",    img: "assets/images/products/toner/41.1.jpg" },
    { id: 61, name: "Kem Chống Nắng Skin1004 Madagascar Centella Air-Fit Suncream Plus", price: "465000",badge: "Popular",     img: "assets/images/products/kem-chong-nang/61.1.jpg" },
    { id: 81,name: "Nước Tẩy Trang Cocoon Bí Đao" ,price: "299000", badge: "New",         img: "assets/images/products/nuoc-tay-trang/81.1.jpg" },
  ];

  const news = [
    {
      id: 1,
      img: "assets/images/home/pic/tintuc1.png",
      title: "Cách sử dụng kem chống nắng để sở hữu làn da khỏe đẹp",
      desc: "Dùng kem chống nắng đúng cách sẽ giúp da luôn khỏe mạnh, hạn chế lão hóa và bảo vệ da trước tia UV.",
    },
    {
      id: 2,
      img: "assets/images/home/pic/tintuc2.png",
      title: 'Serum Vitamin C - "Thần dược" cho làn da sáng khỏe',
      desc: "Serum Vitamin C hỗ trợ phục hồi da, làm sáng da và giúp da căng bóng tự nhiên hơn mỗi ngày.",
    },
    {
      id: 3,
      img: "assets/images/home/pic/tintuc3.jpg",
      title: "Quy trình skincare cho làn da nhạy cảm",
      desc: "Các bước chăm sóc da cơ bản giúp giảm kích ứng, phục hồi và bảo vệ làn da nhạy cảm hiệu quả.",
    },
  ];

  /* =========================================
     RENDER HELPERS
  ========================================= */
  function el(tag, cls, html = "") {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html) e.innerHTML = html;
    return e;
  }

  /* =========================================
     CATEGORIES
  ========================================= */
  const categoriesGrid = document.getElementById("categoriesGrid");

  if (categoriesGrid) {
    categories.forEach(({ name, img, category }) => {
      const item = document.createElement("a");
      item.className = "category-item";
      item.href = `pages/product/html/products.html?category=${encodeURIComponent(category)}`;
      item.title = name;
      item.innerHTML = `
        <div class="category-circle">
          <img src="${img}" class="category-img" alt="${name}">
        </div>
        <p class="category-name">${name}</p>
      `;
      categoriesGrid.appendChild(item);
    });
  }

  /* =========================================
     BRANDS
     Click → pages/product/html/products.html?brand=La Roche-Posay
  ========================================= */
  const brandsTrack = document.getElementById("brandsTrack");

  function createBrandCard(name, img, isClone = false) {
    const card = document.createElement("a");
    card.className = "brand-card";
    // Dùng tên gốc (không slug) để match đúng với brandFilter trong products.js
    card.href = `pages/product/html/products.html?brand=${encodeURIComponent(name)}`;
    card.title = name;
    if (isClone) card.setAttribute("aria-hidden", "true");
    card.innerHTML = `
      <div class="brand-img-wrap">
        <img src="${img}" class="brand-img" alt="${name}">
      </div>
      <p class="brand-name">${name}</p>
    `;
    return card;
  }

  if (brandsTrack) {
    brands.forEach(({ name, img }) => {
      brandsTrack.appendChild(createBrandCard(name, img));
    });

    // Clone để loop vô hạn
    brands.forEach(({ name, img }) => {
      brandsTrack.appendChild(createBrandCard(name, img, true));
    });

    let pos = 0;
    let paused = false;
    const speed = 0.5;

    brandsTrack.parentElement.addEventListener("mouseenter", () => paused = true);
    brandsTrack.parentElement.addEventListener("mouseleave", () => paused = false);

    function scrollBrands() {
      if (!paused) {
        pos += speed;
        const half = brandsTrack.scrollWidth / 2;
        if (pos >= half) pos = 0;
        brandsTrack.style.transform = `translateX(-${pos}px)`;
      }
      requestAnimationFrame(scrollBrands);
    }

    requestAnimationFrame(scrollBrands);
  }

  /* =========================================
     BEST SELLERS
     Click → pages/product/html/product-detail.html?id=1
  ========================================= */
  const bestGrid = document.getElementById("bestGrid");

  if (bestGrid) {
    bestSellers.forEach(({ id, name, price, badge, img }) => {
      const card = document.createElement("a");
      card.className = "best-card";
      card.href = `pages/product/html/product-detail.html?id=${id}`;
      card.title = name;
      card.innerHTML = `
        <div class="best-img-wrap">
          <img src="${img}" class="best-img" alt="${name}">
          <span class="best-badge">${badge}</span>
        </div>
        <div class="best-info">
          <h3 class="best-name">${name}</h3>
          <p class="best-price">${price}</p>
          <div class="best-stars">★★★★★</div>
        </div>
      `;
      bestGrid.appendChild(card);
    });
  }

  /* =========================================
     NEWS
  ========================================= */
  const newsGrid = document.getElementById("newsGrid");

  if (newsGrid) {
    news.forEach(({ id, img, title, desc }) => {
      const card = el("a", "news-card");
      card.href = `pages/news/html/news-detail.html?id=${id}`;
      card.innerHTML = `
        <div class="news-img-wrap">
          <img src="${img}" class="news-img" alt="${title}">
        </div>
        <div class="news-content">
          <h3 class="news-title">${title}</h3>
          <p class="news-desc">${desc}</p>
        </div>
      `;
      newsGrid.appendChild(card);
    });
  }

  /* =========================================
     HAMBURGER
  ========================================= */
  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("mobileNav");

  if (hamburger && mobileNav) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("open");
      mobileNav.classList.toggle("open");
    });
  }

  /* =========================================
     HEADER SCROLL
  ========================================= */
  const header = document.querySelector(".site-header");

  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 20);
  });

  /* =========================================
     BANNER SLIDER
  ========================================= */
  const banners = document.querySelectorAll(".banner-img");
  let currentBanner = 0;

  setInterval(() => {
    banners[currentBanner].classList.remove("active");
    currentBanner = (currentBanner + 1) % banners.length;
    banners[currentBanner].classList.add("active");
  }, 2500);

});