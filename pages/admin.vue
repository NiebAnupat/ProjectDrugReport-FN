<template>
  <v-container>
    <v-sheet>
      <div class="title">รายงานการใช้สารเสพติดในโรงเรียน</div>
      <v-divider class="my-3"></v-divider>

      <v-row>
        <v-col cols="6">
          <v-sheet class="pa-3 elevation-4" color="white" style="height: 75vh; ">
            <v-data-table :headers="header" :items="reports" caption="ยังไม่ได้ตรวจสอบ"
                          no-data-text="ไม่มีรายงานรอตรวจสอบ"  :items-per-page='8' hide-default-footer class="pa-3">

              <template v-slot:item.action="{ item }">

                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn icon color="primary" @click="showDetail" v-on="on">
                      <v-icon>mdi-book</v-icon>
                    </v-btn>
                  </template>
                  <span>ดูรายละเอียด</span>
                </v-tooltip>

                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn icon color="success" x-small v-on="on">
                      <v-icon>mdi-check</v-icon>
                    </v-btn>
                  </template>
                  <span>ตรวจสอบแล้ว</span>
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
                {{ reports.length }}
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

                <v-data-table :headers="header" :items="reports" :search="search" no-data-text="ไม่พบรายงาน"
                              no-results-text="ไม่พบรายงานที่ค้นหา" hide-default-footer
                              :items-per-page='8'
                              class="pa-3 mt-n10">
                  <template v-slot:item.action="{ item }">
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-btn icon color="primary" v-on="on">
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
              <v-text-field label="สถานที่" readonly dense v-model="selected.location" outlined hide-details></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-carousel height="250" class="rounded-lg" delimiter-icon="mdi-minus" >
              <v-carousel-item v-for="(item,i) in selected.images" :key="i" :src="item"></v-carousel-item>
            </v-carousel>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
export default {
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
          value: "id"
        },
        {
          text: "หัวข้อ",
          align: "center",
          sortable: true,
          value: "title"
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
      reports: [
        {
          id: 1,
          title: "รายงานการใช้ยาเสพติดในโรงเรียน",
          date: "12/12/2562"
        },
        {
          id: 2,
          title: "รายงานการใช้ยาเสพติดในโรงเรียน",
          date: "12/12/2562"
        }
      ],
      selected: {
        title: "ทดสอบ",
        date: "12/12/2562",
        detail: "ทดสอบรายละเอียด",
        location: "ทดสอบสถานที่",
        images: [
          "https://picsum.photos/200/300/?image=1",
          "https://picsum.photos/200/300/?image=2",
          "https://picsum.photos/200/300/?image=3"
        ]
      }
    };
  },
  methods: {
    showDetail() {
      // this.selected = item;
      this.dialog = true;
    },
    convertBlobToURL(blob) {
      return (
        'data:image/jpeg;base64,' +
        new Buffer(
          new Uint8Array(blob.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ''
          ),
          'binary'
        ).toString('base64')
      )
    },
  }
};
</script>

<style scoped>

</style>
