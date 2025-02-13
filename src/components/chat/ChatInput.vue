<!-- <template>
    <div class="chat-input">
      <input 
        v-model="message" 
        @keyup.enter="send"
        placeholder="메시지를 입력하세요..."
      >
      <button @click="send">전송</button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ChatInput',
    data() {
      return {
        message: ''
      }
    },
    methods: {
      send() {
        if (!this.message.trim()) return
        this.$emit('send', this.message)
        this.message = ''
      }
    }
  }
  </script> -->
