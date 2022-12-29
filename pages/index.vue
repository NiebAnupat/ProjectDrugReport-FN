<template>
  <div>
    <!-- แบบฟอร์มรายงานการใช้ยาเสพติดในโรงดรียน  -->
    <div class="d-flex align-center" style="height: 80vh">
      <v-sheet class="flex-fill">
        <v-container>
          <div class="title">แบบฟอร์มรายงานการใช้สารเสพติดในโรงเรียน</div>
          <v-divider></v-divider>
          <v-form class="mt-5" @submit.prevent="submitReport">
            <v-row class="align-baseline">
              <v-col cols="7" class="d-flex align-baseline">
                <p class="mr-3">เรื่อง : </p>
                <v-text-field v-model="report.title" outlined dense hide-details></v-text-field>
              </v-col>
              <v-col cols="5" class="d-flex align-baseline">
                <p class="mr-3">วันที่ : </p>
                <v-menu
                  v-model="dateMenu"
                  :close-on-content-click="false"
                  transition="fade-transition"
                  offset-y
                  min-width="290px">
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="formattedDate"
                      append-icon="mdi-calendar"
                      outlined
                      dense
                      hide-details
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="report.date" no-title scrollable @input="dateMenu = false">
                    <v-spacer></v-spacer>
                  </v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="7">
                <v-textarea
                  v-model="report.detail"
                  label="รายละเอียด"
                  outlined
                  rows="5"></v-textarea>
              </v-col>
              <v-col cols="5">
                <v-row class="my-auto">
                  <v-col cols="12" class="d-flex align-baseline"><p class="mr-3">สถานที่ : </p>
                    <v-text-field v-model="report.location" outlined dense hide-details></v-text-field>
                  </v-col>
                  <v-col cols="12" class="d-flex align-baseline">
                    <p class="mr-3">รูปภาพประกอบ : </p>
                    <v-file-input
                      v-model="report.images"
                      append-icon="mdi-camera"
                      outlined
                      dense
                      hide-details
                      label="เลือกรูปภาพ"
                      accept="image/*"
                      multiple
                    ></v-file-input>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="d-flex justify-end">
                <v-btn color="warning" @click="clearText" class="mr-5">ลบข้อมูล</v-btn>
                <v-btn color="primary" type="submit"
                       :disabled="!report.title || !report.location || !report.detail || !report.date || !report.images ">
                  รายงาน
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-sheet>
    </div>

  </div>
</template>

<script>
export default {
  name: "Index",
  data() {
    return {
      file: null,
      result: "",
      dateMenu: false,
      report: {
        title: "",
        detail: "",
        location: "",
        date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        images: null
      },
      formattedDate: new Date().toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric"
      })
    };
  },

  methods: {

    submitReport() {
      // console.log(this.report);
      // confirm dialog
      this.$swal({
        title: "ยืนยันการรายงาน",
        text: "คุณต้องการรายงานข้อมูลนี้ใช่หรือไม่",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก"
      }).then(async result => {
        if (result.value) {
          var formData = new FormData();
          formData.append("title", this.report.title);
          formData.append("detail", this.report.detail);
          formData.append("location", this.report.location);
          formData.append("date", this.report.date);

          await this.report.images.forEach((image, index) => {
            formData.append("images", image);
          });

          this.$axios.$post("report/", formData, {
            headers: { "content-type": "multipart/form-data" }
          }).then(res => {
            if (res) {
              this.$swal("รายงานสำเร็จ", "ข้อมูลของคุณได้ถูกส่งไปยังผู้ดูแลระบบแล้ว", "success");
              this.clearText();
            } else {
              this.$swal("ผิดพลาด", "รายงานข้อมูลไม่สำเร็จ", "error");
            }
          });


        }
      });

    },

    clearText() {
      this.report.title = "";
      this.report.detail = "";
      this.report.location = "";
      this.report.date = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10);
      this.report.images = null;
    }
  },

  watch: {
    "report.date"() {
      console.log(this.report);
      this.formattedDate = new Date(this.report.date).toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    }
  }
};
</script>

<style scoped></style>
