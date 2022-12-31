<template>
  <v-container>
    <v-sheet>
      <div class="title">รายงานการใช้สารเสพติดในโรงเรียน</div>
      <v-divider class="my-3"></v-divider>

      <v-row>
        <v-col cols="6">
          <v-sheet class="pa-3 elevation-4" color="white" style="height: 75vh; ">
            <v-data-table :headers="header" :items="unchecked" caption="ยังไม่ได้ตรวจสอบ"
                          no-data-text="ไม่มีรายงานรอตรวจสอบ" :items-per-page="8" hide-default-footer class="pa-3">


              <template v-slot:item.date="{item}">
                {{ formattedDate(item.date) }}
              </template>

              <template v-slot:item.action="{ item }">

                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn icon color="primary" @click="showDetail(item)" x-small v-on="on">
                      <v-icon>mdi-book</v-icon>
                    </v-btn>
                  </template>
                  <span>ดูรายละเอียด</span>
                </v-tooltip>

                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn icon color="success" x-small @click="checkReport(item)" v-on="on">
                      <v-icon>mdi-check</v-icon>
                    </v-btn>
                  </template>
                  <span>ตรวจสอบ</span>
                </v-tooltip>
              </template>
            </v-data-table>
          </v-sheet>
        </v-col>
        <v-col cols="6">
          <v-row class="mt-1">
            <v-col cols="12">
              <v-sheet elevation="3" class="d-flex align-baseline pa-5 pt-7">
                <p>ยังไม่ได้ตรวจสอบ</p>
                <v-spacer></v-spacer>
                {{ unchecked.length }}
                <v-spacer></v-spacer>
                <p>รายการ</p>
              </v-sheet>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-card class="elevation-4" style="height: 57vh;">
                <v-card-title class="d-flex align-baseline">
                  <p class="title">ตรวจสอบแล้ว</p>
                  <v-spacer></v-spacer>
                  <v-text-field label="ค้นหา" v-model="search" single-line append-icon="mdi-magnify"
                                style="width: 75px">

                  </v-text-field>
                </v-card-title>

                <v-data-table :headers="header" :items="checked" :search="search" no-data-text="ไม่พบรายงาน"
                              no-results-text="ไม่พบรายงานที่ค้นหา" hide-default-footer
                              :items-per-page="5"
                              class="pa-3 mt-n10">

                  <template v-slot:item.date="{item}">
                    {{ formattedDate(item.date) }}
                  </template>

                  <template v-slot:item.action="{ item }">
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-btn icon color="primary" x-small @click="showDetail(item)" v-on="on">
                          <v-icon>mdi-book</v-icon>
                        </v-btn>
                      </template>
                      <span>ดูรายละเอียด</span>
                    </v-tooltip>
                  </template>
                </v-data-table>

              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-sheet>

    <!--    detail dialog-->
    <v-dialog v-model="dialog" width="600">
      <v-card class="pa-3">
        <v-card-title>
          <p class="title">รายละเอียด</p>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="7">
              <v-text-field label="เรื่อง" readonly v-model="selected.title" outlined hide-details></v-text-field>
            </v-col>
            <v-col cols="5">
              <v-text-field label="วันที่" readonly v-model="selected.date" outlined hide-details></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-textarea
                v-model="selected.detail"
                label="รายละเอียด"
                readonly
                outlined
                rows="3"
                hide-details
              ></v-textarea>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field label="สถานที่" readonly dense v-model="selected.location" outlined
                            hide-details></v-text-field>
            </v-col>
          </v-row>
          <v-row class="mt-6">
            <v-carousel height="250" class="rounded-lg" delimiter-icon="mdi-minus">
              <v-carousel-item v-for="(item,i) in selected.images" :key="i" :src="convertBlobToURL(item.img)"></v-carousel-item>
            </v-carousel>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
import moment from "moment";

export default {

  async asyncData({ $axios }) {
    const checked = await $axios.$get("report/checked");
    const unchecked = await $axios.$get("report/unchecked");
    return { checked, unchecked };
  },

  name: "admin",
  middleware: "auth",
  data() {
    return {
      dialog: false,
      search: "",
      header: [
        {
          text: "รหัส",
          align: "center",
          sortable: true,
          value: "id",
          width: "14%",
        },
        {
          text: "หัวข้อ",
          align: "start",
          sortable: true,
          value: "title",
          width: "50%",
          class: "text-center",
        },
        {
          text: "วันที่",
          align: "center",
          sortable: true,
          value: "date"
        },
        {
          text: "",
          value: "action",
          align: "center",
          sortable: false,
          width: "20%"
        }
      ],
      selected: {
        title: "",
        date: "",
        detail: "",
        location: "",
        images: []
      }
    };
  },
  methods: {

    checkReport(report) {
      this.$axios.$post(`report/check/${report.id}`);
      this.unchecked = this.unchecked.filter(r => r.id !== report.id);
      this.checked.unshift(report);
    },

    showDetail(item) {
      this.selected = {
        title: item.title,
        date: this.formattedDate(item.date),
        detail: item.detail,
        location: item.location,
        images: item.report_img
      };
      this.dialog = true;
    },
    formattedDate(date) {
      return moment(date).format("DD/MM/YYYY");
    },
    convertBlobToURL(blob) {
      return (
        "data:image/jpeg;base64," +
        new Buffer(
          new Uint8Array(blob.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          ),
          "binary"
        ).toString("base64")
      );
    }
  }
};
</script>

<style scoped>

</style>
