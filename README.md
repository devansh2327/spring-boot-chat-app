# 💬 Chat-Shat — Real-Time Chat Application

A modern **real-time chat application** built using **Spring Boot + WebSockets**, featuring a clean UI, smooth UX, and instant messaging without page reloads.

> Minimal. Fast. Real-time.

---

## 🚀 Features

✨ **Real-time messaging** using WebSockets  
👤 **Username-based entry** (no login required)  
💬 **Instant message delivery** (no refresh)  
🕒 **Timestamp below every message**  
📱 **Fixed-size chat window with smooth scrolling**  
🎨 **Modern UI with clean chat bubbles**  
🔁 **Automatic scroll to latest message**  

---

## 🛠️ Tech Stack

### Backend
- **Java**
- **Spring Boot**
- **Spring WebSocket**
- **STOMP Protocol**

### Frontend
- **HTML5**
- **CSS3 (Modern Flexbox layout)**
- **Vanilla JavaScript**

### Build & Tools
- **Maven**
- **Git & GitHub**
- **Railway (Deployment)**

---

## 📂 Project Structure

```text
spring-boot-chat-app/
├── src/
│   └── main/
│       ├── java/
│       │   └── com/example/chat/
│       │       ├── ChatApplication.java
│       │       ├── config/
│       │       │   └── WebSocketConfig.java
│       │       ├── controller/
│       │       │   └── ChatController.java
│       │       └── model/
│       │           └── ChatMessage.java
│       └── resources/
│           ├── static/
│           │   ├── index.html
│           │   ├── css/
│           │   │   └── main.css
│           │   └── js/
│           │       └── main.js
│           └── application.properties
├── pom.xml
└── README.md

<img width="913" height="635" alt="Screenshot 2026-02-03 192706" src="https://github.com/user-attachments/assets/df91412b-77a0-432d-b820-0499c456b59e" />
<img width="676" height="853" alt="image" src="https://github.com/user-attachments/assets/46e8223d-184a-4d92-baa8-207974dd5939" />



