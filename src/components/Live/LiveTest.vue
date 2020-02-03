<template>
<div>
    <modal name="end-session">
        <div>Are you sure you want to end the session?</div>
        <div class="end-session-options">
            <div class="end-session-yes" v-on:click="this.endSession">Yes</div>
            <div class="end-session-cancel" v-on:click="this.hideEndSessionModal">Cancel</div>
        </div>
    </modal>
    <div class="live-container">
        <div class="workspace"></div>
        <div class="videos">
            <div class="mentor-container">
                <div id="mentor#0" class="mentor">
                    <div class="zero-mentor-label">{{ zeroMentor.email }}</div>
                </div>
            </div>
            <div class="mentees-container">
                <div v-for="item in menteesRole" v-bind:key="item" :id="item.role" class="mentee"><div class="label-email">{{ item.email }}</div></div>
            </div>
            <div class="videos-control-buttons">
                <div class="video-control-buttons-other">
                    <v-btn v-if="!see" v-on:click="publisher.publishVideo(false); see = true" dark class="control-button"><v-icon class="video-call">videocam</v-icon></v-btn>
                    <v-btn v-if="see" v-on:click="publisher.publishVideo(true); see = false" dark class="control-button"><v-icon class="video-call">videocam_off</v-icon></v-btn>
                    <v-btn v-if="!muted" dark class="control-button" v-on:click="publisher.publishAudio(false); muted = true"><v-icon class="voice-call">mic</v-icon></v-btn>
                    <v-btn v-if="muted" dark class="control-button" v-on:click="publisher.publishAudio(true); muted = false"><v-icon class="voice-call">mic_off</v-icon></v-btn>
                    <!-- <v-btn dark class="control-button"><v-icon class="full-screen">fullscreen</v-icon></v-btn> -->
                </div>
                <div class="video-control-buttons-end">
                    <v-btn color="error control-button" v-on:click="this.showEndSessionModal"><v-icon class="end-call">phone</v-icon></v-btn>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import { getSession } from "@/lib/Live/index";
import { initializeSession } from "@/lib/opentok/index"
import { logoutSession } from "@/lib/mongodb/video-session/index";
import 'swiper/dist/css/swiper.css'
import { sendMessage, getMessages } from '@/lib/mongodb/messages/index'
import io from 'socket.io-client';

export default {
    name: "Live",
    components: {
    },
    mounted : async function(){
        // Use the id of the session record to retrieve the real session id, and generate token
        try {
            const self = this;
            this.sessionId = this.$route.params.id;
            const { data: { token, sessionData: { mentors, mentees, sessionId } }} = await getSession(this.sessionId);
            window.console.log(mentors,mentees, sessionId)
            this.menteesRole = mentees;
            this.mentorsRole = mentors.filter(mentor => mentor.role != "mentor#0");
            this.zeroMentor = mentors.filter(mentor => mentor.role == "mentor#0")[0];
            const messageData = await getMessages('Startup', this.sessionId);
            const socket = io.connect(`${process.env.NODE_ENV == 'production' ? process.env.VUE_APP_VANILLA_SERVER : "http://localhost:8081/"}chat-room`);
            socket.on('connect', function() {
                socket.emit('room', self.sessionId);
            });
            socket.on('message', function(data) {
                self.messages = data;
            });
            const {session, publisher } = initializeSession(sessionId, token, this.$store.getters.currentSession.role);
            this.publisher = publisher;
            this.session = session;
            this.messages = messageData.data.messages;
        }
        catch(e) {
            alert(e);
        }
    },
    data: function() {
        return {
            swiperOption: {
                slidesPerView: 5,
                centeredSlides: false,
                spaceBetween: 20,
                grabCursor: true,
            },
            publisher: null,
            muted: false,
            see: false,
            session: null,
            sessionId: '',
            message: '',
            socket: null,
            messages: [],
            mentorsRole: [],
            menteesRole: [],
            zeroMentor: null
        }
    },
    methods: {
        sendMessage: async function() {
            try {
                const message = this.message;
                this.message = '';
                await sendMessage('voon@gmail.com', message, 'Startup', this.sessionId);
            }
            catch(e) {
                alert(e);
            }
        },
        showEndSessionModal () {
            this.$modal.show('end-session');
        },
        hideEndSessionModal () {
            this.$modal.hide('end-session');
        },
        endSession: async function() {
            const email = this.$store.getters.currentSession.email;
            if(email) {
                try {
                    await logoutSession(this.sessionId, 'Startup', email);
                    this.session.unpublish(this.publisher);
                    window.location.reload();
                }
                catch(e) {
                    window.console.log(e);
                }
            }
        },
    }
    
}
</script>

<style scoped lang="sass">
    @import "../../assets/sass/Live/LiveTest.sass"
</style>