<template>
<div class="live-test">
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
                <div class="add-tab" @click="addYoutube">Youtube</div>
                <div class="add-tab" @click="hideAddTabModal">Cancel</div>
            </div>
            <v-spacer></v-spacer>
        </v-card>
    </v-dialog>
    <v-dialog v-model="library" max-width="990">
        <v-card>
            <v-container>
                <v-row>
                    <v-col cols="10">
                        <v-file-input multiple label="File input" accept=".pdf,.doc,.docx,.ppx,.ppt" @change="onUploadPdf"></v-file-input>
                    </v-col>
                    <v-col cols="2">
                        <v-btn @click="submitPdf" style="width: 100%; ">Submit</v-btn>
                    </v-col>
                </v-row>
            </v-container>
             <div>Media Library</div>
            <div v-for="(file,index) in files" v-bind:key="file">
                <v-img :src="file.thumbnail_url" max-width="300"/>
                <v-btn tile @click="addFile(index)">Open</v-btn>
            </div>
        </v-card>
    </v-dialog>
    <div class="live-navbar">
        <div v-if="isMentor">
            Lecturer Portal - Management - Prof Dr. Paul Cheng
        </div>
        <div v-else>
            Student Portal - Management - David Lin
        </div>
        <v-btn v-if="isMentor" tile color="indigo" @click="library = !library">Upload</v-btn>
        <button id="upload_widget" class="cloudinary-button">Upload files</button>
    </div>
    <div class="live-con">
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
                    background-color=#f1f2f6
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
                            <div v-if="item.name == 'SCREENSHARE'" style="height: 100%; " class="screen-share">
                                <div class="screen-children" id="screen-preview" ></div>
                                 <div class="share-my-screen" v-if="isMentor">
                                    <v-btn color="green darken-1" tile @click="initializeScreenSharing" v-if="!sharingMyScreen" class="screen-sharing-control">Share my screen</v-btn>
                                    <v-btn color="red darken-1" tile @click="stopScreenSharing" v-if="sharingMyScreen" class="screen-sharing-control">End screen sharing</v-btn>
                                    <v-btn color="green darken-1" tile @click="continueScreenSharing" v-if="!sharingMyScreen" class="screen-sharing-control">Continue screen sharing</v-btn>
                                </div>
                            </div>
                            <div class="screen-children whiteboard" id="screen-preview" v-if="item.name == 'DRAWING'">
                                <div class="signature-pad">
                                    <drawing-board id="hello" :datas="datas" :email="email" :sessionId="getSessionId"></drawing-board>
                                </div>
                            </div>
                            <div class="screen-children testing" id="screen-preview" v-if="item.name == 'TEXTEDITOR'">
                                    <quill-editor v-model="content" ref="myQuillEditor"
                                                    :options="editorOption">
                                    </quill-editor>
                            </div>
                            <div class="video-tab" v-if="item.name == 'VIDEO'">
                                <div class="video-upload">
                                    <v-container style="height: 100%; flex-grow: 1; ">
                                            <video-player   @play="onPlayerPlayVideo($event)"
                                    @pause="onPlayerPauseVideo($event)" class="video-player-box" ref="videoPlayer" :options="item.option" >
                                        </video-player>
                                    </v-container>
                                </div>
                            </div>
                            <div class="video-youtube" v-if="item.name == 'YOUTUBE'">
                                <v-container style="height: 80px; ">
                                    <v-row>
                                        <v-col cols="10">
                                            <v-text-field
                                                label="Enter a youtube video url"
                                                single-line
                                                solo
                                                v-model="youtubeId"
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="2">
                                            <v-btn @click="searchVideo" large style="width: 100%; ">Get</v-btn>
                                        </v-col>
                                    </v-row>
                                </v-container>
                                <v-container style="height: 100%; flex-grow: 1; ">
                                    <youtube :video-id="videoId" ref="youtube" @playing="playing" @ready="videoLoader = false; " width="100%" height="100%"></youtube>
                                    <div v-if="videoLoader" class="video-loader">
                                        <vue-loaders name="ball-rotate" color="indigo" scale="1"></vue-loaders>
                                    </div>
                                </v-container>
                            </div>
                            <div class="file-viewer-tab" v-if="item.name == 'FILEVIEWER'">
                                <v-img v-for="image in item.images" :src="image" max-width="300" v-bind:key="image"/>
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
import { sendVideoLink, sendVideoEvent } from "@/lib/mongodb/video-session/video/index"
import { sendFileLink, submitPdf } from "@/lib/mongodb/video-session/file/index"

const VIDEO = 'VIDEO';
const FILEVIEWER = 'FILEVIEWER';
const SCREENSHARE = 'SCREENSHARE';
const DRAWING = 'DRAWING';
const TEXTEDITOR = 'TEXTEDITOR';
const YOUTUBE = 'YOUTUBE';



