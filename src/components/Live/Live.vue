<template>
<div>
    <modal name="qr-code" width="300" height="300" :clickToClose="false">
        <div style="height: 80%; display: flex; align-items: center; justify-content: center; flex-direction: column; ">
            <qrcode :value="this.sessionId" :options="{ width: 200 }"></qrcode>
            <div>Scan the QR Code</div>
        </div>
        <div style="display: flex; align-items: flex-end; justify-content: flex-end; height: 20%; ">
            <v-btn tile dark v-on:click="this.hideQR" large class="close-qr">Close</v-btn>
        </div>
    </modal>
    <div class="video-sidebar">
        <div class="navigation-icons">
            <div class="navigation-icon">
                <v-icon color="white" >home</v-icon>
            </div>
            <div class="navigation-icon">
                <v-icon color="white" >color_lens</v-icon>
            </div>
            <div class="navigation-icon">
                <v-icon color="white" >screen_share</v-icon>
            </div>
            <div class="navigation-icon" v-on:click="this.showQR">
                <v-icon color="white" >devices</v-icon>
            </div>
        </div>
        <div class="navigation-icon">
            <v-icon color="white" class="end-call">phone</v-icon>
        </div>
    </div>
    <div class="live-container">
        <div class="videos">
            <div id="mentees">
                <swiper :options="swiperOption">
                    <swiper-slide v-for="item in mentorsRole" v-bind:key="item"><div :id="item.role" class="mentee"></div><div class="label-email">{{ item.email }}</div></swiper-slide>
                    <swiper-slide v-for="item in menteesRole" v-bind:key="item"><div :id="item.role" class="mentee"></div><div class="label-email">{{ item.email }}</div></swiper-slide>
                    </swiper>
            </div>
            <div class="lower-container">
                <div class="mentor-container">
                    <div id="mentor#0" class="mentor"></div>
                    <div class="videos-control-buttons">
                        <div class="video-control-buttons-other">
                            <v-btn v-if="!see" v-on:click="publisher.publishVideo(false); see = true" dark class="control-button"><v-icon class="video-call">videocam</v-icon></v-btn>
                            <v-btn v-if="see" v-on:click="publisher.publishVideo(true); see = false" dark class="control-button"><v-icon class="video-call">videocam_off</v-icon></v-btn>
                            <v-btn v-if="!muted" dark class="control-button" v-on:click="publisher.publishAudio(false); muted = true"><v-icon class="voice-call">mic</v-icon></v-btn>
                            <v-btn v-if="muted" dark class="control-button" v-on:click="publisher.publishAudio(true); muted = false"><v-icon class="voice-call">mic_off</v-icon></v-btn>
                            <!-- <v-btn dark class="control-button"><v-icon class="full-screen">fullscreen</v-icon></v-btn> -->
                        </div>
                        <div class="video-control-buttons-end">
                            <v-btn color="error control-button" v-on:click="session.unpublish(publisher)"><v-icon class="end-call">phone</v-icon></v-btn>
                        </div>
                    </div>
                    <div class="zero-mentor-label">{{ zeroMentor.email }}</div>
                </div>
                <div class="chat-container">
                    <div class="chat">
                        <div class="message-container" v-for="message in messages" v-bind:key="message.body">
                            <div class="message">
                                {{ message.body }}
                                <div><small>{{ message.email }}</small></div>
                            </div>
                        </div>
                    </div>
                    <div class="input-container">
                        <div class="input-div"><input class="input" v-model="message"/></div>
                        <div class="send-div"><v-btn fab dark small v-on:click="this.sendMessage"><v-icon small>send</v-icon></v-btn></div>
                    </div>
                </div>
            </div>
           
        </div>
    </div>
</div>
</template>

<script>
import { getSession } from "@/lib/Live/index";
import { initializeSession } from "@/lib/opentok/index"
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { sendMessage, getMessages } from '@/lib/mongodb/messages/index'
import io from 'socket.io-client';

