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
                <div class="add-tab" v-on:click="this.addWhiteBoard">Whiteboard</div>
                <div class="add-tab" v-on:click="this.addEditor">Editor</div>
                <div class="add-tab" v-on:click="this.hideAddTabModal">Cancel</div>
            </div>
            <v-spacer></v-spacer>
        </v-card>
    </v-dialog>
    <div class="live-container">
        <div v-bind:class="{workspace: true, 'disable-pointer-event': !isMentor }">
            <div class="tabs">
                <v-tabs
                    v-model="tab"
                >
                    <v-tab v-for="item in workSpaceTabs" :key="item" class="tab" v-on:click="workSpaceTab.onClick(index)">
                        {{ item.name }}
                    </v-tab>
                </v-tabs>
                    <v-btn class="mx-2" fab dark x-small color="blue" v-on:click="this.showAddTabModal">
                        <v-icon dark>add</v-icon>
                    </v-btn>
            </div>
            <div class="screens">
                <div class="screen-container">
                    <v-tabs-items v-model="tab">
                        <v-tab-item
                            v-for="item in workSpaceTabs"
                            :key="item"
                            class="screen"
                        >
                            <div v-if="item.name == 'Screen Share'" style="height: 100%; " class="screen-share">
                                <div class="screen-children" id="screen-preview" ></div>
                                 <div class="share-my-screen">
                                    <v-btn color="green darken-1" tile v-on:click="initializeScreenSharing" v-if="!sharingMyScreen" class="screen-sharing-control">Share my screen</v-btn>
                                    <v-btn color="red darken-1" tile v-on:click="stopScreenSharing" v-if="sharingMyScreen" class="screen-sharing-control">End screen sharing</v-btn>
                                    <v-btn color="green darken-1" tile v-on:click="continueScreenSharing" v-if="!sharingMyScreen" class="screen-sharing-control">Continue screen sharing</v-btn>
                                </div>
                            </div>
                            <div class="screen-children whiteboard" id="screen-preview" v-if="item.name == 'Whiteboard'">
                                <div class="signature-pad">
                                    <drawing-board id="hello" :datas="datas" :email="email" :sessionId="getSessionId"></drawing-board>
                                </div>
                            </div>
                            <div class="screen-children testing" id="screen-preview" v-if="item.name == 'Editor'">
                                    <quill-editor v-model="content"
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
import { initializeSession, checkScreenSharing, initializeScreenSharing } from "@/lib/opentok/index"
import { logoutSession } from "@/lib/mongodb/video-session/index";
import { sendMessage, getMessages } from '@/lib/mongodb/messages/index'
import { sendEditorText } from "@/lib/mongodb/video-session/editor/index"
import io from 'socket.io-client';
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
import $ from 'jquery';
import DrawingBoard from "./DrawingBoard.vue"
import myEmitter from './events';


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
            this.menteesRole = mentees;
            this.mentorsRole = mentors.filter(mentor => mentor.role != "mentor#0");
            this.zeroMentor = mentors.filter(mentor => mentor.role == "mentor#0")[0];
            const messageData = await getMessages('Startup', this.sessionId);
            const socket = io.connect(`${process.env.NODE_ENV == 'production' ? process.env.VUE_APP_VANILLA_SERVER : "http://localhost:8081/"}live`);
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
                    self.content = data.data;
                }
            });
            const {session, publisher } = initializeSession(sessionId, token, this.$store.getters.currentSession.role);
            this.publisher = publisher;
            this.session = session;
            this.messages = messageData.data.messages;
            this.email = self.$store.getters.currentSession.email;

    
            $(document).on('click', '.quill-editor', function() {
                window.console.log("Click")
                sendEditorText(self.content, 1, self.sessionId, self.email)
            })

             $(document).on('keyup', '.quill-editor', function() {
                window.console.log("Keyup");
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
            tab: null,
            boardNumber: 1,
            workSpaceTabs: [{
                name: "Screen Share"
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
                        name: "Screen Share",
                        onClick: function(index) {
                            window.console.log(index)
                            this.currentTab = index;
                        }
                    }
                ]
                this.hideAddTabModal();
            } else {
                alert("Screen sharing is not supported in this browser.")
            }
        },
        initializeScreenSharing: function() {
            if(checkScreenSharing()) {
                this.screenSharingPublisher = initializeScreenSharing(this.session)
                this.sharingMyScreen = true
            } else {
                alert("Screen Sharing is not supported in this browser.")
            }
            
            
        },
        stopScreenSharing: function() {
            this.sharingMyScreen = false; 
            //this.session.unpublish(this.screenSharingPublisher);
            this.screenSharingPublisher.publishVideo(false);
        },
        addWhiteBoard: function() {
            this.workSpaceTabs = [
                    ...this.workSpaceTabs,
                    {
                        name: "Whiteboard",
                        onClick: function(index) {
                            window.console.log(this.currentTab)
                            this.currentTab = index;
                        }
                    }
                ]
                this.hideAddTabModal();
        },
        continueScreenSharing: function() {
            this.screenSharingPublisher.publishVideo(true);
        },
        addEditor: function() {
            this.workSpaceTabs = [
                    ...this.workSpaceTabs,
                    {
                        name: "Editor",
                        onClick: function(index) {
                            window.console.log(this.currentTab)
                            this.currentTab = index;
                        }
                    }
                ]
            this.hideAddTabModal();
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
    beforeDestroy() {
        this.editor.destroy()
    },
}
</script>

<style lang="sass">
    @import "../../assets/sass/Live/LiveTest.sass"
</style>