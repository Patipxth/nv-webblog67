<template>
  <div style="display: flex; justify-content: center; align-items: center; min-height: 100vh;">
    <div style="width: 60%;"> <!-- กำหนดขนาดให้ฟอร์มไม่กว้างเกินไป -->
      <h1 style="text-align: center;">Add Tablet</h1>
      <form v-on:submit.prevent="createBlog">
        <transition name="fade">
          <div class="thumbnail-pic" v-if="blog.thumbnail != 'null'">
            <img :src="BASE_URL + blog.thumbnail" alt="picture image" />
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
            <p v-if="isInitial">
              Drag your file(s) here to begin<br />
              or click to browse
            </p>
            <p v-if="isSaving">Uploading {{ fileCount }} files...</p>
            <p v-if="isSuccess">Upload Successful.</p>
          </div>
        </form>

        <div>
          <transition-group tag="ul" class="pictures">
            <li v-for="picture in pictures" v-bind:key="picture.id">
              <img
                style="margin-bottom: 5px"
                :src="BASE_URL + picture.name"
                alt="picture image"
              />
              <br />
              <button v-on:click.prevent="useThumbnail(picture.name)">
                Thumbnail
              </button>
              <button v-on:click.prevent="delFile(picture)">Delete</button>
            </li>
          </transition-group>
          <div class="clearfix"></div>
        </div>

        <p><strong>content:</strong></p>
        <vue-ckeditor
          v-model.lazy="blog.content"
          :config="config"
          @blur="onBlur($event)"
          @focus="onFocus($event)"
        />

        <template>
  <div style="display: flex; justify-content: center; align-items: center; min-height: 60vh;">
    <div style="width: 40%; text-align: left;"> <!-- จัดให้อยู่ตรงกลาง -->
      <p>Name: <input type="text" v-model="blog.Name" style="width: 100%;" /></p>
      <p>CPU: <input type="text" v-model="blog.CPU" style="width: 100%;" /></p>
      <p>Display: <input type="text" v-model="blog.Display" style="width: 100%;" /></p>
      <p>Operating System: <input type="text" v-model="blog.System" style="width: 100%;" /></p>
      <p>Memory: <input type="text" v-model="blog.Memory" style="width: 100%;" /></p>
      <p>Storage: <input type="text" v-model="blog.Storage" style="width: 100%;" /></p>
      <p>Screen Size: <input type="text" v-model="blog.Size" style="width: 100%;" /></p>
      <p></p>
      <p><button type="submit">Add Tablet</button></p>
    </div>
  </div>
  
</template>
      </form>
    </div>
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
  data() {
    return {
      BASE_URL: "http://localhost:8081/assets/uploads/",
      error: null,
      // uploadedFiles: [],
      uploadError: null,
      currentStatus: null,
      uploadFieldName: "userPhoto",
      uploadedFileNames: [],
      pictures: [],
      pictureIndex: 0,
      blog: {
        Brand: "",
        thumbnail: "null",
        pictures: "null",
        content: "",
        cc: "",
        modelName: "saved",
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
            this.materialIndex--;
            break;
          }
        }
      }
    },
    async createBlog() {
  this.blog.pictures = JSON.stringify(this.pictures);
  this.blog.thumbnail = this.blog.thumbnail;  // รวมฟิลด์ thumbnail ด้วย
  console.log("JSON.stringify: ", this.blog);
  try {
    await BlogsService.post(this.blog);
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
      // reset form to initial state
      this.currentStatus = STATUS_INITIAL;
      // this.uploadedFiles = []
      this.uploadError = null;
      this.uploadedFileNames = [];
    },
    async save(formData) {
      // upload data to the server
      try {
        this.currentStatus = STATUS_SAVING;
        await UploadService.upload(formData);
        this.currentStatus = STATUS_SUCCESS;

        // update image uploaded display
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

  console.log(this.pictures);  // ตรวจสอบว่ารูปภาพใน pictures ถูกเพิ่มหรือยัง
  this.save(formData);
},
    clearUploadResult: function () {
      setTimeout(() => this.reset(), 5000);
    },
    useThumbnail(filename) {
  console.log(filename);  // ตรวจสอบ filename ที่ถูกส่งเข้ามา
  this.blog.thumbnail = filename;
  console.log(this.blog.thumbnail);  // ตรวจสอบค่า thumbnail หลังจากตั้งค่าแล้ว
}
,
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
  components: {
    VueCkeditor,
  },
  created() {
    this.currentStatus = STATUS_INITIAL;
    this.config.toolbar = [
      {
        name: "document",
        items: [
          "Source",
          "-",
          "Save",
          "NewPage",
          "Preview",
          "Print",
          "-",
          "Templates",
        ],
      },
      {
        name: "clipboard",
        items: [
          "Cut",
          "Copy",
          "Paste",
          "PasteText",
          "PasteFromWord",
          "-",
          "Undo",
          "Redo",
        ],
      },
      {
        name: "editing",
        items: ["Find", "Replace", "-", "SelectAll", "-", "Scayt"],
      },
      {
        name: "forms",
        items: [
          "Form",
          "Checkbox",
          "Radio",
          "TextField",
          "Textarea",
          "Select",
          "Button",
          "ImageButton",
          "HiddenField",
        ],
      },
      "/",
      {
        name: "basicstyles",
        items: [
          "Bold",
          "Italic",
          "Underline",
          "Strike",
          "Subscript",
          "Superscript",
          "-",
          "CopyFormatting",
          "RemoveFormat",
        ],
      },
      {
        name: "paragraph",
        items: [
          "NumberedList",
          "BulletedList",
          "-",
          "Outdent",
          "Indent",
          "-",
          "Blockquote",
          "CreateDiv",
          "-",
          "JustifyLeft",
          "JustifyCenter",
          "JustifyRight",
          "JustifyBlock",
          "-",
          "BidiLtr",
          "BidiRtl",
          "Language",
        ],
      },
      { name: "links", items: ["Link", "Unlink", "Anchor"] },
      {
        name: "insert",
        items: [
          "Image",
          "Flash",
          "Table",
          "HorizontalRule",
          "Smiley",
          "SpecialChar",
          "PageBreak",
          "Iframe",
          "InsertPre",
        ],
      },
      "/",
      { name: "styles", items: ["Styles", "Format", "Font", "FontSize"] },
      { name: "colors", items: ["TextColor", "BGColor"] },
      { name: "tools", items: ["Maximize", "ShowBlocks"] },
      { name: "about", items: ["About"] },
    ];
  },
};
</script>
<style scoped>
.dropbox {
  outline: 2px dashed rgb(255, 255, 255); /* the dash box */
  outline-offset: -10px;
  background: rgb(0, 0, 0);
  color: rgb(255, 255, 255);
  padding: 10px 10px;
  min-height: 200px; /* minimum height */
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
  background: rgb(0, 0, 0); /* when mouse over to the drop zone, change color 
*/
}

.dropbox p {
  font-size: 1.2em;
  text-align: center;
  padding: 50px 0;
}
ul.pictures {
  list-style: none;
  padding: 0;
  margin: 0;
  float: left;
  padding-top: 10px;
  padding-bottom: 10px;
}
ul.pictures li {
  float: left;
}
ul.pictures li img {
  max-width: 180px;
  margin-right: 20px;
}
.clearfix {
  clear: both;
}
/* thumbnail */
.thumbnail-pic img {
  width: 200px;
}
</style>
