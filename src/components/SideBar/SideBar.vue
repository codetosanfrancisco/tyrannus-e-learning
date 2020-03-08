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
              <v-list-item-title>Application</v-list-item-title>
              <v-list-item-subtitle>Subtext</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>

            <v-list-group
                v-for="item in items"
                :key="item.title"
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
          <v-btn block>Logout</v-btn>
        </div>
      </template>
      </v-navigation-drawer>
</template>

<script>
export default {
    name: "SideBar",
    data: function() {
        return {
            items: [
          {
            action: 'dashboard',
            title: 'Dashboard',
            active: true,
            items: [
              { title: 'User Activity' },
              { title: 'Statistics' },
            ]
          },
          {
            action: 'people',
            title: 'Users',
            items: [
              { title: 'Admin' , route: 'Admin'},
              { title: 'Lecturers', route: 'Lecturers' },
              { title: 'Students', route: 'Students' },
            ],
          },
          {
            action: 'date_range',
            title: 'Sessions',
            items: [
              { title: 'All Session', route: 'Sessions' },
              { title: 'New Session', route: 'NewSession' },
              { title: 'My Schedule', route: 'NewSession' }
            ],
          },
          {
            action: 'account_circle',
            title: 'Account',
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
        }
    }
}
</script>

<style>
</style>