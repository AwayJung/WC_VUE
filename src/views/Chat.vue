<template>
  <div class="chat-container">
    <div class="chat-rooms">
      <h2>채팅방 목록</h2>
      <ul v-if="rooms.length">
        <li 
          v-for="room in rooms" 
          :key="room.roomId"
          @click="enterRoom(room)"
          :class="{ active: currentRoom === room.roomId }"
        >
          채팅방 {{ room.roomId }}
        </li>
      </ul>
      <div v-else class="no-rooms">
        <p>채팅방이 없거나 로딩 중입니다.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'ChatList',  // ChatRoom에서 ChatList로 이름 변경
  props: {
    userId: {
      type: [String, Number],
      required: false
    }
  },
  computed: {
    ...mapState('chat', ['rooms', 'currentRoom'])
  },
  methods: {
    ...mapActions('chat', ['fetchUserRooms']),
    async loadRooms() {
      const userId = this.userId || this.$route.params.userId;
      console.log('Loading rooms for userId:', userId);
      
      try {
        await this.fetchUserRooms(userId);
        console.log('Loaded rooms:', this.rooms);
      } catch (error) {
        console.error('Error loading rooms:', error);
      }
    },
    enterRoom(room) {
      console.log('Entering room:', room);
      this.$router.push({
        name: 'ChatRoom',
        params: { 
          roomId: room.roomId.toString(),
          userId: this.userId || this.$route.params.userId
        }
      });
    }
  },
  created() {
    this.loadRooms();
  }
}
</script>

<style scoped>
.chat-container {
  padding: 20px;
}

.debug-panel {
  background: #f5f5f5;
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 4px;
  font-family: monospace;
}

.chat-rooms {
  background: white;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.no-rooms {
  padding: 20px;
  text-align: center;
  color: #666;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  padding: 10px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

li:hover {
  background-color: #f8f9fa;
}

li.active {
  background-color: #e3f2fd;
}
</style>