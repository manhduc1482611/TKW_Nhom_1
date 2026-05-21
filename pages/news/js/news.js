const newsGrid = document.getElementById("newsGrid");

async function fetchNews() {
  try {
    const res = await fetch("../../../data/news.json");
    const news = await res.json();
    renderNews(news);
  } catch (err) {
    console.error(err);
    newsGrid.innerHTML = `<div style="text-align:center;padding:60px;color:#999;">Không thể tải bài viết.</div>`;
  }
}

function renderNews(news) {
  newsGrid.innerHTML = "";

  news.forEach(({ id, title, category, date, author, img, desc }) => {
    newsGrid.innerHTML += `
      <a href="./news-detail.html?id=${id}" class="news-card">
        <div class="news-img-wrap">
          <img src="${img}" alt="${title}">
          <span class="news-category">${category}</span>
        </div>
        <div class="news-content">
          <div class="news-meta">
            <span><i class="fa-regular fa-calendar"></i>${date}</span>
            <span><i class="fa-regular fa-user"></i>${author}</span>
          </div>
          <h2 class="news-title">${title}</h2>
          <p class="news-desc">${desc}</p>
          <span class="news-read-more">Đọc thêm <i class="fa-solid fa-arrow-right"></i></span>
        </div>
      </a>
    `;
  });
}

fetchNews();