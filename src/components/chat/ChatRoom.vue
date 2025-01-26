<template>
    <div class="chat-room">
      <div class="messages" ref="messageContainer">
        <div v-for="msg in messages" :key="msg.id" :class="['message', msg.type]">
          <span class="user">{{ msg.user }}</span>
          <p class="content">{{ msg.content }}</p>
          <span class="time">{{ msg.time }}</span>
        </div>
      </div>
      <chat-input @send="sendMessage" />
    </div>
  </template>
  
  <script>
  import ChatInput from './ChatInput.vue'
  
  export default {
    name: 'ChatRoom',
    components: {
      ChatInput
    },
    props: {
      roomId: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        messages: []
      }
    },
    methods: {
      sendMessage(content) {
        const message = {
          id: Date.now(),
          user: 'User',
          content,
          time: new Date().toLocaleTimeString(),
          type: 'sent'
        }
        this.messages.push(message)
        this.scrollToBottom()
      },
      scrollToBottom() {
        this.$nextTick(() => {
          const container = this.$refs.messageContainer
          container.scrollTop = container.scrollHeight
        })
      }
    }
  }
  </script>