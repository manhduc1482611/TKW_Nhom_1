/**
 * Bộ khởi tạo Component tự động cho website Đức Tùng Beauty
 */
class BaseComponent extends HTMLElement {
    constructor(fileUrl, scriptSrc = null) {
        super();
        this.fileUrl = fileUrl;
        this.scriptSrc = scriptSrc;
    }

    connectedCallback() {
        fetch(this.fileUrl)
            .then(response => {
                if (!response.ok) throw new Error(`Không thể tải file: ${this.fileUrl}`);
                return response.text();
            })
            .then(html => {
                // Bơm HTML của component vào lòng trang web
                this.innerHTML = html;

                // Nếu thành phần đó cần chạy thêm file xử lý JS riêng (như header.js)
                if (this.scriptSrc && !document.querySelector(`script[src="${this.scriptSrc}"]`)) {
                    const script = document.createElement("script");
                    script.src = this.scriptSrc;
                    document.body.appendChild(script);
                }
            })
            .catch(error => console.error("Lỗi Component:", error));
    }
}

// 1. Định nghĩa thẻ <main-header>
class MainHeader extends BaseComponent {
    constructor() {
        // Cấu hình: (Đường dẫn file HTML, Đường dẫn file JS bổ trợ)
        super('../components/header.html', '../js/layouts/header.js');
    }
}
customElements.define('main-header', MainHeader);

// 2. Định nghĩa thẻ <main-footer>
class MainFooter extends BaseComponent {
    constructor() {
        super('../components/footer.html'); // Nếu footer chỉ có HTML/CSS, không cần truyền file JS
    }
}
customElements.define('main-footer', MainFooter);

// 3. Định nghĩa thẻ <main-chatbot>
class MainChatbot extends BaseComponent {
    constructor() {
        super('../components/chatbot.html', '../js/layouts/chatbot.js'); // Có file xử lý tin nhắn chatbot
    }
}
customElements.define('main-chatbot', MainChatbot);