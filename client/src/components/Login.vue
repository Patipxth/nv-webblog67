<template>
  <div class="login-container">
    <h1 class="login-title">User Login</h1>
    <form @submit.prevent="onLogin" class="login-form">
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          v-model="password"
          required
        />
      </div>
      <button type="submit" class="btn btn-primary">Login</button>
      <div class="error" v-if="error">{{ error }}</div>
    </form>
    <div class="signup-container">
      <p><button @click="goToSignUp" class="btn btn-signup">Sign Up</button></p>
    </div>
  </div>
</template>

<script>
import AuthenService from "../services/AuthenService";
export default {
  data() {
    return {
      email: "",
      password: "",
      error: null,
    };
  },
  methods: {
    async onLogin() {
      try {
        const response = await AuthenService.login({
          email: this.email,
          password: this.password,
        });

        this.$store.dispatch("setToken", response.data.token);
        this.$store.dispatch("setUser", response.data.user);

        this.$router.push({
          name: "users",
        });
      } catch (error) {
        console.log(error);
        this.error = error.response.data.error;
        this.email = "";
        this.password = "";
      }
    },
    goToSignUp() {
      this.$router.push({ name: "user-create" }); // ใช้ชื่อเส้นทางที่กำหนดไว้ใน router เพื่อไปยังหน้าสมัครสมาชิก
    },
  },
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.login-title {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
}

label {
  margin-bottom: 5px;
  font-weight: bold;
}

input[type="email"],
input[type="password"] {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

input[type="email"]:focus,
input[type="password"]:focus {
  border-color: #000000;
  outline: none;
}

.btn {
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
  width: 100%;
}

.btn-primary {
  background-color: #000000;
  color: white;
}

.btn-signup {
  background-color: #000000;
  color: white;
  margin-top: 10px;
}

.btn-signup:hover {
  background-color: #333333;
}

.error {
  color: red;
  margin-top: 10px;
  text-align: center;
}
</style>
