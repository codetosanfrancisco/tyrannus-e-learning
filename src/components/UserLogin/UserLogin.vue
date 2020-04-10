<template>
    <div style="height: 100%; ">
        <loading :active.sync="isLoading" 
            :can-cancel="true" 
            :on-cancel="onCancel"
            :is-full-page="fullPage"></loading>
        <v-snackbar
        v-model="snackbar"
        :top="true"
        >
        Invalid email or password.
        <v-btn
            color="pink"
            text
            @click="snackbar = false"
        >
            Close
        </v-btn>
        </v-snackbar>
        <v-row style="height: 100%; ">
            <v-col cols="5" style="padding: 5%; ">
                 <v-row no-gutters>
                    <v-img src="@/assets/images/logo.png" max-width="100%"/>
                </v-row>
                <v-row no-gutters>
                        <form id="form1" style="width: 100%; display: flex; flex-direction: column; flex-grow: 1; ">
                            <div class="form-group" style="flex-grow: 1">
                                <div class="e-float-input">
                                    <ejs-textbox  cssClass="white-textbox" v-model="email" name="Email" data-required-message="* Please enter your email" required="" data-msg-containerid="emailError" id='textbox' floatLabelType="Auto" placeholder="Enter your email: 123@gmai.com"></ejs-textbox>
                                </div>
                                <div id="emailError"></div>
                            </div>
                            
                            <div class="form-group" style="flex-grow: 1">
                                <div class="e-float-input">
                                    <ejs-textbox  type="password" v-model="password" name="Password" data-required-message="* Please enter your password" required="" data-msg-containerid="passwordError" id='textbox' floatLabelType="Auto" placeholder="Enter the password: 123456"></ejs-textbox>
                                </div>
                                <div id="passwordError"></div>
                            </div>
                            
                            <div class="submitBtn" style="margin-top: 20px; ">
                                <v-btn block tile dark class="submit-btn e-btn" id="submit-btn" color="#212121">Log in</v-btn>
                            </div>
                        </form> 
                </v-row>
            </v-col>
            <v-col cols="7" style="background-color: #212121; height: 100%; ">

            </v-col>
        </v-row>
    </div>
</template>

<script>
import Vue from 'vue';
import { logInUser } from "@/lib/mongodb/index"
import { authStore } from "@/lib/vuex/store/index"
import Loading from 'vue-loading-overlay';
import Cookies from 'js-cookie'
import { TextBoxPlugin } from '@syncfusion/ej2-vue-inputs';
import { FormValidator  } from '@syncfusion/ej2-vue-inputs';
Vue.use(TextBoxPlugin);
var capitalize = require('capitalize')


export default {
    name: "UserLogin", 
    components: {
        Loading
    },
    beforeMount: function() {
        if(Cookies.get('user')) {
            authStore.commit('loggedIn', JSON.parse(Cookies.get('user')));
            this.$router.push({ name: 'Sessions' })
        }
    },
    mounted: function() {
        var full = window.location.host
        this.subdomain = full.split('.')[0]
        let localObj = this;
        this.formObj = new FormValidator('#form1', this.options);
        document.getElementById('submit-btn').onclick = function(e) {
            e.preventDefault()
            localObj.onFormSubmit();
        };
    },
    data: function() {
        return {
            snackbar: false,
             valid: false,
             email: '',
             password: '',
             subdomain: '',
             check: false,
             fullPage: true,
             isLoading: false,
             options : {
            //Initialize the CustomPlacement.
            customPlacement: function(inputElement, errorElement) {
                inputElement = inputElement.closest('.form-group').querySelector('.error');
                inputElement.parentElement.appendChild(errorElement);
            },
                rules: {
                    'Email': {
                        required: true,
                        email: true
                    },
                    'Password': {
                        required: true,
                        minLength: 6
                    },
                }
            }
        }
    },
    methods: {
         onFormSubmit: async function() {
            let formStatus = this.formObj.validate();
            if (formStatus) {
                this.logInUser()   
            }
        },
        logInUser: async function() {
            try {
                this.isLoading = true;
                const { data } = await logInUser(this.email, this.password, capitalize(this.subdomain))
                await authStore.commit('loggedIn', data);
                Cookies.set('user', data, { expires: 7 });
                this.$router.push({ name: "Sessions"})
                this.isLoading = false;
            }
            catch(err) {
                this.isLoading = false;
                this.snackbar = true;
                this.formObj.element.reset();
            }
        }
    }
    
}
</script>

<style scoped>
    .white-textbox {
        color: white;
    }
</style>