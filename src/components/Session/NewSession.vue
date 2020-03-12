<template>
      <div class="new-session" style="height: 100%; display: flex; flex-direction: column; padding: 20px 30px;">
        <loading :active.sync="isLoading" 
            :can-cancel="true" 
            :on-cancel="onCancel"
            :is-full-page="fullPage"></loading>
            <v-dialog
          v-model="dialog"
          max-width="290"
        >
        <v-card>
          <v-card-title class="headline">Session is created!</v-card-title>

          <v-card-text>
            Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              color="green darken-1"
              text
              @click="navigateTo('Sessions')"
            >
              Go To All Sessions
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <div style="font-size: 1.5em; font-weight: 200; ">Schedule New Session</div>
      <form id="form1" style="width: 100%; display: flex; flex-direction: column; flex-grow: 1; ">
        <div class="form-group" style="flex-grow: 1">
            <div class="e-float-input">
                <ejs-textbox  v-model="form.title" name="Title" data-required-message="* Enter the title of the session" required="" data-msg-containerid="titleError" id='textbox' floatLabelType="Auto" placeholder="Title of The Session"></ejs-textbox>
            </div>
            <div id="titleError"></div>
        </div>

        <div class="form-group" style="flex-grow: 1">
            <div class="e-float-input">
                <ejs-datepicker :value="form.date" :strictMode='true' :format="dateFormat" placeholder="Pick a date" name="Date" data-required-message="* Pick the date of the session" required="" data-msg-containerid="dateError" :min="minDate"></ejs-datepicker>
            </div>
            <div id="dateError"></div>
        </div>

        <div class="form-group" style="flex-grow: 1">
            <div class="e-float-input">
                <ejs-timepicker v-model="form.time" placeholder="Pick a time" name="Time" data-required-message="* Pick the time of the session" required="" data-msg-containerid="timeError"></ejs-timepicker>
            </div>
            <div id="timeError"></div>
        </div>

        <div class="form-group" style="flex-grow: 1">
            <div class="e-float-input">
                <ejs-dropdownlist :dataSource='lecturerDatas' @change="handleChange" v-model="form.lecturers" id='dropdownlist' placeholder="Pick a lecturer" name="Lecturer" data-required-message="* Pick a lecturer for the session" required="" data-msg-containerid="lecturerError"></ejs-dropdownlist>
            </div>
            <div id="lecturerError"></div>
        </div>

        <div class="form-group" style="flex-grow: 1">
            <div class="e-float-input">
              <ejs-multiselect id='multiselect' :dataSource='studentDatas' v-model="form.students" placeholder="Select students" mode="CheckBox" :fields='fields' :showSelectAll='showSelectAll' selectAllText="Select All" unSelectAllText="unSelect All" name="Students" data-required-message="* Pick students" required="" data-msg-containerid="studentsError"></ejs-multiselect>  
            </div>
            <div id="studentsError"></div>
        </div>

        <div class="form-group" style="flex-grow: 1">
            <div class="e-float-input">
                <ejs-textbox :multiline="true" v-model="form.agenda" name="Agenda" id='textbox' floatLabelType="Auto" placeholder="Agenda of The Session"></ejs-textbox>
            </div>
        </div>
        
        <div class="submitBtn">
          <button class="submit-btn e-btn" id="submit-btn" style="width: 100%; ">Submit</button>
      </div>
      </form> 
  </div>
</template>

<script>
import Vue from 'vue';
import { TextBoxPlugin } from '@syncfusion/ej2-vue-inputs';
import { MultiSelectPlugin,} from '@syncfusion/ej2-vue-dropdowns';
import { MultiSelect, CheckBoxSelection } from '@syncfusion/ej2-dropdowns';
import { DatePickerPlugin } from '@syncfusion/ej2-vue-calendars';
import { DropDownListPlugin } from '@syncfusion/ej2-vue-dropdowns';
import { createSession } from '@/lib/mongodb/session/index'
import { FormValidator  } from '@syncfusion/ej2-vue-inputs';
import { TimePickerPlugin } from "@syncfusion/ej2-vue-calendars";
import { getUsers } from "@/lib/mongodb/users/index";
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
MultiSelect.Inject(CheckBoxSelection);
Vue.use(MultiSelectPlugin);
Vue.use(TextBoxPlugin);
Vue.use(DropDownListPlugin);
Vue.use(DatePickerPlugin);
Vue.use(TimePickerPlugin)

