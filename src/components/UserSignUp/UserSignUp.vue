<template>
    <v-container>
        <v-row no-gutters>
            <v-col cols="4">
                  <v-form ref="form" v-model="valid" lazy-validation>
                        <ValidationProvider v-slot="{ errors }" rules="required|email">
                            <v-text-field v-model="email" label="Email">
                            </v-text-field>
                            <span>{{ errors[0] }}</span>
                        </ValidationProvider>
                        <ValidationProvider v-slot="{ errors }" rules="required|alpha_num">
                            <v-text-field v-model="password" label="Password" type="password">
                            </v-text-field>
                            <span>{{ errors[0] }}</span>
                        </ValidationProvider>
                        <div>
                            <v-btn tile color="primary" dark v-on:click="this.signUpUser">Sign Up</v-btn>
                            <v-btn tile color="primary" dark v-on:click="this.navigateTo">Login</v-btn>
                        </div>
                  </v-form>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { extend } from 'vee-validate';
import { required, email, alpha_num } from 'vee-validate/dist/rules';
import { signUpUser } from "@/lib/mongodb/index"
// import { authStore } from "@/lib/vuex/store/index"
var capitalize = require('capitalize')

extend('email', {
    ...email,
    message: "The email is not valid."
});
extend('alpha_num', {
    ...alpha_num,
    message: "The password is not valid."
});
extend('required', {
  ...required,
  message: 'This field is required.'
});

export default {
    name: "UserSignUp", 
    beforeMount: function() {
        // authStore.state.loggedIn ? this.$router.push({ name: 'Session'}) : ""
    },
    mounted: function() {
        var full = window.location.host
        this.subdomain = full.split('.')[0]
    },
    data: function() {
        return {
             valid: false,
             email: '',
             password: '',
             subdomain: '',
             check: false
        }
    },
    methods: {
        signUpUser: async function() {
            try {
                await signUpUser(this.email, this.password, capitalize(this.subdomain))
                // authStore.commit('loggedIn')
                // this.$router.push("/dashboard")
            }
            catch(err) {
                alert(err)
            }
        },
        navigateTo: function() {
            this.$router.push({ name: 'UserLogin' })
        }
    }
    
}
</script>

<style scoped>

</style>