// =========================
// GET ID FROM URL
// =========================
const params = new URLSearchParams(window.location.search);
const newsId = Number(params.get("id"));

// =========================
// ELEMENTS
// =========================
const articleImg      = document.getElementById("articleImg");
const articleCategory = document.getElementById("articleCategory");
const articleDate     = document.getElementById("articleDate");
const articleAuthor   = document.getElementById("articleAuthor");
const articleTitle    = document.getElementById("articleTitle");
const articleDesc     = document.getElementById("articleDesc");
const articleContent  = document.getElementById("articleContent");
const relatedNews     = document.getElementById("relatedNews");
const breadcrumbTitle = document.getElementById("breadcrumbTitle");

// =========================
// FETCH
// =========================
async function fetchNews() {
  try {
    const res = await fetch("/data/news.json");
    const news = await res.json();

    const article = news.find(n => n.id === newsId);

    if (!article) {
      document.body.innerHTML = `
        <h1 style="text-align:center;margin-top:100px;font-family:Montserrat;">
          Không tìm thấy bài viết
        </h1>
      `;
      return;
    }

    renderArticle(article);
    renderRelated(news, article);

  } catch (err) {
    console.error(err);
  }
}

// =========================
// RENDER ARTICLE
// =========================
function renderArticle(article) {
  breadcrumbTitle.textContent = article.title;
  articleImg.src              = article.img;
  articleImg.alt              = article.title;
  articleCategory.textContent = article.category;
  articleDate.textContent     = article.date;
  articleAuthor.textContent   = article.author;
  articleTitle.textContent    = article.title;
  articleDesc.textContent     = article.desc;

  // Render content blocks
  articleContent.innerHTML = "";
  article.content.forEach(({ heading, text }) => {
    articleContent.innerHTML += `
      <div class="content-block">
        <h3>${heading}</h3>
        <p>${text}</p>
      </div>
    `;
  });
}

// =========================
// RENDER RELATED
// =========================
function renderRelated(news, current) {
  relatedNews.innerHTML = "";

  const others = news.filter(n => n.id !== current.id);

  others.forEach(({ id, title, category, date, img }) => {
    relatedNews.innerHTML += `
      <a href="./news-detail.html?id=${id}" class="related-card">
        <img src="${img}" alt="${title}">
        <div class="related-info">
          <p class="related-category">${category}</p>
          <h3>${title}</h3>
          <p class="related-date">${date}</p>
        </div>
      </a>
    `;
  });
}

// =========================
// INIT
// =========================
fetchNews();