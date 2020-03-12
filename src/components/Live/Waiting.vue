<template>
    <div>
        <div>Waiting Room #{{ this.sessionId }}</div>
        <v-text-field
            :rules="nameRules"
            label="Email"
            required
            v-model="email"
            :disabled="disabled"
        ></v-text-field>
        <v-text-field
            :rules="nameRules"
            label="Passcode"
            required
            v-model="passcode"
            :disabled="disabled"
        ></v-text-field>
        <v-btn dark tile v-on:click="this.loginSession">Submit</v-btn>
        <v-btn dark tile v-on:click="this.enterRoom" :disabled="roomActive">Enter room</v-btn>

        <div>Currently in the room: </div>
        <div>
            <div v-for="item in participants" v-bind:key="item.email">{{item.email}}</div>
        </div>
    </div>
</template>

<script>
import { loginSession, getWaiting, logoutSession } from "@/lib/mongodb/video-session/index";
import io from 'socket.io-client';
import authStore from "@/lib/vuex/store/authStore";
import { getSession } from "@/lib/Live/index";

export default {
    name: 'Waiting',
    data: function() {
        return {
            passcode: '',
            email: '',
            sessionId: '',
            participants: [],
            roomActive: true,
            disabled: true
        }
    },
    async created() {
        const self = this;
        this.sessionId = this.$route.params.id;
        const email = authStore.state.user.email;
        const { data: { sessionData }} = await getSession(this.sessionId);
        try {
            const { data } = await getWaiting(this.sessionId);
            window.console.log(data);
            this.participants = data.participants;
            this.roomActive = !data.roomActive
            this.$store.commit('MAKE_ROOM_ACTIVE', data)
            let passcode;
            if(sessionData.lecturers.filter(lecturer => lecturer.email == email).length > 0) {
                passcode = sessionData.lecturers.filter(lecturer => lecturer.email == email)[0].passcode
            } else if(sessionData.students.filter(student => student.email == email).length > 0) {
                passcode = sessionData.students.filter(student => student.email == email)[0].passcode
            } 
            this.passcode = passcode;
            this.email = email
        } catch(e) {
            alert(e);
        }
        const socket = io.connect(`${ process.env.NODE_ENV == 'production' ? process.env.VUE_APP_VANILLA_SERVER : "http://localhost:8081/"}waiting-room`);
        socket.on('connect', function() {
            socket.emit('waiting-room', self.sessionId);
        });
        socket.on('people-who-joined', function(data) {
            window.console.log('people-who-joined')
            self.participants = data;
        });
        socket.on('active-room', function(data){
            window.console.log(data)
            self.roomActive = !data.roomActive;
            self.$store.commit('MAKE_ROOM_ACTIVE', data)
        })
        window.addEventListener('beforeunload', this.logoutSession);
    },
    methods: {
        loginSession: async function() {
            window.console.log(this.email, this.passcode, this.sessionId);
            const { data: {email, isLoggedIn, role }} = await loginSession(this.sessionId, 'Startup', this.email, this.passcode);
            window.console.log("isLoggedIn", isLoggedIn, email, role);
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
            if(email) {
                await logoutSession(this.sessionId, 'Startup', email);
            }
        },
        enterRoom: function() {
            this.$router.push(`/live/${this.sessionId}`)
        }
    }
}
</script>

<style scoped>

</style>