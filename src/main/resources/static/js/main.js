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

/* ---------- CONNECT ---------- */
function connect(event) {
    event.preventDefault();

    username = document.querySelector('#name').value.trim();
    if (!username) return;

    // Hide username page, show chat
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

    // JOIN / LEAVE messages
    if (message.type === 'JOIN' || message.type === 'LEAVE') {
        li.classList.add('event-message');
        li.textContent =
            message.sender +
            (message.type === 'JOIN' ? ' joined the chat' : ' left the chat');
    }
    // CHAT messages
    else {
        li.classList.add('chat-message');
        if (message.sender === username) {
            li.classList.add('self');
        }

        // sender name
        var sender = document.createElement('div');
        sender.classList.add('sender-name');
        sender.textContent = message.sender;

        // bubble
        var bubble = document.createElement('div');
        bubble.classList.add('bubble');
        bubble.textContent = message.content;

        // timestamp BELOW message
        var time = document.createElement('div');
        time.classList.add('timestamp');
        time.textContent = message.time || '';

        li.appendChild(sender);
        li.appendChild(bubble);
        li.appendChild(time);
    }

    messageArea.appendChild(li);
    messageArea.scrollTop = messageArea.scrollHeight;
}

/* ---------- EVENTS ---------- */
usernameForm.addEventListener('submit', connect);
messageForm.addEventListener('submit', sendMessage);
