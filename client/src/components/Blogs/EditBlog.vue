<template>
  <div class="container">
    <h1>Edit</h1>
    <form v-on:submit.prevent="editBlog">
      <transition name="fade">
        <div class="thumbnail-pic" v-if="blog.thumbnail != 'null'">
          <img :src="BASE_URL + blog.thumbnail" alt="thumbnail" />
        </div>
      </transition>
      <form enctype="multipart/form-data" novalidate>
        <div class="dropbox">
          <input
            type="file"
            multiple
            :name="uploadFieldName"
            :disabled="isSaving"
            @change="
              filesChange($event.target.name, $event.target.files);
              fileCount = $event.target.files.length;
            "
            accept="image/*"
            class="input-file"
          />
          <p v-if="isInitial">Drag your file(s) here to begin<br />or click to browse</p>
          <p v-if="isSaving">Uploading {{ fileCount }} files...</p>
          <p v-if="isSuccess">Upload Successful.</p>
        </div>
      </form>
      <transition-group tag="ul" class="pictures">
        <li v-for="picture in pictures" v-bind:key="picture.id">
          <img
            style="margin-bottom: 5px"
            :src="BASE_URL + picture.name"
            alt="picture image"
          />
          <br />
          <button v-on:click.prevent="useThumbnail(picture.name)">Thumbnail</button>
          <button v-on:click.prevent="delFile(picture)">Delete</button>
        </li>
      </transition-group>
      <div class="clearfix"></div>
      <p><strong>content:</strong></p>
      <vue-ckeditor
          v-model.lazy="blog.content"
          :config="config"
          @blur="onBlur($event)"
          @focus="onFocus($event)"
        />
      <p>Name: <input type="text" v-model="blog.Name" /></p>
      <p>CPU: <input type="text" v-model="blog.CPU" /></p>
      <p>Display: <input type="text" v-model="blog.Display" /></p>
      <p>Operating System: <input type="text" v-model="blog.System" /></p>
      <p>Memory: <input type="text" v-model="blog.Memory" /></p>
      <p>Storage: <input type="text" v-model="blog.Storage" /></p>
      <p>Screen Size: <input type="text" v-model="blog.Size" /></p>
      <p>
        <button type="submit">update</button>
        <button v-on:click="navigateTo('/blogs')">Back</button>
      </p>
    </form>
  </div>
</template>

<script>
import BlogsService from "@/services/BlogsService";
import VueCkeditor from "vue-ckeditor2";
import UploadService from "../../services/UploadService";

const STATUS_INITIAL = 0,
  STATUS_SAVING = 1,
  STATUS_SUCCESS = 2,
  STATUS_FAILED = 3;

