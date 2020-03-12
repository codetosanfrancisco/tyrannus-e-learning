<template>
    <v-navigation-drawer
        style="height: 100vh; "
        :right="right"
        absolute
        class="deep-purple accent-4"
        dark
        permanent
      >
        <v-list>
            <v-list-item two-line :class="miniVariant && 'px-0'">
            <v-list-item-avatar>
              <img src="https://randomuser.me/api/portraits/men/81.jpg">
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>{{ email }}</v-list-item-title>
              <v-list-item-subtitle>{{ role }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>

            <v-list-group
                v-for="item in items"
                :key="item.title"
                v-show="isAdmin || item.view"
                v-model="item.active"
                :prepend-icon="item.action"
                no-action
                color="rgb(255,255,255)"
            >
                <template v-slot:activator>
                <v-list-item-content >
                    <v-list-item-title v-text="item.title" ></v-list-item-title>
                </v-list-item-content>
                </template>

                <v-list-item
                v-for="subItem in item.items"
                :key="subItem.title"
                @click="navigateTo(subItem.route)"
                >
                <v-list-item-content>
                    <v-list-item-title v-text="subItem.title"></v-list-item-title>
                </v-list-item-content>
                </v-list-item>
            </v-list-group>
    </v-list>

      <template v-slot:append>
        <div class="pa-2">
          <v-btn block @click="logoutUser">Logout</v-btn>
        </div>
      </template>
      </v-navigation-drawer>
</template>

<script>
import { logOutUser } from "@/lib/mongodb/index"
import { authStore } from "@/lib/vuex/store/index"
import Cookies from "js-cookie"

export default {
    mounted: function() {
      this.email = authStore.state.user.email
      this.role = authStore.state.user.role[authStore.state.user.role.length - 1]
    },
    name: "SideBar",
    data: function() {
        return {
          email: '',
          role: '',
            items: [
          {
            action: 'dashboard',
            title: 'Dashboard',
            active: true,
            view: true,
            items: [
              { title: 'User Activity' },
              { title: 'Statistics' },
            ]
          },
          {
            action: 'people',
            title: 'Users',
            view: false,
            items: [
              { title: 'Admin' , route: 'Admin'},
              { title: 'Lecturers', route: 'Lecturers' },
              { title: 'Students', route: 'Students' },
            ],
          },
          {
            action: 'date_range',
            title: 'Sessions',
            view: true,
            items: [
              { title: 'All Session', route: 'Sessions' },
              { title: 'New Session', route: 'NewSession' },
              { title: 'My Schedule', route: 'NewSession' }
            ],
          },
          {
            action: 'account_circle',
            title: 'Account',
            view: true,
            items: [
              { title: 'Setting', route: 'Sessions' },
            ],
          },
        ],
        }
    },
    methods: {
        navigateTo: function(pathName) {
            this.$router.push({ name: pathName })
        },
        logoutUser: async function() {
          try {
            await logOutUser();
            await authStore.commit('logOut');
            Cookies.remove('user')
            this.$router.push({ name: 'UserLogin' })
          }catch(e) {
            alert("Error Occurred!")
          }
        }
    },
    computed: {
      isAdmin() {
        return authStore.state.user.role.includes('admin');
      }
    }
}
</script>

<style>
</style>