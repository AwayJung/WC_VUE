<template>
    <div class="chat-container">
      <div class="chat-rooms">
        <h2>채팅방 목록</h2>
        <ul>
          <li v-for="room in rooms" :key="room.id" @click="enterRoom(room.id)">
            {{ room.name }}
          </li>
        </ul>
      </div>
      <chat-room v-if="currentRoom" :roomId="currentRoom" />
    </div>
  </template>
  
  <script>
  import ChatRoom from '@/components/chat/ChatRoom.vue'  
  
  export default {
    name: 'AboutChat',  
    components: {
      ChatRoom
    },
    data() {
      return {
        rooms: [
          { id: 1, name: '채팅방 1' },
          { id: 2, name: '채팅방 2' }
        ],
        currentRoom: null
      }
    },
    methods: {
      enterRoom(roomId) {
        this.currentRoom = roomId
      }
    }
  }
  </script>
  
  <style scoped>
  .chat-container {
    padding: 20px;
  }
  
  .chat-rooms ul {
    list-style: none;
    padding: 0;
  }
  
  .chat-rooms li {
    cursor: pointer;
    padding: 10px;
    border-bottom: 1px solid #eee;
  }
  </style>