<template>
  <div>
    <div class="blog-container">
      <div class="blog-info">
        <p>id: {{ blog.id }}</p>
        <p>{{ blog.Name }}</p>
        <p>CPU: {{ blog.CPU }}</p>
        <p>Display: {{ blog.Display }}</p>
        <p>Operating System: {{ blog.System }}</p>
        <p>Memory: {{ blog.Memory }}</p>
        <p>Storage: {{ blog.Storage }}</p>
        <p>Screen Size: {{ blog.Size }}</p>
      </div>

      <div class="blog-image">
        <!-- ใช้ content ในการแสดงรูปภาพ -->
        <div v-html="blog.content"></div>
      </div>
    </div>
    <div class="button-container">
      <button v-on:click="navigateTo('/blog/edit/' + blog.id)">Edit</button>
      <button v-on:click="deleteBlog(blog)">Delete</button>
      <button v-on:click="navigateTo('/blogs')">Back</button>
    </div>
  </div>
</template>

<script>
import BlogsService from "@/services/BlogsService";
export default {
  data() {
    return {
      blog: null,
    };
  },
  async created() {
    try {
      let blogId = this.$route.params.blogId;
      this.blog = (await BlogsService.show(blogId)).data;
    } catch (error) {
      console.log(error);
    }
  },
  methods: {
    navigateTo(route) {
      this.$router.push(route);
    },
    async deleteBlog(blog) {
      let result = confirm("Want to delete?");
      if (result) {
        try {
          await BlogsService.delete(blog);
          this.$router.push('/blogs'); // Navigate back to All motorcycle page
        } catch (err) {
          console.log(err);
        }
      }
    }
  },
};
</script>

<style scoped>
.blog-container {
  display: flex;
  justify-content: space-between; /* ให้ข้อมูลและรูปภาพมีระยะห่าง */
  align-items: flex-start;
  border: 1px solid #ccc;
  padding: 100px;
  margin-bottom: 40px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* เพิ่มเงาให้กับ container */
  transition: transform 0.3s; /* เพิ่มการเคลื่อนไหวเมื่อ hover */
}

.blog-container:hover {
  transform: translateY(-5px); /* ทำให้ container ขยับขึ้นเมื่อ hover */
}

.blog-info {
  flex: 1;
  padding-right: 20px;
}

.blog-image {
  flex: 0 0 250px; /* กำหนดขนาดของรูปภาพ */
  display: flex;
  justify-content: center;
}

.blog-image img {
  max-width: 100%;
  height: auto;
  border-radius: 5px; /* ทำให้ภาพมีมุมโค้งเล็กน้อย */
}

.button-container {
  display: flex;
  justify-content: center; /* จัดปุ่มให้ตรงกลาง */
  padding-top: 20px; /* เพิ่มระยะห่างจากเนื้อหา */
}

button {
  margin-right: 10px;
  padding: 10px 15px;
  background-color: #000000; /* เปลี่ยนสีปุ่ม */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold; /* ตัวหนาสำหรับข้อความปุ่ม */
  transition: background-color 0.3s; /* เพิ่มการเคลื่อนไหวเมื่อ hover */
}

button:hover {
  background-color: #818181; /* สีปุ่มเมื่อเอาเมาส์ไปชี้ */
}
</style>
