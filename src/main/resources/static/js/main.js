'use strict';

var usernamePage = document.querySelector('#username-page');
var chatPage = document.querySelector('#chat-page');
var usernameForm = document.querySelector('#usernameForm');
var messageForm = document.querySelector('#messageForm');
var messageInput = document.querySelector('#message');
var messageArea = document.querySelector('#messageArea');

var stompClient = null;
var username = null;
var lastSender = null;

/* CONNECT */
function connect(event) {
    event.preventDefault();

    username = document.querySelector('#name').value.trim();
    if (!username) return;

    usernamePage.classList.add('hidden');
    chatPage.classList.remove('hidden');

    var socket = new SockJS('/ws');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, onConnected);
}

/* CONNECTED */
function onConnected() {
    stompClient.subscribe('/topic/public', onMessageReceived);

    stompClient.send("/app/chat.addUser", {}, JSON.stringify({
        sender: username,
        type: 'JOIN'
    }));
}

/* SEND MESSAGE */
function sendMessage(event) {
    event.preventDefault();

    var content = messageInput.value.trim();
    if (!content) return;

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

/* RECEIVE MESSAGE */
function onMessageReceived(payload) {
    var message = JSON.parse(payload.body);
    var li = document.createElement('li');

    if (message.type === 'JOIN' || message.type === 'LEAVE') {
        li.classList.add('event-message');
        li.textContent = message.sender + ' joined the chat';
        messageArea.appendChild(li);
        lastSender = null;
        return;
    }

    li.classList.add('chat-message');
    if (message.sender === username) li.classList.add('self');

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

    var time = document.createElement('div');
    time.classList.add('timestamp');
    time.textContent = message.time;

    li.appendChild(bubble);
    li.appendChild(time);

    messageArea.appendChild(li);
    messageArea.scrollTop = messageArea.scrollHeight;
}

/* EVENTS */
usernameForm.addEventListener('submit', connect);
messageForm.addEventListener('submit', sendMessage);