const tabOptions = new Map([
    [
        VIDEO, 
        {
            name: VIDEO,
            option: null,
            tabLimit: false
        }
    ],
    [
        SCREENSHARE,
        {
            name: SCREENSHARE,
            tabLimit: {
                num: 1
            }
        }
    ],
    [
        DRAWING,
        {
            name: DRAWING,
            tabLimit: false
        }
    ],
    [
        FILEVIEWER,
        {
            name: FILEVIEWER,
            tabLimit: false
        }
    ],
    [
        TEXTEDITOR,
        {
            name: TEXTEDITOR,
            tabLimit: false
        }
    ],
    [
        YOUTUBE,
        {
            name: YOUTUBE,
            tabLimit: false
        }
    ]
])

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
            var myWidget = window.cloudinary.createUploadWidget({
                cloudName: 'dnsrf3okp', 
                uploadPreset: 'zwwi8cxw',
                sources: ['local']
            }, (error, result) => { 
                    if (!error && result && result.event === "success") { 
                        window.console.log('Done! Here is the image info: ', result.info); 
                        var array = [];
                        if(result.info.pages > 0) {
                            for(let i = 1; i <= result.info.pages; i++) {
                                array.push(`https://res.cloudinary.com/dnsrf3okp/image/upload/c_fill,pg_${i}/v${result.info.version}/${result.info.public_id}.jpg`)
                            }
                            self.files = [
                                ...self.files,
                                {
                                    thumbnail_url: `https://res.cloudinary.com/dnsrf3okp/image/upload/c_fill/v${result.info.version}/${result.info.public_id}.jpg`,
                                    images: array,
                                    resource_type: 'document'
                                }
                            ]
                        } else if(result.info.resource_type == 'video') {
                            self.files = [
                                ...self.files,
                                {
                                    thumbnail_url: `https://res.cloudinary.com/dnsrf3okp/video/upload/c_fill/v${result.info.version}/${result.info.public_id}.jpg`,
                                    images: result.info.secure_url,
                                    resource_type: 'video'
                                }
                            ]
                        } 
                        else {
                            self.files = [
                                ...self.files,
                                {
                                    thumbnail_url: `https://res.cloudinary.com/dnsrf3okp/image/upload/c_fill/v${result.info.version}/${result.info.public_id}.jpg`,
                                    images: [result.info.secure_url],
                                    resource_type: 'others'
                                }
                            ]
                        }
                    }
                }
            )

            // Once connect, emit sessionId to join the matching room
            socket.on('connect', function() {
                socket.emit('room', self.sessionId);
            });

            initializeSession(self, token, sessionId, function(publisher, session) {
                self.publisher = publisher;
                self.session = session;

                if(!self.isMentor) {
                    self.publisher.publishAudio(false);
                    self.muted = true;
                }
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

            socket.on('video-link', function(data) {
                window.console.log(data)
                if(data.email !== self.email) {
                    self.playerOptions = [...self.playerOptions, {
                        // videojs options
                        language: 'en',
                        playbackRates: [0.7, 1.0, 1.5, 2.0],
                        sources: [{
                            type: "video/mp4",
                            src: data.videoLink
                        }],
                        fullscreen: {
                            options: {navigationUI: 'hide'}
                        }
                    }];
                    let length = self.playerOptions.length;
                    self.setNewTab(self.returnWantedTab(VIDEO), {
                        option: self.playerOptions[length - 1],
                    })
                }
            })

            // socket.on('file-link', function(data) {
            
            // })

            socket.on('video-event', function(data) {
                if(data.email !== self.email) {
                    if(data.event == 'play') {
                        //self.$refs.videoPlayer.player.play()
                        window.console.log($('.video-player-box').find('video').get()[0].play())
                    } else if(data.event == 'pause') {
                        //self.$refs.videoPlayer.player.pause()
                        window.console.log($('.video-player-box').find('video').get()[0].pause())
                    }
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

            document.getElementById("upload_widget").addEventListener("click", function(){
                myWidget.open();
            }, false);
        }
        catch(e) {
            alert(e);
        }
    },
    data: function() {
        return {
            numPages: 1,
            currentPage: 1,
            pageCount: 0,
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
            menteesRole: [],
            zeroMentor: null,
            showEndSession: false,
            showAddTab: false,
            library: false,
            active_tab: null,
            fileTab: null,
            boardNumber: 1,
            videoId: 'lG0Ys-2d4MA',
            workSpaceTabs: [{
                name: SCREENSHARE,
            }
            ],
            file: "",
            files: [],
            youtubeId: "",
            youtubeVideo: false,
            sharingMyScreen: false,
            tab: null,
            fileUrl: '',
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
            },
            playerOptions: [],
            videoLoader: true,
            pdfFile: null
        }
    },
    methods: {
        submitPdf: async function() {
            //var self = this;
            const formData = new FormData();
            formData.append('pdf', this.pdfFile);
            window.console.log(this.pdfFile)
            const data = await submitPdf(this.sessionId, formData);
            window.console.log(data.data);
        },
        returnWantedTab: function(nameOfTab, option) {
            return {
                ...tabOptions.get(nameOfTab),
                ...option
            };
        },
        setNewTab: function(newTab) {
            this.workSpaceTabs = [
                ...this.workSpaceTabs,
                {
                    ...newTab
                }
            ]
        },
        addYoutube: async function() {
            if(!this.isMentor) return
            this.setNewTab(this.returnWantedTab(YOUTUBE));
            this.sendNewTab(YOUTUBE)
            this.setActiveTab();
            this.hideAddTabModal();
        },
        addScreenShare: function() {
            if(!this.isMentor) return
            if(checkScreenSharing()) {
                this.setNewTab(this.returnWantedTab(SCREENSHARE));
                this.hideAddTabModal();
                this.setActiveTab();
                this.sendNewTab(SCREENSHARE);
            } else {
                alert("Screen sharing is not supported in this browser.")
            }
        },
        addEditor: function() {
            if(!this.isMentor) return
            this.setNewTab(this.returnWantedTab(TEXTEDITOR));
            this.hideAddTabModal();
            this.sendNewTab(TEXTEDITOR);
            this.setActiveTab();
        },
        addVideo: function(i) {
            if(!this.isMentor) return
            window.console.log(this.files[i].images)
            this.setNewTab(this.returnWantedTab(VIDEO,{ option: {
                // videojs options
                language: 'en',
                playbackRates: [0.7, 1.0, 1.5, 2.0],
                sources: [{
                    type: "video/mp4",
                    src: this.files[i].images
                }],
                fullscreen: {
                    options: {navigationUI: 'hide'}
                }
            }}))
            this.library = false;
            this.setActiveTab();
        },
        addWhiteBoard: function() {
            if(!this.isMentor) return
            this.setNewTab(this.returnWantedTab(DRAWING));
            this.hideAddTabModal();
            this.setActiveTab();
            this.sendNewTab(DRAWING)
        },
        onPlayerPlayVideo: async function() {
            sendVideoEvent(this.sessionId, this.email, 'play')
        },
        onPlayerPauseVideo: async function() {
            sendVideoEvent(this.sessionId, this.email, 'pause')
        },
        displayVideo: async function(index) {
            window.console.log(this.playerOptions[index].sources[0].src);
            try {
                await sendVideoLink(this.playerOptions[index].sources[0].src,  this.sessionId, this.email)
                this.addVideo(index);
            }catch(e) {
                window.console.log(e)
            }
        },
        playVideo() {
            this.player.playVideo()
        },
        playing() {
            window.console.log('we are watching!!!')
        },
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
        initializeScreenSharing: function() {
            if(!this.isMentor) return
            if(checkScreenSharing()) {
                this.screenSharingPublisher = initializeScreenSharing(this.session)
                this.sharingMyScreen = true
            } else {
                alert("Screen Sharing is not supported in this browser.")
            }
        },
        // Try stop screen sharing: Unpublish it, continue screen sharing: initialize again
        stopScreenSharing: function() {
            if(!this.isMentor) return
            this.sharingMyScreen = false; 
            //this.session.unpublish(this.screenSharingPublisher);
            this.screenSharingPublisher.publishVideo(false);
        },
        continueScreenSharing: function() {
            if(!this.isMentor) return
            this.screenSharingPublisher.publishVideo(true);
        },
        displayFile: async function(index) {
            try {
                await sendFileLink(this.sessionId, this.email, this.files[index].location)
                this.addFile(index);
            }catch(e) {
                window.console.log(e);
            }
        },
        addFile: function(i) {
            if(!this.isMentor) return
            if(this.files[i].resource_type == 'document' || this.files[i].resource_type == 'others') {
                this.setNewTab(this.returnWantedTab(FILEVIEWER, this.files[i]))
            } else if(this.files[i].resource_type == 'video') {
                this.addVideo(i)
            }
            this.library = false;
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
        removeMentee: function(role) {
            this.menteesRole = this.menteesRole.filter(mentee => mentee.role !== role);
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
        },
        searchVideo: function() {
            if(this.youtubeId.trim().length > 0) {
                const id = this.$youtube.getIdFromUrl(this.youtubeId.trim())
                this.videoId = id;
            }
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
        },
        player() {
            return this.$refs.youtube.player
        }
    },
    watch: {
        active_tab: function() {
            this.handleTabChange(this.active_tab)
        }
    },
    beforeDestroy() {
        this.editor.destroy();
    },
}
</script>

<style lang="sass">
    @import "../../assets/sass/Live/LiveTest.sass"
</style>