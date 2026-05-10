/**
 * Hàm nạp thành phần HTML vào một thẻ chỉ định
 * @param {string} elementId - ID của thẻ HTML sẽ chứa nội dung
 * @param {string} filePath - Đường dẫn đến file .html cần nạp
 */
async function loadComponent(elementId, filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Không thể tải file: ${filePath} (Status: ${response.status})`);
        }
        const data = await response.text();
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = data;
        } else {
            console.warn(`Cảnh báo: Không tìm thấy thẻ HTML có ID "${elementId}" để chèn nội dung.`);
        }
    } catch (error) {
        console.error('Lỗi khi nạp thành phần:', error);
    }
}

// Thực thi nạp Header và Footer
document.addEventListener("DOMContentLoaded", () => {
    // Đường dẫn tương đối tính từ index.html (nằm trong thư mục src)
    loadComponent('header-placeholder', '../../components/header.html');
    loadComponent('footer-placeholder', '../../components/footer.html');
});