export default {
  components: { VueCkeditor },
  data() {
    return {
      BASE_URL: "http://localhost:8081/assets/uploads/",
      error: null,
      uploadError: null,
      currentStatus: null,
      uploadFieldName: "userPhoto",
      uploadedFileNames: [],
      pictures: [],
      pictureIndex: 0,
      blog: {
        title: "",
        thumbnail: "null",
        pictures: "null",
        content: "",
        category: "",
        status: "",
      },
      config: {
        toolbar: [
          ["Bold", "Italic", "Underline", "Strike", "Subscript", "Superscript"],
        ],
        height: 300,
      },
    };
  },
  methods: {
    async delFile(material) {
      let result = confirm("Want to delete?");
      if (result) {
        let dataJSON = {
          filename: material.name,
        };

        await UploadService.delete(dataJSON);
        for (var i = 0; i < this.pictures.length; i++) {
          if (this.pictures[i].id === material.id) {
            this.pictures.splice(i, 1);
            this.pictureIndex--;
            break;
          }
        }
      }
    },
    async editBlog() {
      try {
        await BlogsService.put(this.blog);
        this.$router.push({
          name: "blogs",
        });
      } catch (err) {
        console.log(err);
      }
    },
    onBlur(editor) {
      console.log(editor);
    },
    onFocus(editor) {
      console.log(editor);
    },
    navigateTo(route) {
      console.log(route);
      this.$router.push(route);
    },
    wait(ms) {
      return (x) => {
        return new Promise((resolve) => setTimeout(() => resolve(x), ms));
      };
    },
    reset() {
      this.currentStatus = STATUS_INITIAL;
      this.uploadError = null;
      this.uploadedFileNames = [];
    },
    async save(formData) {
      try {
        this.currentStatus = STATUS_SAVING;
        await UploadService.upload(formData);
        this.currentStatus = STATUS_SUCCESS;

        let pictureJSON = [];
        this.uploadedFileNames.forEach((uploadFilename) => {
          let found = false;
          for (let i = 0; i < this.pictures.length; i++) {
            if (this.pictures[i].name == uploadFilename) {
              found = true;
              break;
            }
          }
          if (!found) {
            this.pictureIndex++;
            let pictureJSON = {
              id: this.pictureIndex,
              name: uploadFilename,
            };
            this.pictures.push(pictureJSON);
          }
        });
        this.clearUploadResult();
      } catch (error) {
        console.log(error);
        this.currentStatus = STATUS_FAILED;
      }
    },
    filesChange(fieldName, fileList) {
      const formData = new FormData();
      if (!fileList.length) return;
      Array.from(Array(fileList.length).keys()).map((x) => {
        formData.append(fieldName, fileList[x], fileList[x].name);
        this.uploadedFileNames.push(fileList[x].name);
      });
      this.save(formData);
    },
    clearUploadResult: function () {
      setTimeout(() => this.reset(), 5000);
    },
    useThumbnail(filename) {
      console.log(filename);
      this.blog.thumbnail = filename;
    },
  },
  computed: {
    isInitial() {
      return this.currentStatus === STATUS_INITIAL;
    },
    isSaving() {
      return this.currentStatus === STATUS_SAVING;
    },
    isSuccess() {
      return this.currentStatus === STATUS_SUCCESS;
    },
    isFailed() {
      return this.currentStatus === STATUS_FAILED;
    },
  },
  async created() {
    this.currentStatus = STATUS_INITIAL;
    try {
      let blogId = this.$route.params.blogId;
      this.blog = (await BlogsService.show(blogId)).data;
      this.pictures = JSON.parse(this.blog.pictures);
      this.pictureIndex = this.pictures.length;
    } catch (error) {
      console.log(error);
    }
  },
  async mounted() {
    try {
      let blogId = this.$route.params.blogId;
      this.blog = (await BlogsService.show(blogId)).data;
      this.pictures = JSON.parse(this.blog.pictures);
    } catch (error) {
      console.log(error);
    }
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center; /* Center horizontally */
  justify-content: center; /* Center vertically */
  padding: 20px;
}

.dropbox {
  outline: 2px dashed rgb(255, 255, 255);
  outline-offset: -10px;
  background: rgb(0, 0, 0);
  color: rgb(255, 255, 255);
  padding: 10px 10px;
  min-height: 200px;
  position: relative;
  cursor: pointer;
}

.input-file {
  opacity: 0; /* invisible but it's there! */
  width: 100%;
  height: 200px;
  position: absolute;
  cursor: pointer;
}

.dropbox:hover {
  background: rgb(0, 0, 0);
}

.dropbox p {
  font-size: 1.2em;
  text-align: center;
  padding: 60px 330px;
}

ul.pictures {
  list-style: none;
  padding: 0;
  margin: 0;
  float: left;
  padding-top: 20px;
  padding-bottom: 10px;
}

ul.pictures li {
  float: left;
}

ul.pictures li img {
  max-width: 300px;
  margin-right: 20px;
}

.clearfix {
  clear: both;
}

.thumbnail-pic img {
  width: 200px;
}
</style>
