<template>
  <div class="container">
    <h1 class="page-title">Users</h1>
    <hr>
    <div v-if="users.length" class="user-summary">
      <div><b>จำนวนผู้ใช้งาน:</b> {{ users.length }}</div>
    </div>

    <div class="user-list">
      <div v-for="user in users" v-bind:key="user.id" class="user-card">
        <div class="user-info">
          <div><b>ID:</b> {{ user.id }}</div>
          <div><b>ชื่อผู้ใช้:</b> {{ user.name }} {{ user.lastname }}</div>
          <div><b>อีเมล:</b> {{ user.email }}</div>
          <div><b>Status:</b> {{ user.status }}</div>
        </div>
        <div class="user-actions">
          <button class="btn btn-view" v-on:click="navigateTo('/user/' + user.id)">ดูข้อมูล</button>
          <button class="btn btn-edit" v-on:click="navigateTo('/user/edit/' + user.id)">แก้ไขข้อมูล</button>
          <button class="btn btn-delete" v-on:click="deleteUser(user)">ลบข้อมูล</button>
        </div>
        <hr>
      </div>
    </div>

    <div class="logout-button">
      <button class="btn btn-logout" v-on:click="logout">Logout</button>
    </div>
  </div>
</template>

<script>
import UsersService from "@/services/UsersService";
export default {
  data() {
    return {
      users: []
    }
  },
  async created() {
    try {
      this.users = (await UsersService.index()).data;
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('setToken', null)
      this.$store.dispatch('setUser', null)
      this.$router.push({ name: 'login' })
    },
    navigateTo(route) {
      this.$router.push(route);
    },
    async deleteUser(user) {
      let result = confirm("คุณต้องการลบข้อมูลใช่หรือไม่?");
      if (result) {
        try {
          await UsersService.delete(user);
          this.refreshData();
        } catch (err) {
          console.log(err);
        }
      }
    },
    async refreshData() {
      try {
        this.users = (await UsersService.index()).data;
      } catch (err) {
        console.log(err);
      }
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.page-title {
  text-align: center;
  color: #333;
}

.user-summary {
  margin-bottom: 20px;
}

.user-list {
  margin-top: 20px;
}

.user-card {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  transition: transform 0.2s;
}

.user-card:hover {
  transform: scale(1.02);
}

.user-info {
  margin-bottom: 10px;
}

.user-actions {
  display: flex;
  justify-content: space-between;
}

.btn {
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.btn-view {
  background-color: #000000;
  color: white;
}

.btn-edit {
  background-color: #000000;
  color: white;
}

.btn-delete {
  background-color: #000000;
  color: white;
}

.btn:hover {
  opacity: 0.8;
}

.logout-button {
  text-align: center;
  margin-top: 20px;
}

.btn-logout {
  background-color: #000;
  color: white;
}
</style>
