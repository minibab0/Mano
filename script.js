// 1. 고객님이 방금 보내주신 최신 설정값 적용
const firebaseConfig = {
  apiKey: "AIzaSyDyQGHWY1t1v1yRiiJ20u1PCh6FpIuuTYQ",
  authDomain: "minibabo-9d0dc.firebaseapp.com",
  projectId: "minibabo-9d0dc",
  storageBucket: "minibabo-9d0dc.firebasestorage.app",
  messagingSenderId: "815303849059",
  appId: "1:815303849059:web:afc473357a285cc9d73456",
  measurementId: "G-J9FTRFVZ0S",
  // Realtime Database 주소 (싱가포르 서버 기준)
  databaseURL: "https://minibabo-9d0dc-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// 파이어베이스 라이브러리 불러오기
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// 내 아이디 (랜덤 생성)
const myId = Math.random().toString(36).substring(7);

// 시계 업데이트
function updateClock() {
    const now = new Date();
    document.getElementById('current-time').textContent = now.toLocaleTimeString('ko-KR', { hour12: false });
}
setInterval(updateClock, 1000);
updateClock();

let currentRoom = "";

// [방 만들기]
window.createRoom = () => {
    const name = prompt("채팅방 이름을 정해주세요:");
    if (!name) return;
    const code = Math.floor(1000 + Math.random() * 9000).toString(); // 4자리 코드
    addRoomToUI(name, code);
    alert(`방이 만들어졌어요!\n친구에게 코드 [ ${code} ]를 알려주세요.`);
};

// [코드로 입장]
window.joinRoom = () => {
    const code = prompt("친구에게 받은 4자리 코드를 입력하세요:");
    if (code) addRoomToUI("입장한 채팅방", code);
};

// 메인 화면에 방 목록 추가
function addRoomToUI(name, code) {
    const chatList = document.getElementById('chat-list');
    const emptyMsg = document.querySelector('.empty-msg');
    if (emptyMsg) emptyMsg.style.display = 'none';

    const item = document.createElement('div');
    item.className = 'chat-item';
    item.onclick = () => openChat(name, code);
    item.innerHTML = `
        <div class="profile-icon"></div>
        <div class="chat-info">
            <div class="chat-name">${name}</div>
            <div class="chat-code">코드: ${code}</div>
        </div>`;
    chatList.prepend(item);
}

// 채팅방 열기 및 실시간 연결
function openChat(name, code) {
    currentRoom = code;
    document.getElementById('main-screen').style.display = 'none';
    document.getElementById('chat-screen').style.display = 'flex';
    document.getElementById('room-name').textContent = name;
    document.getElementById('room-code-display').textContent = `코드: ${code}`;
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = ''; 

    // 서버(DB)에서 메시지 실시간 감시
    const msgRef = ref(db, `rooms/${code}/messages`);
    onChildAdded(msgRef, (snapshot) => {
        const data = snapshot.val();
        displayMessage(data.text, data.sender === myId ? 'sent' : 'received');
    });
}

// 메시지 전송
window.sendMessage = () => {
    const input = document.getElementById('message-input');
    const text = input.value.trim();
    if (!text || !currentRoom) return;

    push(ref(db, `rooms/${currentRoom}/messages`), {
        text: text,
        sender: myId,
        timestamp: Date.now()
    });
    input.value = '';
};

// 말풍선 그리기
function displayMessage(text, type) {
    const chatMessages = document.getElementById('chat-messages');
    const html = `
        <div class="message ${type}">
            <div class="message-content">${text}</div>
            ${type === 'sent' ? '<span class="read-receipt">1</span>' : ''}
        </div>`;
    chatMessages.insertAdjacentHTML('beforeend', html);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

window.closeChat = () => {
    document.getElementById('chat-screen').style.display = 'none';
    document.getElementById('main-screen').style.display = 'flex';
};
