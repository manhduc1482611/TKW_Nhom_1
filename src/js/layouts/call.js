fetch('/src/components/header.html')
    .then(res => res.text())
    .then(html => {
        document.getElementById('header').innerHTML = html;
        // Nạp kèm file script xử lý active menu & giỏ hàng của header
        const s = document.createElement('script');
        s.src = '/src/js/layouts/header.js';
        document.body.appendChild(s);
    });
fetch('/src/components/footer.html')
    .then(res => res.text())
    .then(html => {
        document.getElementById('footer').innerHTML = html;
        const s = document.createElement('script');
        s.src = '/src/js/layouts/footer.js';
        document.body.appendChild(s);
    });
fetch('/src/components/chatbot.html')
    .then(res => res.text())
    .then(html => {
        document.getElementById('chatbot').innerHTML = html;
        const s = document.createElement('script');
        s.src = '/src/js/layouts/chatbot.js';
        document.body.appendChild(s);
    });