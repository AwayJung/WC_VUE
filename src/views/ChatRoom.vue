<template>
    <div class="chat-room">
      <div class="chat-header">
        <h2>채팅방 {{ roomId }}</h2>
        <button @click="goBack" class="back-btn">
          뒤로가기
        </button>
      </div>
  
      <div class="chat-messages" ref="messageContainer">
        <div v-for="message in messages" 
             :key="message.id"
             :class="['message', message.senderId === userId ? 'sent' : 'received']">
          <div class="message-content">
            <span class="sender">{{ message.senderId === userId ? '나' : '상대방' }}</span>
            <p class="text">{{ message.content }}</p>
            <span class="time">{{ formatTime(message.timestamp) }}</span>
          </div>
        </div>
      </div>
  
      <div class="chat-input">
        <input 
          v-model="newMessage" 
          @keyup.enter="sendMessage"
          placeholder="메시지를 입력하세요..."
          type="text"
        />
        <button @click="sendMessage">전송</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ChatRoom',
    props: {
      roomId: {
        type: [String, Number],
        required: true
      },
      userId: {
        type: [String, Number],
        required: true
      }
    },
    data() {
      return {
        messages: [],
        newMessage: '',
        socket: null
      }
    },
    methods: {
      initWebSocket() {
        this.socket = new WebSocket(`ws://localhost:8080/ws/chat/${this.roomId}`);
        
        this.socket.onopen = () => {
          console.log('WebSocket Connected');
          this.sendSystemMessage('JOIN');
        };
  
        this.socket.onmessage = (event) => {
          const message = JSON.parse(event.data);
          this.messages.push(message);
          this.scrollToBottom();
        };
  
        this.socket.onclose = () => {
          console.log('WebSocket Disconnected');
        };
      },
  
      sendMessage() {
        if (!this.newMessage.trim()) return;
  
        const message = {
          type: 'TALK',
          roomId: this.roomId,
          senderId: this.userId,
          content: this.newMessage,
          timestamp: new Date().toISOString()
        };
  
        this.socket.send(JSON.stringify(message));
        this.newMessage = '';
      },
  
      sendSystemMessage(type) {
        const message = {
          type,
          roomId: this.roomId,
          senderId: this.userId,
          timestamp: new Date().toISOString()
        };
        this.socket.send(JSON.stringify(message));
      },
  
      formatTime(timestamp) {
        return new Date(timestamp).toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit'
        });
      },
  
      scrollToBottom() {
        this.$nextTick(() => {
          const container = this.$refs.messageContainer;
          container.scrollTop = container.scrollHeight;
        });
      },
  
      async loadChatHistory() {
        try {
          const response = await this.$store.dispatch('chat/fetchMessages', this.roomId);
          this.messages = response.data;
          this.scrollToBottom();
        } catch (error) {
          console.error('Error loading chat history:', error);
        }
      },
  
      goBack() {
        this.$router.push(`/chat/${this.userId}`);
      }
    },
    created() {
      this.loadChatHistory();
      this.initWebSocket();
    },
    beforeDestroy() {
      if (this.socket) {
        this.sendSystemMessage('LEAVE');
        this.socket.close();
      }
    }
  }
  </script>
  
  
  <style scoped>
  .chat-room {
    display: flex;
    flex-direction: column;
    height: 100vh;
    max-width: 800px;
    margin: 0 auto;
    background: #f5f5f5;
  }
  
  .chat-header {
    padding: 1rem;
    background: #fff;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .back-btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    background: #f0f0f0;
    cursor: pointer;
  }
  
  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .message {
    max-width: 70%;
    padding: 0.5rem;
    border-radius: 8px;
    margin: 0.5rem 0;
  }
  
  .sent {
    align-self: flex-end;
    background: #007AFF;
    color: white;
  }
  
  .received {
    align-self: flex-start;
    background: white;
  }
  
  .message-content {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }
  
  .sender {
    font-size: 0.8rem;
    opacity: 0.7;
  }
  
  .text {
    margin: 0;
    word-break: break-word;
  }
  
  .time {
    font-size: 0.7rem;
    opacity: 0.7;
    align-self: flex-end;
  }
  
  .chat-input {
    padding: 1rem;
    background: white;
    display: flex;
    gap: 1rem;
    box-shadow: 0 -1px 3px rgba(0,0,0,0.1);
  }
  
  .chat-input input {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    outline: none;
  }
  
  .chat-input button {
    padding: 0.5rem 1rem;
    background: #007AFF;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .chat-input button:hover {
    background: #0056b3;
  }
  </style>