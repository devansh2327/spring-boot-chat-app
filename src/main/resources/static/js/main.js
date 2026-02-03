'use strict';

var usernamePage = document.querySelector('#username-page');
var chatPage = document.querySelector('#chat-page');
var usernameForm = document.querySelector('#usernameForm');
var messageForm = document.querySelector('#messageForm');
var messageInput = document.querySelector('#message');
var messageArea = document.querySelector('#messageArea');
var connectingElement = document.querySelector('.connecting');
var typingElement = document.querySelector('#typing');

var stompClient = null;
var username = null;
var typingTimeout = null;

/* ---------- CONNECT ---------- */
function connect(event) {
    event.preventDefault();

    username = document.querySelector('#name').value.trim();
    if (!username) return;

    // SAME logic as your original working version
    usernamePage.classList.add('hidden');
    chatPage.classList.remove('hidden');

    var socket = new SockJS('/ws');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, onConnected, onError);
}


/* ---------- CONNECTED ---------- */
function onConnected() {
    stompClient.subscribe('/topic/public', onMessageReceived);

    stompClient.send("/app/chat.addUser", {}, JSON.stringify({
        sender: username,
        type: 'JOIN'
    }));

    connectingElement.classList.add('hidden');
}

/* ---------- ERROR ---------- */
function onError() {
    connectingElement.textContent =
        'Could not connect. Please refresh and try again.';
    connectingElement.style.color = 'red';
}

/* ---------- SEND MESSAGE ---------- */
function sendMessage(event) {
    event.preventDefault();

    var content = messageInput.value.trim();
    if (!content || !stompClient) return;

    stompClient.send("/app/chat.sendMessage", {}, JSON.stringify({
        sender: username,
        content: content,
        type: 'CHAT',
        time: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        })
    }));

    messageInput.value = '';
}

/* ---------- RECEIVE MESSAGE ---------- */
function onMessageReceived(payload) {
    var message = JSON.parse(payload.body);
    var li = document.createElement('li');

    if (message.type === 'JOIN' || message.type === 'LEAVE') {
        li.classList.add('event-message');
        li.textContent =
            message.sender +
            (message.type === 'JOIN' ? ' joined' : ' left');
    } else {
        li.classList.add('chat-message');
        if (message.sender === username) li.classList.add('self');

        var bubble = document.createElement('p');
        bubble.textContent = message.content;

        var time = document.createElement('div');
        time.classList.add('timestamp');
        time.textContent = message.time || '';

        bubble.appendChild(time);
        li.appendChild(bubble);
    }

    messageArea.appendChild(li);
    messageArea.scrollTop = messageArea.scrollHeight;
}

/* ---------- TYPING INDICATOR ---------- */
messageInput.addEventListener('input', () => {
    typingElement.classList.remove('hidden');
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        typingElement.classList.add('hidden');
    }, 800);
});

/* ---------- EVENTS ---------- */
usernameForm.addEventListener('submit', connect);
messageForm.addEventListener('submit', sendMessage);
