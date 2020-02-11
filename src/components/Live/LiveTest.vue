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
                <div class="add-tab" @click="addScreenShare">Screen Share</div>
                <div class="add-tab" @click="addWhiteBoard">Whiteboard</div>
                <div class="add-tab" @click="addEditor">Editor</div>
                <div class="add-tab" @click="hideAddTabModal">Cancel</div>
            </div>
            <v-spacer></v-spacer>
        </v-card>
    </v-dialog>
    <div class="live-navbar">
        <div v-if="isMentor">
            Lecturer Portal - Management - Prof Dr. Paul Cheng
        </div>
        <div v-else>
            Student Portal - Management - David Lin
        </div>
    </div>
    <div class="live-container">
        <div v-bind:class="{workspace: true }">
            <v-overlay
                :absolute="true"
                :value="isMentor ? false : true"
                color="transparent"
            >
            </v-overlay>
            <div class="tabs">
                <v-tabs
                    v-model="active_tab"
                >
                    <v-tab v-for="(item, index) in workSpaceTabs" :key="index" class="tab">
                        {{ item.name }}
                    </v-tab>
                </v-tabs>
                    <v-btn class="mx-2" fab dark x-small color="blue" @click="showAddTabModal">
                        <v-icon dark>add</v-icon>
                    </v-btn>
            </div>
            <div class="screens">
                <div class="screen-container">
                    <v-tabs-items v-model="active_tab">
                        <v-tab-item
                            v-for="item in workSpaceTabs"
                            :key="item"
                            class="screen"
                        >
                            <div v-if="item.name == 'Screen Share'" style="height: 100%; " class="screen-share">
                                <div class="screen-children" id="screen-preview" ></div>
                                 <div class="share-my-screen" v-if="isMentor">
                                    <v-btn color="green darken-1" tile @click="initializeScreenSharing" v-if="!sharingMyScreen" class="screen-sharing-control">Share my screen</v-btn>
                                    <v-btn color="red darken-1" tile @click="stopScreenSharing" v-if="sharingMyScreen" class="screen-sharing-control">End screen sharing</v-btn>
                                    <v-btn color="green darken-1" tile @click="continueScreenSharing" v-if="!sharingMyScreen" class="screen-sharing-control">Continue screen sharing</v-btn>
                                </div>
                            </div>
                            <div class="screen-children whiteboard" id="screen-preview" v-if="item.name == 'Whiteboard'">
                                <div class="signature-pad">
                                    <drawing-board id="hello" :datas="datas" :email="email" :sessionId="getSessionId"></drawing-board>
                                </div>
                            </div>
                            <div class="screen-children testing" id="screen-preview" v-if="item.name == 'Editor'">
                                    <quill-editor v-model="content" ref="myQuillEditor"
                                                    :options="editorOption">
                                    </quill-editor>
                            </div>
                        </v-tab-item>
                    </v-tabs-items>
                </div>
            </div>
        </div>
        <div class="videos">
            <div class="mentor-container">
                <div id="mentor-0" class="mentor">
                    <div class="zero-mentor-label">{{ zeroMentor.email }}</div>
                </div>
            </div>
            <div class="mentees-container">
                <div v-for="item in menteesRole" v-bind:key="item" :id="item.role" class="mentee">
                    <div class="video-label">
                        <div class="mentee-control-buttons">
                            <v-btn color="white" fab v-if="isMentor && item.mute" @click="turnMenteeOn(item.role)"><v-icon class="video-call" dark>mic_off</v-icon></v-btn>
                            <v-btn color="white" fab v-if="isMentor && !item.mute" @click="turnMenteeOff(item.role)"><v-icon class="video-call" dark>mic</v-icon></v-btn>
                            <div class="video-label-email">{{ item.email }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="videos-control-buttons">
                <div class="video-control-buttons-other">
                    <v-btn v-if="!see" v-on:click="publisher.publishVideo(false); see = true" dark class="control-button"><v-icon class="video-call">videocam</v-icon></v-btn>
                    <v-btn v-if="see" v-on:click="publisher.publishVideo(true); see = false" dark class="control-button"><v-icon class="video-call">videocam_off</v-icon></v-btn>
                    <v-btn v-if="!muted" dark class="control-button" v-on:click="this.muteButton"><v-icon class="voice-call">mic</v-icon></v-btn>
                    <v-btn v-if="muted" dark class="control-button" v-on:click="this.unmuteButton"><v-icon class="voice-call">mic_off</v-icon></v-btn>
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
import { initializeSession, checkScreenSharing, initializeScreenSharing } from "@/lib/opentok/index"
import { logoutSession } from "@/lib/mongodb/video-session/index";
import { sendMessage, getMessages } from '@/lib/mongodb/messages/index'
import { sendEditorText } from "@/lib/mongodb/video-session/editor/index"
import { sendNewTab, sendSwapTab } from "@/lib/mongodb/video-session/tab/index"
import io from 'socket.io-client';
import { quillEditor } from 'vue-quill-editor'
import $ from 'jquery';
import DrawingBoard from "./DrawingBoard.vue"
import myEmitter from './resources/events';
import { turnMenteeOn, turnMenteeOff } from "@/lib/mongodb/video-session/audio/index"


export default {
    name: "Live",
    components: {
        quillEditor,
        DrawingBoard
    },
    mounted : async function(){
        // Use the id of the session record to retrieve the real session id, and generate token
        try {
            const self = this;
            this.sessionId = this.$route.params.id;
            const { data: { token, sessionData: { mentors, mentees, sessionId } }} = await getSession(this.sessionId);
            window.console.log(mentors,mentees, sessionId, token)
            this.email = self.$store.getters.currentSession.email;
            this.role = self.$store.getters.currentSession.role;
            this.menteesRole = mentees.filter(mentee => mentee.active == true && mentee.email != this.email).map(mentee => { return {role: mentee.role, email: mentee.email, mute: true} });
            this.zeroMentor = mentors.filter(mentor => mentor.role == "mentor-0")[0];
            const messageData = await getMessages('Startup', this.sessionId);
            const socket = io.connect(`${process.env.NODE_ENV == 'production' ? process.env.VUE_APP_VANILLA_SERVER : "http://localhost:8081/"}live`); 
            initializeSession(self, token, sessionId, function(publisher, session) {
                self.publisher = publisher;
                self.session = session;

                if(!self.isMentor) {
                    self.publisher.publishAudio(false);
                    self.muted = true;
                }
            });
            
            socket.on('connect', function() {
                socket.emit('room', self.sessionId);
            });
            socket.on('message', function(data) {
                self.messages = data;
            });
            socket.on('drawing', function(data) {
                window.console.log("Drawing",data)
                myEmitter.emit('event', data)
            });
            socket.on('editortext', function(data) {
                window.console.log(data);
                if(self.email !== data.email) {
                    self.content = data.data
                }
            });
            socket.on('new-tab', function(data) {
                if(self.email !== data.email) {
                    self.workSpaceTabs = [
                        ...self.workSpaceTabs,
                        {
                            name: data.name,
                        }
                    ]
                    self.active_tab = self.workSpaceTabs.length - 1

                    if(data.name == 'Editor') {
                        this.editor.focus();
                    }
                }
            })

            socket.on('tab-swap', function(data) {
                if(self.email !== data.email) {
                    self.active_tab = data.index;
                }
            })

            socket.on('turn-mentee-on', function(data) {
                window.console.log(data)
                if(data.role == self.role) {
                    window.console.log(data)
                    self.publisher.publishAudio(true);
                    self.muted = false;
                }
            })

            socket.on('turn-mentee-off', function(data) {
                window.console.log(data)
                if(data.role == self.role) {
                    self.publisher.publishAudio(false);
                    self.muted = true;
                }
            })
            
            this.messages = messageData.data.messages;

            $(document).on('click', '.quill-editor', function() {
                if(!self.isMentor) return
                sendEditorText(self.content, 1, self.sessionId, self.email)
            })

             $(document).on('keyup', '.quill-editor', function() {
                 if(!self.isMentor) return
                sendEditorText(self.content, 1, self.sessionId, self.email)
            })
        }
        catch(e) {
            alert(e);
        }
    },
    data: function() {
        return {
            datas: [],
            isDragging: false,
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
            active_tab: null,
            boardNumber: 1,
            workSpaceTabs: [{
                name: "Screen Share",
            }
            ],
            sharingMyScreen: false,
            //Menu
            data: null,
            content: null,
            previousData: '',
            editorOption: {
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                        ['blockquote', 'code-block'],

                        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
                        [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
                        [{ 'direction': 'rtl' }],                         // text direction

                        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

                        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                        [{ 'font': [] }],
                        [{ 'align': [] }],

                        ['clean']                                         // remove formatting button
                    ]
                }
            }
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
            if(!this.isMentor) return
            this.showAddTab = true;
        },
        hideAddTabModal () {
            if(!this.isMentor) return
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
            if(!this.isMentor) return
            if(checkScreenSharing()) {
                this.workSpaceTabs = [
                    ...this.workSpaceTabs,
                    {
                        name: "Screen Share"
                    }
                ]
                this.hideAddTabModal();
                this.setActiveTab();
                this.sendNewTab("Screen Share");
            } else {
                alert("Screen sharing is not supported in this browser.")
            }
        },
        initializeScreenSharing: function() {
            if(!this.isMentor) return
            if(checkScreenSharing()) {
                this.screenSharingPublisher = initializeScreenSharing(this.session)
                this.sharingMyScreen = true
            } else {
                alert("Screen Sharing is not supported in this browser.")
            }
            
            
        },
        stopScreenSharing: function() {
            if(!this.isMentor) return
            this.sharingMyScreen = false; 
            //this.session.unpublish(this.screenSharingPublisher);
            this.screenSharingPublisher.publishVideo(false);
        },
        addWhiteBoard: function() {
            if(!this.isMentor) return
            this.workSpaceTabs = [
                    ...this.workSpaceTabs,
                    {
                        name: "Whiteboard",
                    }
                ]
                this.hideAddTabModal();
                this.setActiveTab();
                this.sendNewTab("Whiteboard")
        },
        continueScreenSharing: function() {
            if(!this.isMentor) return
            this.screenSharingPublisher.publishVideo(true);
        },
        addEditor: function() {
            if(!this.isMentor) return
            this.workSpaceTabs = [
                    ...this.workSpaceTabs,
                    {
                        name: "Editor",
                    }
                ]
            this.hideAddTabModal();
            this.sendNewTab("Editor")
            this.setActiveTab();
        },
        setActiveTab: function() {
            if(!this.isMentor) return
            this.active_tab = this.workSpaceTabs.length - 1;
        },
        sendNewTab: function(tabName) {
            if(!this.isMentor) return
            sendNewTab(tabName, this.sessionId, this.email);
        },
        handleTabChange: function(i) {
            if(!this.isMentor) return
            sendSwapTab(i, this.sessionId, this.email)
        },
        muteButton: function() {
            this.publisher.publishAudio(false); 
            this.muted = true
        },
        unmuteButton: function() {
            if(!this.isMentor) return
            this.publisher.publishAudio(true); 
            this.muted = false;
        },
        addMentee: function(role, email) {
            window.console.log("this.menteesRole", this.menteesRole)
            this.menteesRole = [...this.menteesRole, { role, email, mute: true}]
        },
        removeMentee: function(role, email) {
            this.menteesRole = this.menteesRole.filter(mentee => mentee.role !== role && mentee.email !== email);
        },
        turnMenteeOn: function(role) {
            let menteeNum = this.menteesRole.findIndex(mentee => mentee.role == role);
            let mentee = this.menteesRole[menteeNum];
            mentee.mute = false;
            let mentees = this.menteesRole;
            mentees[menteeNum] = mentee;
            this.menteesRole = mentees;
            turnMenteeOn(role, this.sessionId);
        },
        turnMenteeOff: function(role) {
            let menteeNum = this.menteesRole.findIndex(mentee => mentee.role == role);
            let mentee = this.menteesRole[menteeNum];
            mentee.mute = true;
            let mentees = this.menteesRole;
            mentees[menteeNum] = mentee;
            this.menteesRole = mentees;
           turnMenteeOff(role, this.sessionId);
        }
    },
    computed: {
        activeTabs: function() {
            window.console.log([this.workSpaceTabs[this.currentTab]])
            return [this.workSpaceTabs[this.currentTab]]
        },
        getSessionId() {
            return this.sessionId
        },
        isMentor() {
            return this.$store.getters.currentSession.email == "mentor1@gmail.com"
        }
    },
    watch: {
        active_tab: function() {
            this.handleTabChange(this.active_tab)
        }
    },
    beforeDestroy() {
        this.editor.destroy()
    },
}
</script>

<style lang="sass">
    @import "../../assets/sass/Live/LiveTest.sass"
</style>