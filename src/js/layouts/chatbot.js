const chatbotToggleBtn = document.getElementById("chatbotToggleBtn");
const chatbotBox = document.getElementById("chatbotBox");
const chatbotCloseBtn = document.getElementById("chatbotCloseBtn");
const chatbotMessages = document.getElementById("chatbotMessages");
const chatbotOptions = document.getElementById("chatbotOptions");
const chatbotInput = document.getElementById("chatbotInput");
const chatbotSendBtn = document.getElementById("chatbotSendBtn");

let chatbotData = null;
let isFirstOpen = true;

// 1. Tải dữ liệu kịch bản từ file chatbot.json
async function loadChatbotData() {
    try {
        const response = await fetch('/data/chatbot.json'); 
        if (!response.ok) throw new Error("File json không tồn tại!");
        chatbotData = await response.json();
    } catch (error) {
        console.error("Lỗi tải kịch bản chatbot:", error);
    }
}

// 2. Sự kiện Bật / Tắt hiển thị khung Chatbot
chatbotToggleBtn.addEventListener("click", async function () {
    chatbotBox.classList.toggle("active");
    if (chatbotBox.classList.contains("active") && isFirstOpen) {
        await loadChatbotData();
        initChatbot();
        isFirstOpen = false;
    }
});

chatbotCloseBtn.addEventListener("click", function () {
    chatbotBox.classList.remove("active");
});

// 3. Khởi tạo lời chào ban đầu cho chatbot
function initChatbot() {
    chatbotMessages.innerHTML = "";
    addMessage("Xin chào quý khách thân yêu! Mình là trợ lý Nghien Skincare hỗ trợ 24/7. Bạn có thể <b>nhập câu hỏi</b> vào ô chat hoặc <b>click chọn chủ đề nhanh</b> nhé:", "bot");
    showMainQuestions();
}

function addMessage(text, sender) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("chat-msg", sender);
    msgDiv.innerHTML = text;
    chatbotMessages.appendChild(msgDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function showTypingIndicator() {
    const indicatorDiv = document.createElement("div");
    indicatorDiv.classList.add("chat-msg", "bot", "indicator-msg");
    indicatorDiv.innerHTML = `<div class="typing-indicator"><span></span><span></span><span></span></div>`;
    chatbotMessages.appendChild(indicatorDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    return indicatorDiv;
}

// 4. Hiển thị 5 CÂU HỎI CHÍNH (ID 1-5) ban đầu
function showMainQuestions() {
    chatbotOptions.innerHTML = "";
    if (!chatbotData) return;
    
    chatbotData.main_questions.forEach(item => {
        const btn = document.createElement("button");
        btn.classList.add("option-btn");
        btn.innerText = `[${item.id}] ${item.q}`;
        btn.addEventListener("click", function () {
            handleMainQuestionSelect(item);
        });
        chatbotOptions.appendChild(btn);
    });
}

// 5. Xử lý khi nhấn CÂU HỎI CHÍNH -> Bot trả lời -> Hiện danh sách câu hỏi phụ
function handleMainQuestionSelect(mainItem) {
    addMessage(mainItem.q, "user");
    const indicator = showTypingIndicator();

    setTimeout(() => {
        indicator.remove();
        addMessage(mainItem.a, "bot");
        
        chatbotOptions.innerHTML = "";
        const subQuestions = chatbotData.sub_questions[mainItem.id] || [];
        
        subQuestions.forEach(item => {
            const btn = document.createElement("button");
            btn.classList.add("option-btn");
            btn.innerText = `❓ Q.${item.id}: ${item.q}`;
            btn.addEventListener("click", function () {
                handleSubQuestionSelect(item.id, item.q, item.a, mainItem);
            });
            chatbotOptions.appendChild(btn);
        });

        chatbotOptions.appendChild(createStaticBackBtn());
    }, 600);
}

// 6. Xử lý khi lựa chọn CÂU HỎI CON
function handleSubQuestionSelect(subId, question, answer, parentMainItem) {
    addMessage(`[Q.${subId}] ${question}`, "user");
    const indicator = showTypingIndicator();

    setTimeout(() => {
        indicator.remove();
        addMessage(answer, "bot");
        
        chatbotOptions.innerHTML = "";
        
        const askMoreBtn = document.createElement("button");
        askMoreBtn.classList.add("option-btn");
        askMoreBtn.innerText = `🔄 Xem các câu hỏi khác của mục [${parentMainItem.id}]`;
        askMoreBtn.addEventListener("click", function () {
            chatbotOptions.innerHTML = "";
            const subQuestions = chatbotData.sub_questions[parentMainItem.id] || [];
            subQuestions.forEach(item => {
                const btn = document.createElement("button");
                btn.classList.add("option-btn");
                btn.innerText = `❓ Q.${item.id}: ${item.q}`;
                btn.addEventListener("click", function () {
                    handleSubQuestionSelect(item.id, item.q, item.a, parentMainItem);
                });
                chatbotOptions.appendChild(btn);
            });
            chatbotOptions.appendChild(createStaticBackBtn());
        });
        chatbotOptions.appendChild(askMoreBtn);
        chatbotOptions.appendChild(createStaticBackBtn());
    }, 600);
}

function createStaticBackBtn() {
    const backBtn = document.createElement("button");
    backBtn.classList.add("option-btn", "back-btn");
    backBtn.innerHTML = "<i class='fas fa-arrow-left'></i> Quay lại menu chính";
    backBtn.addEventListener("click", function () {
        addMessage("Quay về menu chính", "user");
        const backInd = showTypingIndicator();
        setTimeout(() => {
            backInd.remove();
            showMainQuestions();
        }, 400);
    });
    return backBtn;
}

// 7. Xử lý Ô TỰ NHẬP TIN NHẮN (Đợi admin phản hồi)
function handleManualSend() {
    const userText = chatbotInput.value.trim();
    if (userText === "") return;

    addMessage(userText, "user");
    chatbotInput.value = ""; 

    const indicator = showTypingIndicator();

    setTimeout(() => {
        indicator.remove();
        addMessage("🌸 Cảm ơn bạn đã nhắn tin! Hiện tại hệ thống tự động không hiểu câu hỏi của bạn. Vui lòng giữ máy đợi trong giây lát, <strong>Admin sẽ online đọc tin và phản hồi trực tiếp cho bạn nhé!</strong>", "bot");
    }, 1000);
}

chatbotSendBtn.addEventListener("click", handleManualSend);

chatbotInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        handleManualSend();
    }
});