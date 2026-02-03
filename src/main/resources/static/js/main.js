'use strict';

var usernamePage = document.querySelector('#username-page');
var chatPage = document.querySelector('#chat-page');
var usernameForm = document.querySelector('#usernameForm');
var messageForm = document.querySelector('#messageForm');
var messageInput = document.querySelector('#message');
var messageArea = document.querySelector('#messageArea');
var connectingElement = document.querySelector('.connecting');

var stompClient = null;
var username = null;

var lastSender = null;
var lastDateLabel = null;

/* ---------- CONNECT ---------- */
function connect(event) {
    event.preventDefault();

    username = document.querySelector('#name').value.trim();
    if (!username) return;

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
    connectingElement.textContent = 'Connection failed. Refresh and try again.';
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
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toDateString(),
        status: 'sent'
    }));

    messageInput.value = '';
}

/* ---------- RECEIVE MESSAGE ---------- */
function onMessageReceived(payload) {
    var message = JSON.parse(payload.body);

    /* DATE SEPARATOR */
    if (message.date !== lastDateLabel) {
        var dateDivider = document.createElement('li');
        dateDivider.classList.add('date-divider');
        dateDivider.textContent = formatDateLabel(message.date);
        messageArea.appendChild(dateDivider);
        lastDateLabel = message.date;
        lastSender = null;
    }

    var li = document.createElement('li');

    if (message.type === 'JOIN' || message.type === 'LEAVE') {
        li.classList.add('event-message');
        li.textContent =
            message.sender + (message.type === 'JOIN' ? ' joined' : ' left');
        messageArea.appendChild(li);
        return;
    }

    li.classList.add('chat-message');
    var isSelf = message.sender === username;
    if (isSelf) li.classList.add('self');

    /* HIDE NAME IF SAME SENDER */
    if (message.sender !== lastSender) {
        var sender = document.createElement('div');
        sender.classList.add('sender-name');
        sender.textContent = message.sender;
        li.appendChild(sender);
        lastSender = message.sender;
    }

    var bubble = document.createElement('div');
    bubble.classList.add('bubble');
    bubble.textContent = message.content;

    var meta = document.createElement('div');
    meta.classList.add('meta');

    var time = document.createElement('span');
    time.textContent = message.time;

    var ticks = document.createElement('span');
    ticks.classList.add('ticks');
    ticks.textContent = isSelf ? '✔✔' : '';

    meta.appendChild(time);
    meta.appendChild(ticks);

    bubble.appendChild(meta);
    li.appendChild(bubble);

    messageArea.appendChild(li);
    messageArea.scrollTop = messageArea.scrollHeight;
}

/* ---------- DATE LABEL ---------- */
function formatDateLabel(dateStr) {
    var today = new Date().toDateString();
    var yesterday = new Date(Date.now() - 86400000).toDateString();

    if (dateStr === today) return 'Today';
    if (dateStr === yesterday) return 'Yesterday';
    return dateStr;
}

/* ---------- EMOJI PICKER ---------- */
var emojiBtn = document.querySelector('#emoji-btn');
var emojiBox = document.querySelector('#emoji-box');

emojiBtn.addEventListener('click', () => {
    emojiBox.classList.toggle('hidden');
});

emojiBox.addEventListener('click', (e) => {
    if (e.target.classList.contains('emoji')) {
        messageInput.value += e.target.textContent;
        messageInput.focus();
    }
});

/* ---------- EVENTS ---------- */
usernameForm.addEventListener('submit', connect);
messageForm.addEventListener('submit', sendMessage);
