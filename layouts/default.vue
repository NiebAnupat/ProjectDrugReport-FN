<template>
  <v-app dark>

    <v-app-bar app dark>
      <v-toolbar-title @click="$router.push('/')" v-ripple class="pa-3 rounded-xl" style="cursor: pointer;user-select:none;" >
        <v-icon class="mr-2" size="30">mdi-pill-off</v-icon>
        Drug Report</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu v-if="!$store.getters['user']" offset-y :close-on-content-click="false" rounded="xl"
              transition="slide-y-transition">
        <template v-slot:activator="{ on }">
          <v-btn text v-on="on">ผู้ดูแล</v-btn>
        </template>
        <transition name="expand">
          <v-card width="375" height="300" rounded="xl" class="mt-1 pa-2">
            <v-card-title>
              <span class="headline">เข้าสู่ระบบ</span>
            </v-card-title>
            <v-card-text>
              <v-text-field
                v-model="email"
                label="อีเมล"
                prepend-icon="mdi-account"
                @keydown.enter="login"
              ></v-text-field>
              <v-text-field
                v-model="password"
                label="รหัสผ่าน"
                prepend-icon="mdi-lock"
                type="password"
                @keydown.enter="login"
              ></v-text-field>
            </v-card-text>
            <v-card-actions class="align-baseline">
              <transition name="fade">
                <p v-if="!email || !password" class="caption ml-4 grey--text">กรุณากรอกข้อมูล</p>
              </transition>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" :disabled="!email || !password" text @click="login">เข้าสู่ระบบ</v-btn>
            </v-card-actions>
          </v-card>
        </transition>
      </v-menu>
      <client-only v-else>
        <v-btn text dark to="/">รายงาน</v-btn>
        <v-btn text dark to="/admin">ผู้ดูแล</v-btn>
        <v-btn text dark @click="logout">ออกจากระบบ</v-btn>
      </client-only>
    </v-app-bar>

    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "DefaultLayout",
  data() {
    return {
      email: "",
      password: ""
    };
  },

  methods: {
    async login() {
      if (!await this.$store.dispatch("login", { email: this.email, password: this.password })) {
        this.$swal({
          title: "เข้าสู่ระบบไม่สำเร็จ",
          text: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
          type: "error",
          showConfirmButton: false,
          timer: 2000,
        });
      } else {
        this.$swal({
          title: "เข้าสู่ระบบสำเร็จ",
          text: "ยินดีต้อนรับ",
          type: "success",
          showConfirmButton: false,
          timer: 2000
        });
        // clear input
        this.email = "";
        this.password = "";
      }

    },

    logout() {
      this.$swal({
        title: "ต้องการออกจากระบบหรือไม่",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "ใช่",
        cancelButtonText: "ไม่"
      }).then(async (result) => {
        if (result.value) {
          await this.$store.dispatch("logout");
          this.$swal({
            title: "ออกจากระบบสำเร็จ",
            type: "success",
            showConfirmButton: false,
            timer: 2000
          });
        }
      });
    }

  }
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}


</style>