export default {
    name: "Live",
    components: {
        swiper,
        swiperSlide,
    },
    created: async function(){
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
            const socket = io.connect(`${ process.env.NODE_ENV == 'production' ? process.env.VUE_APP_VANILLA_SERVER : "http://localhost:8081/"}chat-room`);
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
        showQR () {
            this.$modal.show('qr-code');
        },
        hideQR () {
            this.$modal.hide('qr-code');
        }
    }
}
</script>

<style scoped>
    .zero-mentor-label {
         position: absolute;
        top: 50%;
        left: 50%;
        font-size: 0.8em;
        transform: translate(-50%,-50%);
        color: white;
        padding: 10px;
        display: none;
        background-color: rgba(0,0,0,0.5);
        border: 0;
    }

    .mentor-container:hover > .zero-mentor-label {
        display: block;
    }

    .close-qr {
        width: 100%;
    }

    .navigation-icon {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 70px;
    }

    .navigation-icon:hover {
        background-color: #a4b0be;
        cursor: pointer;
    }

    .navigation-icons {
        flex-grow: 1
    }

    .video-sidebar {
        position: fixed;
        height: 100%;
        width: 70px;
        background-color: #2f3640;
        z-index: 100;
        display: flex;
        flex-direction: column;
    }

    .message {
        background-color: #f1f2f6;
        padding: 5px;
        margin: 10px;
        border-radius: 5px;
        width: 50%;
        word-break: break-all;
    }
    .message-container {
        display: flex;
        justify-content: flex-end
    }

    .mentor {
        width: 100%;
        height: 102%;
        border-radius: 10px;
        overflow: hidden;
    }

    #mentees {
        width: 100%;
        overflow: scroll;
        height: 20%;
    }

    .label-email {
        position: absolute;
        top: 50%;
        left: 50%;
        font-size: 0.8em;
        transform: translate(-50%,-50%);
        color: white;
        padding: 5px;
        display: none;
        background-color: rgba(0,0,0,0.5);
        border: 0;
    }

    .videos-control-buttons {
        display: flex;
        align-items: center;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 10px 20px;
        z-index: 10;
    }

    .video-control-buttons-other {
        flex-grow: 2
    }

    .video-control-buttons-end {
        flex-grow: 1;
        display: flex;
        justify-content: flex-end;
    }

    .end-call {
        transform: rotate(135deg)
    }

    .control-button {
        margin: 5px;
    }

    .live-container {
        height: 100vh;
        background-color: #f1f2f6;
        padding: 10px;
        padding-left: 80px;
    }

    .mentee {
        background-color: #a4b0be;
        height: 95%;
        margin: 5px;
        border-radius: 10px;
        overflow: hidden;
        position: relative;
    }

    .swiper-slide:hover > .label-email {
        display: block;
    }

    .lower-container {
        display: flex;
        height: 80%
    }

    .mentor-container {
        position: relative;
        background-color: #f1f2f6;
        padding: 10px;
        margin-bottom: 10px;
        width: 70%;
        border-radius: 10px;
    }

    .chat-container {
        flex-grow: 1;
        background-color: #a4b0be;
        border-radius: 10px;
        margin: 10px;
    }

    .videos {
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .swiper-container {
        height: 100%;
    }

    .swiper-slide {
        margin-right: 0 !important;
    }

    .chat {
        max-width: 100%;
        height: 90%;
        overflow-y: scroll;
        padding: 5px;
    }

    .input-container {
        width: 100%;
        height: 10%;
        background-color: #dfe4ea;
        border-bottom-right-radius: 10px;
        border-bottom-left-radius: 10px;
        display: flex;
    }

    .input {
        height: 55px;
        padding: 10px;
        width: 100%;
    }

    .input-div {
        width: 85%;
        flex-grow: 5;
    }

    .send-div {
        flex-grow: 1;
        padding: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>