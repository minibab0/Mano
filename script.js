// 1. 메인 화면 현재 시간 표시 로직
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('current-time').textContent = `${hours}:${minutes}:${seconds}`;
}

// 1초마다 시계 업데이트
setInterval(updateClock, 1000);
updateClock(); // 초기 실행

// 2. 화면 전환 로직 (채팅 목록 <-> 채팅방)
const mainScreen = document.getElementById('main-screen');
const chatScreen = document.getElementById('chat-screen');
const roomNameDisplay = document.getElementById('room-name');

function openChat(roomName) {
    mainScreen.style.display = 'none';
    chatScreen.style.display = 'flex';
    roomNameDisplay.textContent = roomName;
    
    // 채팅방에 들어올 때 스크롤을 맨 아래로 내림
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function closeChat() {
    chatScreen.style.display = 'none';
    mainScreen.style.display = 'flex';
}

// 3. 임시 메시지 전송 및 타이핑 표시 로직
const messageInput = document.getElementById('message-input');
const typingIndicator = document.getElementById('typing-indicator');
const chatMessages = document.getElementById('chat-messages');

function checkTyping() {
    // 사용자가 타자를 치고 있으면 (글자가 1개라도 있으면) 표시
    if (messageInput.value.length > 0) {
        typingIndicator.style.display = 'block';
    } else {
        typingIndicator.style.display = 'none';
    }
}

function sendMessage() {
    const text = messageInput.value.trim();
    if (text === '') return;

    // 내가 보낸 메시지 HTML 생성 (안읽음 표시 '1' 포함)
    const messageHTML = `
        <div class="message sent">
            <div class="message-content">${text}</div>
            <span class="read-receipt">1</span>
        </div>
    `;

    // 타이핑 표시 위에 메시지 추가
    typingIndicator.insertAdjacentHTML('beforebegin', messageHTML);
    
    // 입력창 초기화 및 스크롤 내리기
    messageInput.value = '';
    typingIndicator.style.display = 'none';
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
