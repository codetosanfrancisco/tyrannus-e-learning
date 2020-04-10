<template>

    <div>
        <v-dialog v-model="editDialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">Edit Student</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <form id="form2" style="width: 100%; display: flex; flex-direction: column; flex-grow: 1; ">

                    <div class="form-group" style="flex-grow: 1">
                        <div class="e-float-input">
                            <ejs-textbox  v-model="editing.name" name="Name" data-required-message="* Please enter the student's name" required="" data-msg-containerid="nameError" id='textbox' floatLabelType="Auto" placeholder="Enter your name: john doer"></ejs-textbox>
                        </div>
                        <div id="nameError"></div>
                    </div>

                    <div class="form-group" style="flex-grow: 1">
                        <div class="e-float-input">
                            <ejs-textbox  v-model="editing.email" name="Email" data-required-message="* Please enter the student's email" required="" data-msg-containerid="emailError" id='textbox' floatLabelType="Auto" placeholder="Enter your email: 123@gmai.com"></ejs-textbox>
                        </div>
                        <div id="emailError"></div>
                    </div>
                    
                    <div class="form-group" style="flex-grow: 1">
                        <div class="e-float-input">
                            <ejs-textbox  type="password" v-model="editing.password" name="Password" data-required-message="* Please enter your password" required="" data-msg-containerid="passwordError" id='textbox' floatLabelType="Auto" placeholder="Enter the password: 123456"></ejs-textbox>
                        </div>
                        <div id="passwordError"></div>
                    </div>

                    <div class="form-group" style="flex-grow: 1">
                        <div class="e-float-input">
                            <ejs-textbox  v-model="editing.location" type="text" name="Location" data-required-message="* Please state your Location" required="" data-msg-containerid="confirmError" id='textbox' floatLabelType="Auto" placeholder="Enter your location:"></ejs-textbox>
                        </div>
                        <div id="confirmError"></div>
                    </div>
                </form> 
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="editDialog = !editDialog">Cancel</v-btn>
              <v-btn color="blue darken-1" text id="submit-edit-btn">Update</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-navigation-drawer
        temporary
        v-model="drawer"
        :color="color"
        :expand-on-hover="expandOnHover"
        :mini-variant="miniVariant"
        :right="right"
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
    :items="students"
  >
    <template v-slot:item.password="{ item }">
      <v-chip dark>*******</v-chip>
    </template>
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>My Students</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark class="mb-2" @click="addNewStudent">New Student</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">New Student</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <form id="form1" style="width: 100%; display: flex; flex-direction: column; flex-grow: 1; ">

                    <div class="form-group" style="flex-grow: 1">
                        <div class="e-float-input">
                            <ejs-textbox  v-model="name" name="Name" data-required-message="* Please enter the student's name" required="" data-msg-containerid="nameError" id='textbox' floatLabelType="Auto" placeholder="Enter your name: john doer"></ejs-textbox>
                        </div>
                        <div id="nameError"></div>
                    </div>

                    <div class="form-group" style="flex-grow: 1">
                        <div class="e-float-input">
                            <ejs-textbox  v-model="email" name="Email" data-required-message="* Please enter the student's email" required="" data-msg-containerid="emailError" id='textbox' floatLabelType="Auto" placeholder="Enter your email: 123@gmai.com"></ejs-textbox>
                        </div>
                        <div id="emailError"></div>
                    </div>
                    
                    <div class="form-group" style="flex-grow: 1">
                        <div class="e-float-input">
                            <ejs-textbox  type="password" v-model="password" name="Password" data-required-message="* Please enter your password" required="" data-msg-containerid="passwordError" id='textbox' floatLabelType="Auto" placeholder="Enter the password: 123456"></ejs-textbox>
                        </div>
                        <div id="passwordError"></div>
                    </div>

                    <div class="form-group" style="flex-grow: 1">
                        <div class="e-float-input">
                            <ejs-textbox  v-model="confirm" type="password" name="Confirm" data-required-message="* Confirm your password" required="" data-msg-containerid="confirmError" id='textbox' floatLabelType="Auto" placeholder="Confirm your password"></ejs-textbox>
                        </div>
                        <div id="confirmError"></div>
                    </div>
                </form> 
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" text id="submit-btn">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.action="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item.no)"
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
import Vue from 'vue';
import { getUsers, removeUserRole, updateUser  } from "@/lib/mongodb/users/index";
import { authStore } from "@/lib/vuex/store/index"
import { signUpUser } from "@/lib/mongodb/index"
import { TextBoxPlugin } from '@syncfusion/ej2-vue-inputs';
import { FormValidator  } from '@syncfusion/ej2-vue-inputs';
Vue.use(TextBoxPlugin);
var capitalize = require('capitalize')

  export default {
    data: () => ({
      options : {
      //Initialize the CustomPlacement.
      customPlacement: function(inputElement, errorElement) {
          inputElement = inputElement.closest('.form-group').querySelector('.error');
          inputElement.parentElement.appendChild(errorElement);
      },
          rules: {
              'Email': {
                  required: true,
                  email: true,
              },
              'Password': {
                  required: true,
                  minLength: 6
              },
              'Name': {
                required: true
              },
              'Confirm': {
                required: true,
                minLength: 6
              }
          }
      },
      editOptions: {
        customPlacement: function(inputElement, errorElement) {
          inputElement = inputElement.closest('.form-group').querySelector('.error');
          inputElement.parentElement.appendChild(errorElement);
      },
          rules: {
              'Email': {
                  required: true,
                  email: true,
              },
              'Password': {
                  required: true,
                  minLength: 6
              },
              'Name': {
                required: true
              }
          }
      },
      email: '',
      password: '',
      name:'',
      confirm: '',
      dialog: false,
      editDialog: false,
      editing: {
        'email': null,
        'password': null,
        'name': null,
        'location': 'null'
      },
      currentlyEditing: null,
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
        { text: 'User ID', value: '_id'},
        { text: 'Password', value: 'password', class: "data-table-password"},
        { text: 'Email', value: 'email' },
        { text: 'Name', value: 'name' },
        { text: 'Location', value: 'location' },
        // { text: 'Role', value: 'role' },
        { text: 'Status', value: 'status'},
        { text: 'Actions', value: 'action', sortable: false },
      ],
      students: [],
    }),

    computed: {
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
    },

    created: function() {
      this.initialize();
    },

    mounted: async function() {
        try{
          const { data } = await getUsers('student');
          let students = data;
          students = students.map((student, index) => {
          // var r = student.role[2] ? student.role[2] : student.role[1] ? student.role[1] : student.role[0]
            return{
              ...student, no: index + 1, 
              //role: capitalize(r), 
              status: 'active', 
              location: student.location ? student.location : "Malaysia"
            }   
          });
          this.students = students;
        }  
        catch(e) {
          window.console.log(e)
        }
    },

    methods: {
      loadStudents: async function() {
        const { data } = await getUsers('student');
        return data;
      },
      onFormSubmit: async function() {
          let formStatus = this.formObj.validate();
          if (formStatus) {
              this.save(); 
          }
      },

      onFormSubmitEdit: async function() {
          let formStatus = this.formEditObj.validate();
          if (formStatus) {
             // this.save(); 
             this.update();
          }
      },

      update: async function() {
        var selectedUser = this.students[this.currentlyEditing];
        try {
          await updateUser(selectedUser._id, this.editing);
          let students = await this.loadStudents();
          students = students.map((student, index) => {
          // var r = student.role[2] ? student.role[2] : student.role[1] ? student.role[1] : student.role[0]
            return{
              ...student, no: index + 1, 
              //role: capitalize(r), 
              status: 'active', 
              location: student.location ? student.location : "Malaysia"
            }   
          });
          this.students = students;
          window.console.log(students);
          this.editDialog = false;
        } catch (error) {
          throw error;
        }
      },

      addNewStudent() {
        this.dialog = true;
        const self = this;
        Vue.nextTick(function() {
          self.formObj = new FormValidator('#form1', self.options);
          self.formObj.addRules('Email', {
            unique: [ (args) => {
              const emails = self.students.map(student => student.email);
              return !emails.includes(args['value'])
            },'Email already exists.'],
          })

          self.formObj.addRules('Confirm', {
            confirm: [ (args) => {
              return args['value'] == self.password;
            }, "Password doesn't match."]
          })
          document.getElementById('submit-btn').onclick = function(e) {
              e.preventDefault()
              self.onFormSubmit();
          };
        })
      },

      initialize () {
        this.students = []
      },

      editItem (index) {
        // this.editedIndex = this.students.indexOf(item)
        // this.editedItem = Object.assign({}, item)
        index--;
        window.console.log(index, this.students[index]);
        var student = this.students[index];
        var studentObj = {
          'email': student.email,
          'password': student.password,
          'name': student.name,
          'location': ''
        };
        this.currentlyEditing = index;
        this.editing = studentObj;
        this.editDialog = true;
        const self = this;
        Vue.nextTick(function() {
          self.formEditObj = new FormValidator('#form2', self.editOptions);
          self.formEditObj.addRules('Email', {
            unique: [ (args) => {
              const emails = self.students.filter((obj, i) => i != index).map(student => student.email);
              return !emails.includes(args['value'])
            },'Email already exists.'],
          })

          self.formEditObj.addRules('Location', {
            required: true
          })
          document.getElementById('submit-edit-btn').onclick = function(e) {
              e.preventDefault()
              self.onFormSubmitEdit();
          };
        })
      },

      deleteItem: async function(item) {
        window.console.log(item, item._id)
        if(item._id == authStore.state.user._id) return;
        try { 
          const { data: students} = await removeUserRole(item._id, 'student');
          this.students = students.map((student, index) => {
          return{
            ...student, no: index + 1
          } 
        })
        }
        catch(e) {
          throw e;
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
            try {
                await signUpUser(this.name, this.email, this.password)
                // authStore.commit('loggedIn')
                // this.$router.push("/dashboard")
                let { data: students } = await getUsers('student');
                students = students.map((student, index) => {
                var r = student.role[2] ? student.role[2] : student.role[1] ? student.role[1] : student.role[0]
                return{
                  ...student, no: index + 1, role: capitalize(r), status: 'active', location: "Semenyih"
                }   
                })
                this.students = students;
                this.close();
            }
            catch(err) {
                throw err;
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