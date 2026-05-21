document.getElementById('sendBtn').addEventListener('click', function() {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    // Lệnh này bắt trình duyệt kiểm tra các ô có thuộc tính 'required'
    // Nếu trống hoặc sai định dạng email, nó sẽ hiện bong bóng ngay lập tức
    if (!nameInput.reportValidity()) return;
    if (!emailInput.reportValidity()) return;
    if (!messageInput.reportValidity()) return;

    // Chỉ khi tất cả các ô trên đã điền đúng, đoạn code dưới đây mới chạy
    const btn = this;
    btn.innerText = "Đang gửi...";
    btn.disabled = true;

    setTimeout(() => {
        alert(`Cảm ơn ${nameInput.value}! Tin nhắn của bạn đã được gửi.`);
        
        // Xóa nội dung sau khi gửi
        nameInput.value = "";
        emailInput.value = "";
        messageInput.value = "";
        
        btn.innerText = "Gửi";
        btn.disabled = false;
    }, 1500);
});