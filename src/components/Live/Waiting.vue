<template>
    <div>
        <div>Waiting Room #{{ this.sessionId }}</div>
        <v-text-field
            :rules="nameRules"
            label="Email"
            required
            v-model="email"
        ></v-text-field>
        <v-text-field
            :rules="nameRules"
            label="Passcode"
            required
            v-model="passcode"
        ></v-text-field>
        <v-btn dark tile v-on:click="this.loginSession">Submit</v-btn>

        <div>Currently in the room: </div>
        <div>
            <div v-for="item in participants" v-bind:key="item.email">{{item.email}}</div>
        </div>
    </div>
</template>

<script>
import { loginSession, getWaiting, logoutSession } from "@/lib/mongodb/video-session/index";
import io from 'socket.io-client';

export default {
    name: 'Waiting',
    data: function() {
        return {
            passcode: '',
            email: '',
            sessionId: '',
            participants: []
        }
    },
    async created() {
        const self = this;
        this.sessionId = this.$route.params.id;
        window.addEventListener('beforeunload', this.logoutSession);
        try {
            const { data } = await getWaiting(this.sessionId);
            this.participants = data.participants;
        } catch(e) {
            alert(e);
        }
        const socket = io.connect('http://localhost:8081/waiting-room');
        socket.on('connect', function() {
            socket.emit('waiting-room', self.sessionId);
        });
        socket.on('people-who-joined', function(data) {
            self.participants = data;
        });
    },
    methods: {
        loginSession: async function() {
            const { data: {email, isLoggedIn, role }} = await loginSession(this.sessionId, 'Startup', this.email, this.passcode);
            if(isLoggedIn) {
                this.$store.commit('LOGIN_CURRENT_SESSION', {
                    email, 
                    role,
                    sessionId: this.sessionId
                })
            }
        },
        logoutSession: async function() {
            const email = this.$store.getters.currentSession.email;
            await logoutSession(this.sessionId, 'Startup', email);
        }
    }
}
</script>

<style scoped>

</style>