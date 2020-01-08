<template>
    <v-container>
        <v-row no-gutters>
            <v-col cols="4">
                  <v-form ref="form" v-model="valid" lazy-validation>
                        <ValidationProvider v-slot="{ errors }" rules="required">
                            <v-text-field v-model="sessionTitle" label="Title of the session: ">
                            </v-text-field>
                            <span>{{ errors[0] }}</span>
                        </ValidationProvider>
                        <v-date-picker v-model="datePicker"></v-date-picker>
                        <v-time-picker v-model="timePickerr"></v-time-picker>
                        <div>
                            <v-btn tile color="primary" dark v-on:click="this.createSession">Schedule this session</v-btn>
                        </div>
                  </v-form>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { extend } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';
import { createSession } from '@/assets/mongodb/session/index';

extend('required', {
  ...required,
  message: 'This field is required.'
});

export default {
    name: 'CreateSession',
    data: function() {
        return {
            sessionTitle: '',
            datePicker: new Date().toISOString().substr(0, 10),
            timePicker: null
        }
    },
    methods: {
        createSession: async function(){
            try {
                await createSession(this.sessionTitle)
                this.$router.push("/sessions")
            }
            catch(err){
                alert(err);
            }
        }
    }   
}
</script>

<style scoped>

</style>