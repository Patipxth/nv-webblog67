<template>
  <div>
    <p class="fixed-logout">
      <button v-on:click="logout" class="btn btn-logout">Logout</button>
    </p>
    <h2 class="tablet-title">TABLET</h2> <!-- เปลี่ยนเป็น class -->
    
    <div v-for="blog in blogs" v-bind:key="blog.id" class="blog-container">
      <table>
        <tr>
          <td class="blog-image" style="padding-left: 100px;">
            <div v-html="blog.content"></div>
          </td>
          <td class="blog-info" style="padding-left: 370px;">
            <p>{{ blog.Name }}</p>
            <p>CPU: {{ blog.CPU }}</p>
            <p>Display: {{ blog.Display }}</p>
            <p>Operating System: {{ blog.System }}</p>
            <p>Memory: {{ blog.Memory }}</p>
            <p>Storage: {{ blog.Storage }}</p>
            <p>Screen Size: {{ blog.Size }}</p>
            <p>
              <button v-on:click="navigateTo('/blog/' + blog.id)" class="btn btn-details">Details</button>
            </p>
          </td>
        </tr>
      </table>
      <br>
    </div>
  </div>
</template>

<script>
import BlogsService from '@/services/BlogsService'

export default {
  data() {
    return {
      BASE_URL: "http://localhost:8081/assets/uploads/",
      blogs: []
    };
  },
  async created() {
    this.blogs = (await BlogsService.index()).data;
  },
  methods: {
    logout() {
      this.$store.dispatch('setToken', null);
      this.$store.dispatch('setBlog', null);
      this.$router.push({
        name: 'login'
      });
    },
    navigateTo(route) {
      this.$router.push(route);
    }
  }
};
</script>

<style scoped>
.blog-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border: 1px solid #ffffff;
  padding: 10px;
  background-color: #ffffff;
  border-radius: 10px;
}

.blog-info {
  flex: 2;
  padding-right: 20px;
}

.blog-image {
  flex: 1;
  text-align: center;
}

.blog-image img {
  max-width: 200px;
  height: auto;
  border-radius: 10px;
}

.fixed-logout {
  position: fixed; /* ล็อคตำแหน่ง */
  bottom: 20px; /* ระยะห่างจากด้านล่าง */
  right: 20px; /* ระยะห่างจากด้านขวา */
  z-index: 1000; /* ให้แน่ใจว่าปุ่มอยู่ด้านบนสุด */
}

.btn-logout {
  background-color: #000000; 
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.btn-logout:hover {
  background-color: #808080; 
}

.btn-details {
  background-color: #000000;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.btn-details:hover {
  background-color: #ffffff;
}

.tablet-title {
  text-align: center; /* จัดกลาง */
  font-size: 2.5em; /* ขนาดตัวอักษร */
  color: #000000; /* สีตัวอักษร */
  margin: 20px 0; /* ระยะห่างด้านบนและด้านล่าง */
  text-transform: uppercase; /* ทำให้เป็นตัวพิมพ์ใหญ่ทั้งหมด */
  letter-spacing: 1px; /* ระยะห่างระหว่างตัวอักษร */
  padding: 15px; /* เพิ่ม padding */
  background-color: #ffffff; /* สีพื้นหลัง */
  border-radius: 10px; /* มุมโค้ง */
  box-shadow: 0 4px 10px rgb(255, 255, 255); /* เงา */
  transition: transform 0.3s; /* เอฟเฟกต์เมื่อมีการ hover */
}

.tablet-title:hover {
  transform: scale(1.05); /* ขยายเมื่อ hover */
}

h2, h4 {
  text-align: center;
}
</style>
