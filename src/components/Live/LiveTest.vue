<template>
<div>
    <v-dialog v-model="showEndSession" persistent max-width="290">
        <v-card>
            <v-card-title class="headline">Are you sure you want to end the session?</v-card-title>
            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="this.endSession">Yes</v-btn>
            <v-btn color="green darken-1" text @click="this.hideEndSessionModal">Cancel</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog v-model="showAddTab" persistent max-width="290">
        <v-card>
            <div class="add-tabs-header">New</div>
             <div class="add-tabs">
                <div class="add-tab" v-on:click="this.addScreenShare">Screen Share</div>
                <div class="add-tab" v-on:click="this.hideAddTabModal">Whiteboard</div>
                <div class="add-tab" v-on:click="this.hideAddTabModal">Cancel</div>
            </div>
            <v-spacer></v-spacer>
        </v-card>
    </v-dialog>
    <div class="live-container">
        <div class="workspace">
            <div class="tabs">
                <div v-for="(workSpaceTab, index) in workSpaceTabs" v-bind:key="workSpaceTab.id" class="tab" v-on:click="workSpaceTab.onClick(index)">{{ workSpaceTab.name }}</div>
 
                    <v-btn class="mx-2" fab dark x-small color="blue" v-on:click="this.showAddTabModal">
                        <v-icon dark>add</v-icon>
                    </v-btn>

            </div>
        </div>
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
import { initializeSession, checkScreenSharing } from "@/lib/opentok/index"
import { logoutSession } from "@/lib/mongodb/video-session/index";
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
            zeroMentor: null,
            showEndSession: false,
            showAddTab: false,
            currentTab: 0,
            workSpaceTabs: [{
                name: "WhiteBooard",
                onClick: function(index) {
                    this.currentTab = index;
                }
            }]
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
            this.showEndSession = true;
        },
        hideEndSessionModal () {
            this.showEndSession = false;
        },
        showAddTabModal () {
            this.showAddTab = true;
        },
        hideAddTabModal () {
            this.showAddTab = false;
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
        addScreenShare: function() {
            if(checkScreenSharing()) {
                this.workSpaceTabs = [
                    ...this.workSpaceTabs,
                    {
                        name: "Screen share",
                        onClick: function(index) {
                            this.currentTab = index;
                        }
                    }
                ]
                this.hideAddTabModal();
            } else {
                alert("Screen sharing is not supported in this browser.")
            }
        }
    }
    
}
</script>

<style scoped lang="sass">
    @import "../../assets/sass/Live/LiveTest.sass"
</style>