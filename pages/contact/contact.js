document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    if (!nameInput.reportValidity()) return;
    if (!emailInput.reportValidity()) return;
    if (!messageInput.reportValidity()) return;

    const btn = document.getElementById('sendBtn');
    btn.innerText = "Đang gửi...";
    btn.disabled = true;

    setTimeout(() => {
        alert(`Cảm ơn ${nameInput.value}! Tin nhắn của bạn đã được gửi.`);

        nameInput.value = "";
        emailInput.value = "";
        messageInput.value = "";

        btn.innerText = "Gửi";
        btn.disabled = false;
    }, 1500);
});