package com.example.chat.config;

import com.example.chat.chat.ChatMessage;
import com.example.chat.chat.MessageType;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
public class WebSocketEventListener {

    private SimpMessageSendingOperations messageTemplate;

    public WebSocketEventListener(SimpMessageSendingOperations messageTemplate) {
        this.messageTemplate = messageTemplate;
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {

        StompHeaderAccessor headerAccessor =
                StompHeaderAccessor.wrap(event.getMessage());

        if (headerAccessor.getSessionAttributes() == null) return;

        String username =
                (String) headerAccessor.getSessionAttributes().get("username");

        if (username != null) {
            System.out.println("User disconnected: " + username);

            ChatMessage chatMessage = new ChatMessage();
            chatMessage.setSender(username);
            chatMessage.setType(MessageType.LEAVE);

            messageTemplate.convertAndSend("/topic/public", chatMessage);
        }
    }
}
