<template>
  <div class="container">
    <h1 class="page-title">User</h1>
    <div class="user-details">
      <p><strong>ID:</strong> {{ user.id }}</p>
      <p><strong>Name:</strong> {{ user.name }}</p>
      <p><strong>Lastname:</strong> {{ user.lastname }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Password:</strong> {{ user.password }}</p>
      <p><strong>Status:</strong> {{ user.status }}</p>
      <p><strong>Type:</strong> {{ user.type }}</p>
      <p><strong>Created At:</strong> {{ user.createdAt }}</p>
    </div>
    <div class="button-container">
      <button class="btn btn-edit" @click="editUser">แก้ไขข้อมูล</button>
      <button class="btn btn-back" @click="goBack">กลับ</button>
    </div>
  </div>
</template>

<script>
import UsersService from "@/services/UsersService";

export default {
  data() {
    return {
      user: {}
    };
  },
  async created() {
    try {
      const userId = this.$route.params.userId;
      this.user = (await UsersService.show(userId)).data;
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    editUser() {
      this.$router.push({ name: 'user-edit', params: { userId: this.user.id } });
    },
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.page-title {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.user-details {
  margin-bottom: 20px;
}

.user-details p {
  font-size: 16px;
  line-height: 1.5;
  margin: 5px 0;
}

strong {
  color: #555;
}

.button-container {
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

.btn-edit {
  background-color: #000000;
  color: white;
}

.btn-back {
  background-color: #000000;
  color: white;
}

.btn:hover {
  opacity: 0.8;
}
</style>
