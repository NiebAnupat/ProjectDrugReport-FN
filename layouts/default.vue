<template>
  <v-app dark>

    <v-app-bar app dark>
      <v-toolbar-title>Drug Report</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu v-if="!$store.getters['user']" offset-y :close-on-content-click="false" rounded="xl" transition="slide-y-transition">
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
                v-model="username"
                label="อีเมล"
                prepend-icon="mdi-account"
              ></v-text-field>
              <v-text-field
                v-model="password"
                label="รหัสผ่าน"
                prepend-icon="mdi-lock"
                type="password"
              ></v-text-field>
            </v-card-text>
            <v-card-actions class="align-baseline">
              <transition name="fade">
                <p v-if="!username || !password" class="caption ml-4 grey--text">กรุณากรอกข้อมูล</p>
              </transition>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" :disabled="!username || !password" text @click="login">เข้าสู่ระบบ</v-btn>
            </v-card-actions>
          </v-card>
        </transition>
      </v-menu>
      <v-btn v-else text dark @click="logout">ออกจากระบบ</v-btn>
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
      username: "",
      password: ""
    };
  },

  methods: {
    login() {
      this.$store.dispatch("login", { username: this.username, password: this.password });
      // clear input
      this.username = "";
      this.password = "";
    },

    logout() {
      this.$store.dispatch("logout");
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
