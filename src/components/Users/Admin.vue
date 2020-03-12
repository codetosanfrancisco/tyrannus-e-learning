<template>
    <div>
        <v-navigation-drawer
        temporary
        v-model="drawer"
        :color="color"
        :expand-on-hover="expandOnHover"
        :mini-variant="miniVariant"
        :right="right"
        :src="bg"
        absolute
        dark
      >
        <v-list
          dense
          nav
          class="py-0"
        >
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

          <v-list-item
            v-for="item in items"
            :key="item.title"
            link
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-data-table
    :headers="headers"
    :items="admins"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>My CRUD</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark class="mb-2" v-on="on">New Admin</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-data-table
                    :headers="lheaders"
                    :items="lecturers"
                    class="elevation-1"
                  >
                  <template v-slot:item.addAsAdmin="{ item }">
                      <v-simple-checkbox v-model="item.addAsAdmin"></v-simple-checkbox>
                    </template>
                  </v-data-table>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.action="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">Reset</v-btn>
    </template>
  </v-data-table>
    </div>
    
</template>


<script>
import { getUsers, updateUserRole, removeUserRole  } from "@/lib/mongodb/users/index";

  export default {
    data: () => ({
      dialog: false,
      drawer: false,
        items: [
          { title: 'Dashboard', icon: 'mdi-view-dashboard' },
          { title: 'Photos', icon: 'mdi-image' },
          { title: 'About', icon: 'mdi-help-box' },
        ],
        color: 'primary',
        colors: [
          'primary',
          'blue',
          'success',
          'red',
          'teal',
        ],
        right: true,
        miniVariant: false,
        expandOnHover: false,
        background: false,
      headers: [
        {
          text: 'No.',
          align: 'start',
          sortable: false,
          value: 'no',
        },
        { text: 'Email', value: 'email' },
        { text: 'Action', value: 'action' }
      ],
      lheaders: [
        {
          text: 'No.',
          align: 'start',
          sortable: false,
          value: 'no',
        },
        { text: 'Email', value: 'email' },
        { text: 'Add As Admin', value: 'addAsAdmin' },
      ],
      admins: [],
      lecturers: [],
      editedIndex: -1,
      editedItem: {
        name: '',
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
      },
      defaultItem: {
        name: '',
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
      },
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
    },

    created () {
      this.initialize()
    },

    methods: {
      initialize: async function() {
        let { data: admins } = await getUsers('admin');
        admins = admins.map((student, index) => {
          return{
            ...student, no: index + 1
          }   
        })

        let { data: lecturers } = await getUsers('lecturer');
        let lIds = lecturers.map(lecturer => lecturer._id);
        let aIds = admins.map(admin => admin._id);
        let difference = lIds.filter(x => !aIds.includes(x));
        this.lecturers = lecturers.filter(lecturer => difference.includes(lecturer._id)).map((lecturer, index) => {
          return {
            ...lecturer,
            no: index + 1,
            addAsAdmin: false,
          }
        })
        window.console.log(difference)
        this.admins = admins;
        window.console.log("Nani", this.admins, this.lecturers);
      },

      editItem (item) {
        this.editedIndex = this.desserts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem: async function(item) {
        try { 
          if(item.role.includes('admin')) return;
          await removeUserRole(item._id, 'admin');
        }
        catch(e) {
          alert(e)
        }
      },

      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },

      save: async function() {
        window.console.log(this.lecturers);
        const newAdmins = this.lecturers.filter(lecturer => lecturer.addAsAdmin).map(lecturer => {
          return lecturer._id;
        })
        window.console.log("New Admin", newAdmins)
        //Update as lecturer
        try {
          await updateUserRole(newAdmins, 'admin')
          this.close()
        } catch(e) {
          window.console.log(e)
          this.close()
        }
      },
    },
  }
</script>

<style scoped>
.elevation-1 {
    height: 100%;
}
</style>