<template>
  <div>
    <div class="nv-navbar">
      <ul class="nav">
        <!-- อ้างอิง router-link ไปยังหน้า blogs -->
        <li><router-link :to="{ name: 'blogs' }">HOME</router-link></li>
        <!-- แก้ไขให้ router-link ไปยังหน้าเพิ่ม motorcycle -->
        <li><router-link :to="{ name: 'blog-create' }">ADD TABLET</router-link></li>
        <li><router-link :to="{ name: 'users' }">USERS</router-link></li>
        <!-- ตรวจสอบสถานะ Login -->
        <li><router-link :to="{ name: 'login' }">LOGIN</router-link></li>  
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    isLogin() {
      return this.$store.getters.isUserLoggedIn;
    },
    logout() {
      this.$store.dispatch('logout');
      this.$router.push({ name: 'login' });
    }
  }
};
</script>

<style scoped>
/* ปรับปรุงการจัดเรียง Navbar */
.nv-navbar {
  background-color: rgb(0, 0, 0);
  padding: 10px;
  width: 100%;
}

.nv-navbar .nav {
  display: flex; /* ใช้ Flexbox แทนการ float */
  justify-content: space-around; 
  list-style: none;
  margin: 0;
  padding: 0;
}

.nv-navbar .nav li {
  margin-right: 20px; /* เพิ่มระยะห่างระหว่างไอเท็ม */
}

.nv-navbar .nav li a {
  padding: 10px;
  text-decoration: none;
  color: rgb(255, 255, 255);
  font-weight: bold;
}

.nv-navbar .nav li a:hover {
  color: rgb(255, 255, 255);
}

.nv-navbar .nav li a.router-link-active {
  background-color: rgb(255, 255, 255);
  color: rgb(0, 0, 0);
  border-radius: 2px; /* เพิ่มมุมโค้งให้กับแท็บที่เลือก */
  transition: background-color 0.3s ease, color 0.3s ease; /* เพิ่มการเปลี่ยนแปลงเมื่อมีการโต้ตอบ */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* เพิ่มเงาให้กับแท็บที่เลือก */
}

.nv-navbar .nav li a:hover {
  background-color: rgb(230, 230, 230); /* เปลี่ยนสีพื้นหลังเมื่อวางเมาส์ */
  color: rgb(0, 0, 0); /* เปลี่ยนสีตัวอักษรเมื่อวางเมาส์ */
  border-radius: 2px; /* เพิ่มมุมโค้งเมื่อวางเมาส์ */
}

/* สำหรับแท็บที่ไม่ถูกเลือก */
.nv-navbar .nav li a {
  padding: 10px 15px; /* เพิ่มระยะห่างภายในให้กับแท็บ */
  text-decoration: none; /* ไม่ให้มีเส้นใต้ */
  color: rgb(255, 255, 255); /* สีตัวอักษรสำหรับแท็บที่ไม่ถูกเลือก */
  transition: background-color 0.3s ease, color 0.3s ease; /* การเปลี่ยนแปลงเมื่อโต้ตอบ */
}

.nv-navbar .nav li a:hover {
  background-color: rgb(240, 240, 240); /* เปลี่ยนสีพื้นหลังเมื่อวางเมาส์ */
  color: rgb(0, 0, 0); /* เปลี่ยนสีตัวอักษรเมื่อวางเมาส์ */
}

</style>