export default {
    name: "Dashboard",
    components: {
      Loading
    },
    data() {
      return {
        isLoading: false,
        fullPage: true,
        fields : { text: 'Game', value: 'Id' },
        showSelectAll : true,
        dialog: false,
        studentDatas: [],
        lecturerDatas: [],
        waterMark : 'Select a datetime',
        minDate : new Date(new Date().getFullYear(), new Date().getMonth(),new Date().getDate() ,  new Date().getHours()),
        dateFormat : 'yyyy-MM-dd',
        // selectedDate: new Date(),
        agenda: "The agenda of this session is ...",
        showLoader: false,
        showForm: true,
        showError: false,
        showSuccess: false,
        errorMessage: "You have another session booking overlapped.",
        form: {
          title: '',
          date: new Date(),
          time: '',
          lecturers: [],
          students: [],
          agenda: ''
        },
        disableSubmit: true,
        originalStudentDatas: [],
        options : {
        //Initialize the CustomPlacement.
          customPlacement: function(inputElement, errorElement) {
              inputElement = inputElement.closest('.form-group').querySelector('.error');
              inputElement.parentElement.appendChild(errorElement);
          },
              rules: {
                  'Title': {
                      required: true
                  },
                  'Time': {
                      required: true
                  },
                  'Lecturer': {
                      required: true
                  },
                  'Date': {
                      required: true
                  },
                  'Students': {
                    required: true
                  }
              }
        }
      }
    },
    methods: {
      handleChange: function(event) {
        this.form.students = [];
        this.studentDatas = this.originalStudentDatas.filter(student => student.Id != event.value);
      },
      onFormSubmit: async function() {
            let formStatus = this.formObj.validate();
            if (formStatus) {
                let form = {
                  ...this.form,
                  date: this.form.date.toLocaleString(),
                  time: this.form.time.toLocaleString(),
                  lecturers: [this.form.lecturers]
                }
                this.isLoading = true;
                try {
                  await createSession(form);
                  this.formObj.element.reset();
                  this.isLoading = false;
                  this.dialog = true
                }
                catch(e) {
                  alert(e);
                  this.isLoading = false;
                }
            }
        },
      navigateTo(name) {
        this.$router.push({ name })
      }
    },
    mounted: async function() {
      let localObj = this;
      this.formObj = new FormValidator('#form1', this.options);
      document.getElementById('submit-btn').onclick = function(e) {
          e.preventDefault()
          localObj.onFormSubmit();
      };
      let { data: students } = await getUsers('student');
      let { data: lecturers } = await getUsers('lecturer');
      students = students.map(student => {
        return { Id: student.email, Game: student.email }
      });
      lecturers = lecturers.map(lecturer => {
        return lecturer.email
      })
      this.studentDatas = students;
      this.originalStudentDatas = students;

      this.lecturerDatas = lecturers;
      window.console.log("STUDENTS", students)
    }
}
</script>


<style>
@import "../../../node_modules/@syncfusion/ej2-base/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-vue-dropdowns/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-buttons/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-vue-inputs/styles/material.css";
@import  '../../../node_modules/@syncfusion/ej2-inputs/styles/material.css';
@import  '../../../node_modules/@syncfusion/ej2-popups/styles/material.css';
@import  '../../../node_modules/@syncfusion/ej2-lists/styles/material.css';
@import  "../../../node_modules/@syncfusion/ej2-vue-calendars/styles/material.css";
@import '../../../node_modules/@syncfusion/ej2-base/styles/material.css';
@import '../../../node_modules/@syncfusion/ej2-vue-layouts/styles/material.css';

.start {
  border-bottom: 1px solid grey;
  width: 100%;
  padding: 10px 0;
}

.time {
  border-bottom: 1px solid grey;
  width: 100%;
  padding: 10px 0;
}

.error-message {
  color: red;
  font-size: 0.8em;
}

.nani {
  margin: 20px 0px;
}

.label {
  font-size: 0.8em;
  font-weight: 300;
  padding: 5px 0;
}
</style>